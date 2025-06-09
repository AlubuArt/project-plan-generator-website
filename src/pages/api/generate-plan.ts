import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import {
  checkRateLimit,
  validateProjectIdeaInput,
  RATE_LIMITS,
  getClientIP,
} from '@/utils/security';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTemplatePrompt = (template: 'next' | 'vercel-ai' = 'next') => {
  const basePrompt = `You are an expert project manager and technical lead specializing in creating EXECUTABLE project plans. Your goal is to transform ideas into actionable plans with specific user stories, clear acceptance criteria, and tasks that can be marked as complete.

CRITICAL: Focus on creating a plan that a developer can immediately execute, with each task having clear "done" criteria.`;

  const templateSpecificInfo = {
    next: `
TECHNICAL CONTEXT: This project will be created using create-vibe-code-app with the Next.js template:
- Next.js 14 with App Router and TypeScript
- Tailwind CSS for styling 
- ESLint & Prettier configuration
- AI assistant configuration (.cursor/rules/)
- Modern React patterns and hooks

OPTIMIZATION: Structure your recommendations around this Next.js stack. Include specific file paths, component structures, and Next.js best practices.`,
    'vercel-ai': `
TECHNICAL CONTEXT: This project will be created using create-vibe-code-app with the Vercel AI template:
- Next.js 14 with App Router and TypeScript
- Tailwind CSS for styling
- Vercel AI SDK pre-configured with OpenAI
- Streaming chat responses and AI hooks
- AI assistant configuration (.cursor/rules/)

OPTIMIZATION: Focus heavily on AI-powered features. Include specific recommendations for OpenAI integration, prompt engineering, function calling, RAG patterns, and AI UX best practices.`,
  };

  return `${basePrompt}

${templateSpecificInfo[template]}

STRUCTURE YOUR RESPONSE with these EXACT sections:

## 1. Project Overview
- **Goal**: One clear sentence describing the main objective
- **Success Metrics**: 2-3 measurable outcomes
- **Timeline**: Estimated completion time

## 2. User Stories & Acceptance Criteria
Create 5-8 user stories in this format:
**US-01: [User Story Title]**
- **As a** [user type], **I want** [functionality] **so that** [benefit]
- **Acceptance Criteria:**
  - [ ] Specific, testable requirement 1
  - [ ] Specific, testable requirement 2
  - [ ] Specific, testable requirement 3
- **Definition of Done:** Clear completion criteria

## 3. Technical Implementation Plan
Break down into specific, executable tasks:

### Phase 1: Foundation (Week 1)
- [ ] **Task**: Set up project structure
  - **Details**: Create specific folders/files
  - **Done when**: All base files created and running
- [ ] **Task**: Configure [specific technology]
  - **Details**: Exact configuration steps
  - **Done when**: Feature works as expected

### Phase 2: Core Features (Week 2)
- [ ] **Task**: Implement [specific feature]
  - **Details**: Exact components/functions to build
  - **Done when**: Feature passes specific tests

### Phase 3: Polish & Deploy (Week 3)
- [ ] **Task**: Add [specific enhancement]
  - **Details**: Exact implementation requirements
  - **Done when**: Meets specific criteria

## 4. Technical Architecture
- **File Structure**: Key directories and files to create
- **Key Components**: List 3-5 main React components with their responsibilities
- **API Endpoints**: Specific routes and their functions (if applicable)
- **Database Schema**: Tables/collections needed (if applicable)

## 5. Risk Assessment & Mitigation
| Risk | Impact | Probability | Mitigation Strategy |
|------|---------|-------------|-------------------|
| [Specific risk] | High/Med/Low | High/Med/Low | [Actionable solution] |

## 6. Next Steps (Immediate Actions)
1. **First 30 minutes**: [Specific setup task]
2. **First day**: [Specific development milestone] 
3. **First week**: [Specific feature completion]

REQUIREMENTS:
- Use checkboxes [ ] for all actionable items
- Be specific about file names, component names, and implementation details
- Include actual code examples where helpful
- Make each task small enough to complete in 1-4 hours
- Ensure every user story has 3-5 testable acceptance criteria
- Focus on ${template === 'vercel-ai' ? 'AI-powered features and OpenAI integration' : 'modern web development patterns'}

User idea: `;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limiting first
  const rateLimit = checkRateLimit(req, RATE_LIMITS.AI_GENERATION);

  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetTime).toISOString();
    return res.status(429).json({
      error: 'Rate limit exceeded. Too many AI generation requests.',
      resetTime: resetDate,
      limit: RATE_LIMITS.AI_GENERATION.maxRequests,
    });
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.AI_GENERATION.maxRequests);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
  res.setHeader(
    'X-RateLimit-Reset',
    new Date(rateLimit.resetTime).toISOString()
  );

  const { idea, template = 'next' } = req.body;

  // Validate input
  if (!idea || typeof idea !== 'string') {
    return res
      .status(400)
      .json({ error: 'Project idea is required and must be a string' });
  }

  // Enhanced input validation
  const validation = validateProjectIdeaInput(idea);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (template && !['next', 'vercel-ai'].includes(template)) {
    return res
      .status(400)
      .json({ error: 'Template must be either "next" or "vercel-ai"' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: 'AI service temporarily unavailable' });
  }

  const clientIP = getClientIP(req);
  console.log(
    `AI Generation request from IP: ${clientIP}, idea length: ${idea.length}`
  );

  try {
    const prompt = getTemplatePrompt(template as 'next' | 'vercel-ai');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: prompt + idea,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
      // Additional safety parameters
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    const plan = completion.choices[0]?.message?.content;

    if (!plan) {
      return res.status(500).json({ error: 'Failed to generate plan' });
    }

    // Log successful generation (without sensitive data)
    console.log(
      `Successfully generated plan for IP: ${clientIP}, template: ${template}`
    );

    res.status(200).json({
      plan,
      template,
      remainingRequests: rateLimit.remaining,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Don't expose internal errors to client
    const errorMessage =
      error instanceof Error && error.message.includes('rate_limit')
        ? 'AI service is currently busy. Please try again later.'
        : 'Failed to generate plan. Please try again.';

    res.status(500).json({ error: errorMessage });
  }
}

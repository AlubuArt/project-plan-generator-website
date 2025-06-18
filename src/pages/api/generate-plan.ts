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

// External API configuration
const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL || 'http://127.0.0.1:8000';
const USE_EXTERNAL_API = process.env.USE_EXTERNAL_API === 'true';

// Function to call external planning API
async function callExternalPlanningAPI(
  projectName: string,
  projectRequirements: string,
  template: 'next' | 'vercel-ai',
  maxIterations: number = 3
) {
  const requestBody = {
    project_name: projectName,
    project_requirements: projectRequirements,
    max_iterations: maxIterations,
    output_format: 'markdown',
  };

  // Ensure URL doesn't have trailing slash to avoid double slashes
  const baseUrl = EXTERNAL_API_URL.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/generate-project-plan`;

  console.log(`Calling external API at ${apiUrl}`);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    // Add timeout for external requests - increased to 10 minutes for AI processing
    signal: AbortSignal.timeout(600000), // 10 minutes timeout
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        `External API responded with ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.error || 'External API returned unsuccessful response'
    );
  }

  // Return the markdown content from the external API
  return data.markdown || data.project_plan?.markdown || 'No plan generated';
}

// Generate a project name from the idea
function generateProjectName(idea: string): string {
  // Extract key words and create a concise project name
  const words = idea
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 3);

  return (
    words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') +
    ' Project'
  );
}

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

  const { idea, template = 'next', apiMode } = req.body;

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

  if (apiMode && !['openai', 'external'].includes(apiMode)) {
    return res
      .status(400)
      .json({ error: 'API mode must be either "openai" or "external"' });
  }

  // Determine which API to use: UI selection takes priority over environment variable
  const useExternalApi =
    apiMode === 'external' || (apiMode !== 'openai' && USE_EXTERNAL_API);

  const clientIP = getClientIP(req);
  console.log(
    `AI Generation request from IP: ${clientIP}, idea length: ${idea.length}, using external API: ${useExternalApi} (UI: ${apiMode}, ENV: ${USE_EXTERNAL_API})`
  );

  try {
    let plan: string;

    if (useExternalApi) {
      // Use external planning API
      console.log('Using external planning API...');

      const projectName = generateProjectName(idea);
      const enhancedRequirements = `${idea}\n\nTemplate: ${template}\nTechnical Context: ${template === 'vercel-ai' ? 'Focus on AI-powered features with Vercel AI SDK' : 'Focus on Next.js best practices'}`;

      plan = await callExternalPlanningAPI(
        projectName,
        enhancedRequirements,
        template,
        3 // max_iterations
      );
    } else {
      // Use OpenAI API (existing implementation)
      if (!process.env.OPENAI_API_KEY) {
        return res
          .status(500)
          .json({ error: 'AI service temporarily unavailable' });
      }

      console.log('Using OpenAI API...');

      const prompt = getTemplatePrompt(template as 'next' | 'vercel-ai');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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

      plan = completion.choices[0]?.message?.content || '';

      if (!plan) {
        return res.status(500).json({ error: 'Failed to generate plan' });
      }
    }

    // Log successful generation (without sensitive data)
    console.log(
      `Successfully generated plan for IP: ${clientIP}, template: ${template}, method: ${useExternalApi ? 'external' : 'openai'}`
    );

    res.status(200).json({
      plan,
      template,
      remainingRequests: rateLimit.remaining,
      generationMethod: useExternalApi ? 'external' : 'openai',
    });
  } catch (error) {
    console.error('Plan generation error:', error);

    // Handle different error types
    let errorMessage = 'Failed to generate plan. Please try again.';

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage =
          'Request timeout. The external service took too long to respond.';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = 'AI service is currently busy. Please try again later.';
      } else if (useExternalApi && error.message.includes('fetch')) {
        errorMessage =
          'External planning service is unavailable. Please try again later.';
      }
    }

    res.status(500).json({
      error: errorMessage,
      generationMethod: useExternalApi ? 'external' : 'openai',
    });
  }
}

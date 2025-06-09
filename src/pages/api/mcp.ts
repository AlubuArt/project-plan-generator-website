import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';
import OpenAI from 'openai';
import { z } from 'zod';

// Environment validation
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is required');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Schemas (same as stdio version)
const GeneratePlanArgsSchema = z.object({
  idea: z
    .string()
    .min(20)
    .max(1000)
    .describe('The project idea to transform into a plan'),
  template: z
    .enum(['next', 'vercel-ai'])
    .optional()
    .default('next')
    .describe('The template to use for the project plan'),
});

const ValidateIdeaArgsSchema = z.object({
  idea: z.string().describe('The project idea to validate'),
});

const EncodeShareUrlArgsSchema = z.object({
  plan: z.string().describe('The project plan content to encode'),
  idea: z.string().describe('The original project idea'),
});

// Template prompt function (same as stdio version)
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

// Utility functions (same as stdio version)
function validateProjectIdeaInput(idea: string): {
  valid: boolean;
  error?: string;
} {
  if (!idea || typeof idea !== 'string') {
    return {
      valid: false,
      error: 'Project idea is required and must be a string',
    };
  }

  if (idea.length < 20) {
    return {
      valid: false,
      error: 'Project idea must be at least 20 characters long',
    };
  }

  if (idea.length > 1000) {
    return {
      valid: false,
      error: 'Project idea must be less than 1000 characters',
    };
  }

  const suspiciousPatterns = [
    /hack|exploit|virus|malware/i,
    /illegal|piracy|crack/i,
    /porn|adult|explicit/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(idea)) {
      return {
        valid: false,
        error: 'Project idea contains inappropriate content',
      };
    }
  }

  return { valid: true };
}

function encodeForUrl(plan: string, idea: string): string {
  try {
    const data = { plan, idea, timestamp: Date.now() };
    const jsonString = JSON.stringify(data);
    const base64 = Buffer.from(jsonString).toString('base64url');
    return base64;
  } catch (error) {
    throw new Error('Failed to encode plan for sharing');
  }
}

// Create MCP server function
function createMCPServer(): Server {
  const server = new Server(
    {
      name: 'project-plan-generator-http',
      version: '1.0.0',
      description:
        'Generate comprehensive project plans from ideas using AI (HTTP version)',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'generate_project_plan',
          description:
            'Generate a comprehensive project plan from a project idea using AI. Returns a structured plan with user stories, technical implementation details, and actionable tasks.',
          inputSchema: {
            type: 'object',
            properties: {
              idea: {
                type: 'string',
                description:
                  'The project idea to transform into a plan (20-1000 characters)',
                minLength: 20,
                maxLength: 1000,
              },
              template: {
                type: 'string',
                enum: ['next', 'vercel-ai'],
                description:
                  "The template to use: 'next' for general Next.js projects, 'vercel-ai' for AI-powered projects",
                default: 'next',
              },
            },
            required: ['idea'],
          },
        },
        {
          name: 'validate_project_idea',
          description:
            'Validate a project idea for content and length requirements before generating a plan.',
          inputSchema: {
            type: 'object',
            properties: {
              idea: {
                type: 'string',
                description: 'The project idea to validate',
              },
            },
            required: ['idea'],
          },
        },
        {
          name: 'encode_plan_for_sharing',
          description:
            'Encode a project plan and idea into a shareable URL-safe format.',
          inputSchema: {
            type: 'object',
            properties: {
              plan: {
                type: 'string',
                description: 'The project plan content to encode',
              },
              idea: {
                type: 'string',
                description: 'The original project idea',
              },
            },
            required: ['plan', 'idea'],
          },
        },
      ],
    };
  });

  // List resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'project-plan://templates/next',
          name: 'Next.js Project Template',
          description:
            'Information about the Next.js project template with App Router and TypeScript',
        },
        {
          uri: 'project-plan://templates/vercel-ai',
          name: 'Vercel AI Project Template',
          description:
            'Information about the Vercel AI template with OpenAI integration',
        },
        {
          uri: 'project-plan://guidelines/user-stories',
          name: 'User Story Guidelines',
          description:
            'Best practices for writing effective user stories with acceptance criteria',
        },
        {
          uri: 'project-plan://guidelines/technical-tasks',
          name: 'Technical Task Guidelines',
          description:
            'Guidelines for breaking down technical implementation into actionable tasks',
        },
      ],
    };
  });

  // Read resources (same as stdio version)
  server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request: ReadResourceRequest) => {
      const uri = request.params.uri;

      switch (uri) {
        case 'project-plan://templates/next':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: `# Next.js Project Template

## Technology Stack
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint & Prettier for code quality
- Modern React patterns and hooks

## Project Structure
\`\`\`
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── utils/
└── types/
\`\`\`

## Best Practices
- Use server components by default
- Implement proper error boundaries
- Follow TypeScript strict mode
- Use Tailwind utility classes
- Implement responsive design patterns`,
              },
            ],
          };

        case 'project-plan://templates/vercel-ai':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: `# Vercel AI Project Template

## Technology Stack
- Next.js 14 with App Router
- TypeScript for type safety
- Vercel AI SDK for AI integration
- OpenAI API for language models
- Streaming responses with React hooks

## AI-Specific Features
- Pre-configured OpenAI client
- Streaming chat interfaces
- Function calling capabilities
- RAG (Retrieval Augmented Generation) patterns
- AI-powered form validation

## Implementation Patterns
- Use \`useChat\` hook for conversations
- Implement streaming responses
- Design prompt engineering workflows
- Create AI-powered user experiences`,
              },
            ],
          };

        case 'project-plan://guidelines/user-stories':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: `# User Story Guidelines

## Format
**US-XX: [User Story Title]**
- **As a** [user type], **I want** [functionality] **so that** [benefit]
- **Acceptance Criteria:**
  - [ ] Specific, testable requirement 1
  - [ ] Specific, testable requirement 2
  - [ ] Specific, testable requirement 3
- **Definition of Done:** Clear completion criteria

## Best Practices
- Keep stories small and focused
- Include 3-5 testable acceptance criteria
- Define clear completion criteria
- Focus on user value and business impact
- Use specific, measurable language`,
              },
            ],
          };

        case 'project-plan://guidelines/technical-tasks':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: `# Technical Task Guidelines

## Task Structure
- [ ] **Task**: Brief, action-oriented title
  - **Details**: Specific implementation requirements
  - **Done when**: Clear completion criteria

## Best Practices
- Break tasks into 1-4 hour chunks
- Include specific file names and paths
- Provide code examples when helpful
- Define measurable completion criteria
- Order tasks by dependencies
- Include testing requirements`,
              },
            ],
          };

        default:
          throw new Error(`Resource not found: ${uri}`);
      }
    }
  );

  // Handle tool calls
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_project_plan': {
            const validatedArgs = GeneratePlanArgsSchema.parse(args);
            const { idea, template } = validatedArgs;

            const validation = validateProjectIdeaInput(idea);
            if (!validation.valid) {
              throw new Error(validation.error);
            }

            if (!OPENAI_API_KEY) {
              throw new Error('OpenAI API key not configured');
            }

            const prompt = getTemplatePrompt(template);
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
              frequency_penalty: 0.3,
              presence_penalty: 0.3,
            });

            const plan = completion.choices[0]?.message?.content;
            if (!plan) {
              throw new Error('Failed to generate project plan');
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      success: true,
                      plan,
                      template,
                      idea,
                      generatedAt: new Date().toISOString(),
                      wordCount: plan.split(' ').length,
                      characterCount: plan.length,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'validate_project_idea': {
            const validatedArgs = ValidateIdeaArgsSchema.parse(args);
            const { idea } = validatedArgs;

            const validation = validateProjectIdeaInput(idea);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      valid: validation.valid,
                      error: validation.error || null,
                      characterCount: idea.length,
                      wordCount: idea.split(' ').length,
                      suggestions: validation.valid
                        ? [
                            'Your idea looks good! Ready for plan generation.',
                            'Consider adding more specific details about your target users.',
                            'Think about the main features you want to prioritize.',
                          ]
                        : [
                            'Please provide more details about your project idea.',
                            'Ensure your idea is between 20-1000 characters.',
                            'Focus on describing the problem you want to solve.',
                          ],
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'encode_plan_for_sharing': {
            const validatedArgs = EncodeShareUrlArgsSchema.parse(args);
            const { plan, idea } = validatedArgs;

            const encodedData = encodeForUrl(plan, idea);
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:3000';
            const shareUrl = `${baseUrl}/plan/${encodedData}`;

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      success: true,
                      encodedData,
                      shareUrl,
                      planLength: plan.length,
                      ideaLength: idea.length,
                      expiresAt: null,
                      instructions:
                        'Share this URL to let others view the project plan',
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                  tool: name,
                  timestamp: new Date().toISOString(),
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }
  );

  return server;
}

// Store for server instances and their state
const servers = new Map<string, { server: Server; initialized: boolean }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      serverInfo: {
        name: 'project-plan-generator-http',
        version: '1.0.0',
        description:
          'Generate comprehensive project plans from ideas using AI (HTTP version)',
      },
      endpoints: {
        mcp: '/api/mcp',
        methods: ['POST', 'OPTIONS'],
      },
      session: {
        count: servers.size,
        maxSessions: 10,
      },
    });
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, mcp-session-id, Accept'
    );
    res.status(200).end();
    return;
  }

  // Only allow POST for MCP protocol
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST', 'OPTIONS', 'GET'],
    });
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, mcp-session-id, Accept'
  );
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  try {
    // Use a more flexible session ID approach
    const sessionId =
      (req.headers['mcp-session-id'] as string) ||
      (req.headers['x-session-id'] as string) ||
      'default-session';

    console.log(`[MCP] Handling request for session: ${sessionId}`);

    // Get or create server instance
    let serverData = servers.get(sessionId);
    if (!serverData) {
      console.log(
        `[MCP] Creating new server instance for session: ${sessionId}`
      );
      const server = createMCPServer();
      serverData = { server, initialized: false };
      servers.set(sessionId, serverData);

      // Clean up old sessions (keep only last 10)
      if (servers.size > 10) {
        const oldestSessionIterator = servers.keys().next();
        if (!oldestSessionIterator.done) {
          const oldestSession = oldestSessionIterator.value;
          console.log(`[MCP] Cleaning up old session: ${oldestSession}`);
          servers.delete(oldestSession);
        }
      }
    }

    // Create transport for this request
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => sessionId,
    });

    // Connect server to transport if not already connected
    if (!serverData.initialized) {
      await serverData.server.connect(transport);
      serverData.initialized = true;
    } else {
      // Reconnect for this request
      await serverData.server.connect(transport);
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP HTTP Server error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
        data: error instanceof Error ? error.message : String(error),
      },
      id: null,
    });
  }
}

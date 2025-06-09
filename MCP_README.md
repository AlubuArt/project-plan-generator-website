# Model Context Protocol (MCP) Integration

This project now includes Model Context Protocol (MCP) support, allowing AI agents to interact directly with the project plan generator without going through the web UI.

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables AI models to securely connect with external data sources and tools. It provides a standardized way for AI agents to access and interact with applications programmatically.

## Features

Our MCP server exposes the following capabilities:

### 🛠️ Tools
- **generate_project_plan**: Generate comprehensive project plans from ideas
- **validate_project_idea**: Validate project ideas before plan generation
- **encode_plan_for_sharing**: Create shareable URLs for generated plans

### 📚 Resources
- **Next.js Template Info**: Technical details about the Next.js template
- **Vercel AI Template Info**: Information about AI-powered project templates
- **User Story Guidelines**: Best practices for writing user stories
- **Technical Task Guidelines**: Guidelines for breaking down technical tasks

## 🚀 Deployment Options

### Option 1: Local Stdio Server (Development)

For local development and testing:

```bash
# Build the MCP server
npm run build-mcp

# Test the integration
npm run mcp-test

# Run the server for AI agents
npm run mcp-server
```

### Option 2: HTTP Server on Vercel (Production) ⭐

**Perfect for deployment to Vercel!** The HTTP-based MCP server can be deployed as a Vercel API route.

#### Deploy to Vercel

1. **Deploy your app to Vercel:**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Set environment variables in Vercel:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_BASE_URL`: Your deployed URL (optional, auto-detected)

3. **Your MCP server will be available at:**
   ```
   https://your-app.vercel.app/api/mcp
   ```

#### Connect AI Agents to Deployed Server

Use the HTTP transport to connect to your deployed server:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new Client({
  name: "project-plan-client",
  version: "1.0.0"
});

const transport = new StreamableHTTPClientTransport(
  new URL("https://your-app.vercel.app/api/mcp")
);

await client.connect(transport);

// Now you can use the client
const tools = await client.listTools();
const result = await client.callTool({
  name: "generate_project_plan",
  arguments: {
    idea: "Create a social media dashboard for small businesses",
    template: "vercel-ai"
  }
});
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Local Development

```bash
# Build the stdio MCP server
npm run build-mcp

# Test the integration
npm run mcp-test
```

### 4. Production Deployment

```bash
# Deploy to Vercel (HTTP server included automatically)
vercel --prod
```

## Using with Claude Desktop

### Local Development

1. Build the MCP server:
   ```bash
   npm run build-mcp
   ```

2. Add the server configuration to your Claude Desktop config file (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "project-plan-generator": {
         "command": "node",
         "args": ["/absolute/path/to/your/project/dist/mcp-server.mjs"],
         "env": {
           "OPENAI_API_KEY": "your_openai_api_key_here",
           "NEXT_PUBLIC_BASE_URL": "http://localhost:3000"
         }
       }
     }
   }
   ```

### Production (Deployed to Vercel)

For production use, you'll need an MCP client that supports HTTP transport. The stdio version is primarily for local development.

## Example Usage with AI Agents

### Generate a Project Plan

```javascript
// AI agent can call this tool
await callTool({
  name: "generate_project_plan",
  arguments: {
    idea: "Create a social media dashboard for small businesses with analytics, post scheduling, and team collaboration features",
    template: "vercel-ai"  // or "next"
  }
});
```

### Validate an Idea

```javascript
await callTool({
  name: "validate_project_idea", 
  arguments: {
    idea: "Build an app"  // This would fail validation (too short)
  }
});
```

### Access Template Information

```javascript
await readResource({
  uri: "project-plan://templates/vercel-ai"
});
```

## API Reference

### Tools

#### `generate_project_plan`
Generates a comprehensive project plan from a project idea.

**Parameters:**
- `idea` (string, required): Project idea (20-1000 characters)
- `template` (string, optional): Either "next" or "vercel-ai" (default: "next")

**Returns:**
```json
{
  "success": true,
  "plan": "# Project Plan...",
  "template": "next",
  "idea": "Original idea text",
  "generatedAt": "2024-01-01T12:00:00.000Z",
  "wordCount": 1234,
  "characterCount": 5678
}
```

#### `validate_project_idea`
Validates a project idea for content and length requirements.

**Parameters:**
- `idea` (string, required): Project idea to validate

**Returns:**
```json
{
  "valid": true,
  "error": null,
  "characterCount": 156,
  "wordCount": 25,
  "suggestions": ["Your idea looks good!", "..."]
}
```

#### `encode_plan_for_sharing`
Encodes a project plan into a shareable URL format.

**Parameters:**
- `plan` (string, required): The project plan content
- `idea` (string, required): The original project idea

**Returns:**
```json
{
  "success": true,
  "encodedData": "base64url_encoded_data",
  "shareUrl": "https://your-app.vercel.app/plan/encoded_data",
  "planLength": 1234,
  "ideaLength": 156,
  "instructions": "Share this URL to let others view the project plan"
}
```

### Resources

#### Available Resources
- `project-plan://templates/next` - Next.js template information
- `project-plan://templates/vercel-ai` - Vercel AI template information  
- `project-plan://guidelines/user-stories` - User story best practices
- `project-plan://guidelines/technical-tasks` - Technical task guidelines

## Development

### Project Structure

```
src/
├── mcp-server.ts          # Local stdio MCP server
├── mcp-client-test.ts     # Test client for stdio server
├── pages/api/
│   ├── mcp.ts            # HTTP MCP server (for Vercel)
│   └── generate-plan.ts   # Web API (used by UI)
└── pages/api/             # Existing Next.js API routes

dist/                      # Compiled stdio MCP components
├── mcp-server.mjs
└── mcp-client-test.mjs

claude-desktop-config.json # Sample Claude Desktop configuration
tsconfig.mcp.json         # TypeScript config for MCP files
```

### Building

The MCP components use a separate TypeScript configuration:

```bash
# Build stdio server and test client
npm run build-mcp

# Run just the stdio server (for external clients)
npm run mcp-server

# Run the test demo
npm run mcp-test

# Deploy HTTP server (automatic with Vercel)
vercel --prod
```

### Adding New Tools

To add a new tool to both servers:

1. Define the input schema with Zod in both files
2. Add the tool to the tools list in `ListToolsRequestSchema` handler
3. Add the tool case in the `CallToolRequestSchema` handler
4. Implement the tool logic

### Adding New Resources

To add a new resource:

1. Add the resource to the `ListResourcesRequestSchema` handler
2. Add a case in the `ReadResourceRequestSchema` handler
3. Return the resource content in the appropriate format

## Troubleshooting

### Common Issues

**"OPENAI_API_KEY environment variable is required"**
- For local development: Set in `.env.local`
- For Vercel deployment: Set in Vercel environment variables
- For Claude Desktop: Set in the configuration file

**"Module not found" errors**
- Run `npm install` to ensure all dependencies are installed
- For stdio server: Run `npm run build-mcp`

**Connection issues**
- **Local stdio**: Verify the path to `mcp-server.mjs` is correct
- **HTTP server**: Ensure your Vercel deployment is successful
- Check that environment variables are properly set

### Debug Mode

You can add logging to both servers:

**Stdio server:**
```typescript
console.error("Debug info:", { someData }); // Won't interfere with MCP protocol
```

**HTTP server:**
```typescript
console.log("Debug info:", { someData }); // Normal logging
```

## Benefits of MCP Integration

1. **🌐 Deployable to Vercel**: HTTP version works with any cloud platform
2. **🔌 Local Development**: Stdio version for development and testing
3. **📊 Structured Data**: Tools return structured JSON responses
4. **📚 Resource Access**: AI agents can access template information
5. **🔒 Secure**: Proper environment isolation and validation
6. **🔧 Extensible**: Easy to add new tools and resources

## Use Cases

- **🤖 AI Development Assistants**: Generate project plans in development workflows
- **⚡ Automated Project Setup**: Create plans and scaffold projects programmatically
- **📦 Batch Processing**: Generate multiple plans via API
- **🔗 Integration with Tools**: Combine with project management, IDEs, etc.
- **🎯 Custom AI Agents**: Build specialized agents for project planning
- **☁️ Cloud Services**: Deploy as API for multiple applications

## Deployment Summary

| Version | Best For | Deployment | Client Connection |
|---------|----------|------------|-------------------|
| **Stdio** | Local development, Claude Desktop | Local only | `node dist/mcp-server.mjs` |
| **HTTP** | Production, Vercel, cloud | Vercel, any host | `https://your-app.vercel.app/api/mcp` |

This MCP integration transforms your project plan generator into a **powerful, deployable API** that any AI agent can leverage! 🚀 
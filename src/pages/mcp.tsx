import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const MCPDocumentation: React.FC = () => {
  return (
    <>
      <Head>
        <title>MCP Integration - ProjectPlan.ai</title>
        <meta
          name="description"
          content="Model Context Protocol integration for AI agents with ProjectPlan.ai"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ProjectPlan.ai
                  </h1>
                  <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                    v2.0
                  </span>
                </div>
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
              >
                Back to Generator
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">🤖</span>
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NEW: AI Agent Integration
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Model Context Protocol
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Integration
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect AI agents directly to ProjectPlan.ai for programmatic
              project plan generation. Perfect for automation, development
              workflows, and AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#quick-start"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="https://github.com/modelcontextprotocol/typescript-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/20 text-gray-700 rounded-xl hover:bg-white/90 transition-all duration-300 font-medium shadow-lg"
              >
                MCP Documentation
              </a>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What&apos;s Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Tools */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI Tools
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Generate project plans</li>
                  <li>• Validate project ideas</li>
                  <li>• Create shareable URLs</li>
                </ul>
              </div>

              {/* Resources */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Resources
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Template information</li>
                  <li>• User story guidelines</li>
                  <li>• Technical best practices</li>
                </ul>
              </div>

              {/* Deployment */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">☁️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Deploy Anywhere
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Local development</li>
                  <li>• Vercel production</li>
                  <li>• Claude Desktop</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section id="quick-start" className="py-16 bg-gray-900/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Quick Start Examples
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* HTTP Client Example */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  HTTP Client (Production)
                </h3>
                <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-100 overflow-x-auto">
                  <pre>{`import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from 
  "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new Client({
  name: "project-plan-client",
  version: "1.0.0"
});

const transport = new StreamableHTTPClientTransport(
  new URL("https://your-app.vercel.app/api/mcp")
);

await client.connect(transport);

// Generate a project plan
const result = await client.callTool({
  name: "generate_project_plan",
  arguments: {
    idea: "Build a social media dashboard",
    template: "vercel-ai"
  }
});`}</pre>
                </div>
              </div>

              {/* CLI Example */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Local Development
                </h3>
                <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-100 overflow-x-auto">
                  <pre>{`# Install dependencies
npm install

# Build MCP server
npm run build-mcp

# Test the integration
npm run mcp-test

# Run server for Claude Desktop
npm run mcp-server`}</pre>
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  Perfect for Claude Desktop integration and local AI
                  development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Available Tools & Resources
            </h2>

            <div className="space-y-8">
              {/* Tools */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🛠️</span>
                  Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      generate_project_plan
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Generate comprehensive project plans from ideas
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      idea: string, template?: &quot;next&quot; |
                      &quot;vercel-ai&quot;
                    </code>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      validate_project_idea
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Validate ideas before generating plans
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      idea: string
                    </code>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      encode_plan_for_sharing
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Create shareable URLs for plans
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      plan: string, idea: string
                    </code>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">📚</span>
                  Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-bold text-gray-900">Templates</h4>
                      <p className="text-gray-600 text-sm">
                        Next.js and Vercel AI template information
                      </p>
                    </div>
                    <div className="border-l-4 border-teal-500 pl-4">
                      <h4 className="font-bold text-gray-900">User Stories</h4>
                      <p className="text-gray-600 text-sm">
                        Best practices for writing user stories
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-bold text-gray-900">
                        Technical Tasks
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Guidelines for breaking down implementation
                      </p>
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h4 className="font-bold text-gray-900">
                        Best Practices
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Development workflows and patterns
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                <span className="text-4xl mb-4 block">🤖</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI Development Assistants
                </h3>
                <p className="text-gray-600">
                  Integrate with Claude, ChatGPT, or custom AI agents for
                  automated project planning.
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                <span className="text-4xl mb-4 block">⚡</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Automated Workflows
                </h3>
                <p className="text-gray-600">
                  Generate project plans as part of CI/CD pipelines or
                  development workflows.
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                <span className="text-4xl mb-4 block">🔧</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tool Integration
                </h3>
                <p className="text-gray-600">
                  Connect with project management tools, IDEs, and development
                  platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Deploy your own MCP-enabled project plan generator in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://vercel.com/new/clone?repository-url=https://github.com/your-username/vibe-code-project-plan-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
                >
                  Deploy to Vercel
                </a>
                <Link
                  href="/"
                  className="px-8 py-4 bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
                >
                  Try the Web Interface
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MCPDocumentation;

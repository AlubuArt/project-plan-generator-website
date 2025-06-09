#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
// Simple test client to demonstrate MCP server functionality
class ProjectPlanMCPClient {
    constructor() {
        this.transport = null;
        this.client = new Client({
            name: 'project-plan-test-client',
            version: '1.0.0',
        }, {
            capabilities: {},
        });
    }
    async connect(serverScriptPath) {
        // Start the MCP server
        this.transport = new StdioClientTransport({
            command: 'node',
            args: [serverScriptPath],
            env: {
                OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
            },
        });
        await this.client.connect(this.transport);
        console.log('Connected to Project Plan MCP Server');
    }
    async listTools() {
        const response = await this.client.listTools();
        console.log('\n=== Available Tools ===');
        response.tools.forEach(tool => {
            console.log(`- ${tool.name}: ${tool.description}`);
        });
        return response.tools;
    }
    async listResources() {
        const response = await this.client.listResources();
        console.log('\n=== Available Resources ===');
        response.resources.forEach(resource => {
            console.log(`- ${resource.name}: ${resource.description}`);
            console.log(`  URI: ${resource.uri}`);
        });
        return response.resources;
    }
    async generateProjectPlan(idea, template = 'next') {
        console.log(`\n=== Generating Project Plan ===`);
        console.log(`Idea: ${idea}`);
        console.log(`Template: ${template}`);
        const response = await this.client.callTool({
            name: 'generate_project_plan',
            arguments: { idea, template },
        });
        // Type assertion for response content
        const content = response.content;
        const result = JSON.parse(content[0].text || '{}');
        if (result.success) {
            console.log('\n✅ Plan Generated Successfully!');
            console.log(`📝 Plan length: ${result.characterCount} characters`);
            console.log(`📊 Word count: ${result.wordCount} words`);
            console.log(`⏰ Generated at: ${result.generatedAt}`);
            // Save to file for easy viewing
            const fs = await import('fs');
            const filename = `plan-${Date.now()}.md`;
            fs.writeFileSync(filename, result.plan);
            console.log(`💾 Plan saved to: ${filename}`);
            return result.plan;
        }
        else {
            console.error('❌ Failed to generate plan:', result.error);
            throw new Error(result.error);
        }
    }
    async validateIdea(idea) {
        console.log(`\n=== Validating Idea ===`);
        console.log(`Idea: "${idea}"`);
        const response = await this.client.callTool({
            name: 'validate_project_idea',
            arguments: { idea },
        });
        // Type assertion for response content
        const content = response.content;
        const result = JSON.parse(content[0].text || '{}');
        if (result.valid) {
            console.log('✅ Idea is valid!');
            console.log(`📏 Character count: ${result.characterCount}`);
            console.log(`📝 Word count: ${result.wordCount}`);
            result.suggestions.forEach((suggestion, index) => {
                console.log(`💡 ${index + 1}. ${suggestion}`);
            });
        }
        else {
            console.log('❌ Idea validation failed:', result.error);
            result.suggestions.forEach((suggestion, index) => {
                console.log(`💡 ${index + 1}. ${suggestion}`);
            });
        }
        return result;
    }
    async readResource(uri) {
        console.log(`\n=== Reading Resource ===`);
        console.log(`URI: ${uri}`);
        const response = await this.client.readResource({ uri });
        const content = response.contents[0];
        console.log(`📄 Content Type: ${content.mimeType}`);
        console.log(`📝 Content:\n${content.text}`);
        return content;
    }
    async encodeForSharing(plan, idea) {
        console.log(`\n=== Encoding Plan for Sharing ===`);
        const response = await this.client.callTool({
            name: 'encode_plan_for_sharing',
            arguments: { plan, idea },
        });
        // Type assertion for response content
        const content = response.content;
        const result = JSON.parse(content[0].text || '{}');
        if (result.success) {
            console.log('✅ Plan encoded successfully!');
            console.log(`🔗 Share URL: ${result.shareUrl}`);
            console.log(`📦 Encoded data length: ${result.encodedData.length} characters`);
            console.log(`📝 Instructions: ${result.instructions}`);
        }
        else {
            console.error('❌ Failed to encode plan:', result.error);
        }
        return result;
    }
    async runDemo() {
        try {
            // List available tools and resources
            await this.listTools();
            await this.listResources();
            // Read a template resource
            await this.readResource('project-plan://templates/next');
            // Example project idea
            const testIdea = 'Create a task management app for small teams with real-time collaboration, file sharing, and project timeline tracking. Users should be able to create projects, assign tasks, set deadlines, and communicate through comments.';
            // Validate the idea
            await this.validateIdea(testIdea);
            // Generate a project plan
            const plan = await this.generateProjectPlan(testIdea, 'next');
            // Encode for sharing
            await this.encodeForSharing(plan, testIdea);
            console.log('\n🎉 Demo completed successfully!');
        }
        catch (error) {
            console.error('❌ Demo failed:', error);
        }
    }
    async close() {
        if (this.transport) {
            await this.transport.close();
        }
    }
}
// Main execution
async function main() {
    if (process.argv.length < 3) {
        console.log('Usage: node mcp-client-test.js <path-to-mcp-server.js>');
        console.log('Example: node dist/mcp-client-test.js dist/mcp-server.js');
        process.exit(1);
    }
    const serverPath = process.argv[2];
    const client = new ProjectPlanMCPClient();
    try {
        await client.connect(serverPath);
        await client.runDemo();
    }
    finally {
        await client.close();
    }
}
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

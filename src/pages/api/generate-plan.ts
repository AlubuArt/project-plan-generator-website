import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTemplatePrompt = (template: 'next' | 'vercel-ai' = 'next') => {
  const basePrompt = `You are an expert project manager and technical lead. Transform the following idea into a comprehensive, structured project plan in Markdown format.`;

  const templateSpecificInfo = {
    next: `
This project will be created using create-vibe-code-app with the Next.js template, which includes:
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint & Prettier configuration
- AI assistant configuration (.cursor/rules/)

Optimize your technical recommendations for this modern Next.js stack.`,
    'vercel-ai': `
This project will be created using create-vibe-code-app with the Vercel AI template, which includes:
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Vercel AI SDK pre-configured
- OpenAI integration ready
- Streaming chat responses
- AI assistant configuration (.cursor/rules/)

Focus on AI-powered features and include specific recommendations for OpenAI integration, function calling, and AI user experience patterns.`,
  };

  return `${basePrompt}

${templateSpecificInfo[template]}

Your response should be ONLY the markdown content with these sections:
1. **Project Overview** - Brief description and goals
2. **Scope** - What's included and what's not  
3. **Key Features** - Main features to implement (emphasize AI features for vercel-ai template)
4. **Technical Requirements** - Technology stack and infrastructure (mention the chosen template)
5. **Milestones** - Major phases with timeline estimates
6. **Risk Assessment** - Potential challenges and mitigation strategies
7. **Next Steps** - Immediate actions to take (include environment setup for vercel-ai template)

Keep it concise but comprehensive. Use bullet points, tables, and clear formatting. The plan should be actionable and realistic for the selected template.

User idea: `;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea, template = 'next' } = req.body;

  if (!idea || typeof idea !== 'string') {
    return res
      .status(400)
      .json({ error: 'Idea is required and must be a string' });
  }

  if (idea.length < 10 || idea.length > 1000) {
    return res
      .status(400)
      .json({ error: 'Idea must be between 10 and 1000 characters' });
  }

  if (template && !['next', 'vercel-ai'].includes(template)) {
    return res
      .status(400)
      .json({ error: 'Template must be either "next" or "vercel-ai"' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const prompt = getTemplatePrompt(template as 'next' | 'vercel-ai');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt + idea,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message?.content;

    if (!plan) {
      return res.status(500).json({ error: 'Failed to generate plan' });
    }

    res.status(200).json({ plan, template });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res
      .status(500)
      .json({ error: 'Failed to generate plan. Please try again.' });
  }
}

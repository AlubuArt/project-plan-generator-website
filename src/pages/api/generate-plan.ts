import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROJECT_PLAN_PROMPT = `You are an expert project manager and technical lead. Transform the following idea into a comprehensive, structured project plan in Markdown format.

Your response should be ONLY the markdown content with these sections:
1. **Project Overview** - Brief description and goals
2. **Scope** - What's included and what's not
3. **Key Features** - Main features to implement
4. **Technical Requirements** - Technology stack and infrastructure
5. **Milestones** - Major phases with timeline estimates
6. **Risk Assessment** - Potential challenges and mitigation strategies
7. **Next Steps** - Immediate actions to take

Keep it concise but comprehensive. Use bullet points, tables, and clear formatting. The plan should be actionable and realistic.

User idea: `;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea } = req.body;

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

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: PROJECT_PLAN_PROMPT + idea,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message?.content;

    if (!plan) {
      return res.status(500).json({ error: 'Failed to generate plan' });
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res
      .status(500)
      .json({ error: 'Failed to generate plan. Please try again.' });
  }
}

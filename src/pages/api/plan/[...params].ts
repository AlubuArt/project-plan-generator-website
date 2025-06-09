import { NextApiRequest, NextApiResponse } from 'next';
import { decompressAndDecode } from '@/utils/encoding';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { params } = req.query;

    if (!params || !Array.isArray(params) || params.length === 0) {
      return res.status(400).json({ error: 'Missing plan ID' });
    }

    // Extract the plan ID from the URL (last parameter)
    const planId = params[params.length - 1];

    if (!planId || typeof planId !== 'string') {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Decode the plan content
    const planContent = decompressAndDecode(planId);

    if (!planContent) {
      return res.status(404).json({ error: 'Plan not found or invalid' });
    }

    // Set headers for raw markdown delivery
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CLI access

    // Return raw markdown content
    return res.status(200).send(planContent);
  } catch (error) {
    console.error('Error serving plan:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

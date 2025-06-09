import { NextApiRequest, NextApiResponse } from 'next';
import { planStorage } from './store';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/utils/security';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limiting
  const rateLimit = checkRateLimit(req, RATE_LIMITS.PLAN_RETRIEVAL);

  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetTime).toISOString();
    return res.status(429).json({
      error: 'Rate limit exceeded. Too many retrieval requests.',
      resetTime: resetDate,
      limit: RATE_LIMITS.PLAN_RETRIEVAL.maxRequests,
    });
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.PLAN_RETRIEVAL.maxRequests);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
  res.setHeader(
    'X-RateLimit-Reset',
    new Date(rateLimit.resetTime).toISOString()
  );

  const { id } = req.query;
  const clientIP = getClientIP(req);

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid plan ID' });
  }

  // Basic ID validation (should be 8 alphanumeric characters)
  if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid plan ID format' });
  }

  const plan = planStorage.get(id);

  if (!plan) {
    console.log(`Plan ${id} not found for IP ${clientIP}`);
    return res.status(404).json({ error: 'Plan not found or expired' });
  }

  console.log(`Plan ${id} retrieved by IP ${clientIP}`);

  // Set headers for raw markdown delivery (for CLI)
  if (req.headers.accept === 'text/plain') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(plan.content);
  }

  // Return JSON for web interface
  return res.status(200).json({ content: plan.content });
}

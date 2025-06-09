import { NextApiRequest, NextApiResponse } from 'next';
import { decompressAndDecode } from '@/utils/encoding';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/utils/security';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limiting (using same limit as plan retrieval)
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

  const { params } = req.query;
  const clientIP = getClientIP(req);

  if (!params || !Array.isArray(params) || params.length === 0) {
    return res.status(400).json({ error: 'Invalid plan parameters' });
  }

  // Join all params to handle encoded data with slashes
  const encodedData = params.join('/');

  if (!encodedData || typeof encodedData !== 'string') {
    return res.status(400).json({ error: 'Invalid encoded plan data' });
  }

  // Basic validation of encoded data format
  if (encodedData.length < 10 || encodedData.length > 10000) {
    return res.status(400).json({ error: 'Invalid encoded data length' });
  }

  // Validate base64-like characters (URL-safe)
  if (!/^[A-Za-z0-9_-]+$/.test(encodedData)) {
    return res.status(400).json({ error: 'Invalid encoded data format' });
  }

  try {
    const decodedContent = decompressAndDecode(encodedData);

    if (!decodedContent) {
      console.log(
        `Failed to decode plan for IP ${clientIP}, data length: ${encodedData.length}`
      );
      return res.status(400).json({ error: 'Invalid or corrupted plan data' });
    }

    console.log(
      `Legacy plan decoded for IP ${clientIP}, content length: ${decodedContent.length}`
    );

    // Set headers for raw markdown delivery (for CLI)
    if (req.headers.accept === 'text/plain') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).send(decodedContent);
    }

    // Return JSON for web interface
    return res.status(200).json({ content: decodedContent });
  } catch (error) {
    console.error(`Plan decoding error for IP ${clientIP}:`, error);
    return res.status(400).json({ error: 'Failed to decode plan data' });
  }
}

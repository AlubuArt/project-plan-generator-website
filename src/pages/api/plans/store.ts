import { NextApiRequest, NextApiResponse } from 'next';
import {
  checkRateLimit,
  validateStorageContent,
  RATE_LIMITS,
  getClientIP,
} from '@/utils/security';

// In-memory storage for demo purposes
// In production, you'd use Redis, Database, or file system
const planStorage = new Map<
  string,
  { content: string; createdAt: number; ip: string }
>();

// Cleanup old plans (older than 30 days)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const PLAN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

setInterval(() => {
  const now = Date.now();
  for (const [id, plan] of planStorage.entries()) {
    if (now - plan.createdAt > PLAN_EXPIRY) {
      planStorage.delete(id);
    }
  }
}, CLEANUP_INTERVAL);

function generateShortId(): string {
  // Generate a short, URL-friendly ID
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limiting
  const rateLimit = checkRateLimit(req, RATE_LIMITS.PLAN_STORAGE);

  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetTime).toISOString();
    return res.status(429).json({
      error: 'Rate limit exceeded. Too many storage requests.',
      resetTime: resetDate,
      limit: RATE_LIMITS.PLAN_STORAGE.maxRequests,
    });
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.PLAN_STORAGE.maxRequests);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
  res.setHeader(
    'X-RateLimit-Reset',
    new Date(rateLimit.resetTime).toISOString()
  );

  const { content } = req.body;
  const clientIP = getClientIP(req);

  if (!content || typeof content !== 'string') {
    return res
      .status(400)
      .json({ error: 'Content is required and must be a string' });
  }

  // Validate content
  const validation = validateStorageContent(content);
  if (!validation.valid) {
    console.log(
      `Storage validation failed for IP ${clientIP}: ${validation.error}`
    );
    return res.status(400).json({ error: validation.error });
  }

  let planId: string;
  let attempts = 0;

  // Generate unique ID (avoid collisions)
  do {
    planId = generateShortId();
    attempts++;
  } while (planStorage.has(planId) && attempts < 10);

  if (attempts >= 10) {
    return res.status(500).json({ error: 'Failed to generate unique ID' });
  }

  // Store the plan with additional metadata
  planStorage.set(planId, {
    content,
    createdAt: Date.now(),
    ip: clientIP,
  });

  console.log(
    `Plan stored with ID ${planId} for IP ${clientIP}, content length: ${content.length}`
  );

  return res.status(201).json({
    id: planId,
    remainingRequests: rateLimit.remaining,
  });
}

// Export the storage for access from other endpoints
export { planStorage };

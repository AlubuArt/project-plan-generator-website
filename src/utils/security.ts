import { NextApiRequest } from 'next';

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitStorage = new Map<
  string,
  { count: number; resetTime: number }
>();

// Clean up old rate limit entries every hour
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of rateLimitStorage.entries()) {
      if (now > data.resetTime) {
        rateLimitStorage.delete(ip);
      }
    }
  },
  60 * 60 * 1000
); // 1 hour

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]
      : req.socket.remoteAddress;
  return ip || 'unknown';
}

export function checkRateLimit(
  req: NextApiRequest,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const ip = getClientIP(req);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let rateLimitData = rateLimitStorage.get(ip);

  // Reset if window has passed
  if (!rateLimitData || rateLimitData.resetTime <= now) {
    rateLimitData = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  // Check if limit exceeded
  if (rateLimitData.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rateLimitData.resetTime,
    };
  }

  // Increment count
  rateLimitData.count++;
  rateLimitStorage.set(ip, rateLimitData);

  return {
    allowed: true,
    remaining: config.maxRequests - rateLimitData.count,
    resetTime: rateLimitData.resetTime,
  };
}

export function validateProjectIdeaInput(input: string): {
  valid: boolean;
  error?: string;
} {
  // Basic length validation
  if (input.length < 20) {
    return {
      valid: false,
      error: 'Project idea must be at least 20 characters',
    };
  }

  if (input.length > 1000) {
    return {
      valid: false,
      error: 'Project idea must be less than 1000 characters',
    };
  }

  // Check for project-related keywords
  const projectKeywords = [
    'app',
    'website',
    'platform',
    'system',
    'application',
    'service',
    'tool',
    'dashboard',
    'api',
    'interface',
    'software',
    'program',
    'solution',
    'build',
    'create',
    'develop',
    'make',
    'design',
    'implement',
    'users',
    'user',
    'client',
    'customer',
    'data',
    'database',
    'web',
    'mobile',
    'desktop',
    'cloud',
    'server',
    'frontend',
    'backend',
  ];

  const lowercaseInput = input.toLowerCase();
  const hasProjectKeywords = projectKeywords.some(keyword =>
    lowercaseInput.includes(keyword)
  );

  if (!hasProjectKeywords) {
    return {
      valid: false,
      error: 'Input should describe a software/technology project idea',
    };
  }

  // Check for inappropriate content
  const inappropriatePatterns = [
    /\b(hack|crack|exploit|malware|virus)\b/i,
    /\b(illegal|piracy|fraud|scam)\b/i,
    /\b(porn|adult|explicit)\b/i,
    // Add more patterns as needed
  ];

  for (const pattern of inappropriatePatterns) {
    if (pattern.test(input)) {
      return {
        valid: false,
        error: 'Input contains inappropriate content',
      };
    }
  }

  return { valid: true };
}

export function validateStorageContent(content: string): {
  valid: boolean;
  error?: string;
} {
  // Size limits
  if (content.length < 100) {
    return {
      valid: false,
      error: 'Content too short to be a valid project plan',
    };
  }

  if (content.length > 50000) {
    // ~50KB limit
    return { valid: false, error: 'Content exceeds maximum size limit' };
  }

  // Check if it looks like a project plan (markdown format)
  const projectPlanIndicators = [
    /#{1,6}\s*project/i,
    /#{1,6}\s*overview/i,
    /#{1,6}\s*user stor/i,
    /#{1,6}\s*technical/i,
    /#{1,6}\s*implementation/i,
    /#{1,6}\s*milestone/i,
    /#{1,6}\s*phase/i,
    /\*\*goal\*\*/i,
    /\*\*timeline\*\*/i,
    /- \[ \]/, // Checkbox tasks
  ];

  const hasProjectPlanStructure = projectPlanIndicators.some(pattern =>
    pattern.test(content)
  );

  if (!hasProjectPlanStructure) {
    return {
      valid: false,
      error: 'Content does not appear to be a valid project plan',
    };
  }

  return { valid: true };
}

// Rate limit configurations
export const RATE_LIMITS = {
  AI_GENERATION: {
    maxRequests: 10, // 10 requests per hour
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  PLAN_STORAGE: {
    maxRequests: 50, // 50 storage requests per hour
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  PLAN_RETRIEVAL: {
    maxRequests: 200, // 200 retrieval requests per hour
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

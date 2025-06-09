# Security Features & Guidelines

## Overview

ProjectPlan.ai v2 implements comprehensive security measures to protect against abuse, ensure appropriate usage, and maintain service quality. This document outlines all security features and considerations.

## Security Measures Implemented

### 1. Rate Limiting

All API endpoints implement IP-based rate limiting to prevent abuse:

#### Rate Limits by Endpoint:
- **AI Generation** (`/api/generate-plan`): 10 requests per hour
- **Plan Storage** (`/api/plans/store`): 50 requests per hour  
- **Plan Retrieval** (`/api/plans/[id]` & `/api/plan/[...params]`): 200 requests per hour

#### Features:
- ✅ IP-based tracking with proper header detection (`X-Forwarded-For`)
- ✅ Automatic cleanup of expired rate limit entries
- ✅ Standard rate limit headers returned (`X-RateLimit-*`)
- ✅ Graceful error messages with reset times
- ✅ Production-ready (uses in-memory storage, easily swappable with Redis)

### 2. Input Validation

#### AI Generation Endpoint:
- **Length**: 20-1000 characters required
- **Content Type**: Must be project-related (keyword validation)
- **Keyword Detection**: Validates presence of software/technology terms
- **Content Filtering**: Blocks inappropriate content patterns

#### Storage Endpoint:
- **Size Limits**: 100 bytes - 50KB content
- **Format Validation**: Must appear to be a valid project plan (markdown structure)
- **Structure Detection**: Validates project plan indicators (headers, tasks, etc.)

#### Retrieval Endpoints:
- **ID Format**: 8-character alphanumeric validation
- **Encoded Data**: Base64 URL-safe character validation
- **Size Limits**: Reasonable bounds on encoded data length

### 3. Content Security

#### Project-Related Content Only:
```typescript
const projectKeywords = [
  'app', 'website', 'platform', 'system', 'application', 'service', 'tool',
  'dashboard', 'api', 'interface', 'software', 'program', 'solution',
  'build', 'create', 'develop', 'make', 'design', 'implement',
  'users', 'user', 'client', 'customer', 'data', 'database',
  'web', 'mobile', 'desktop', 'cloud', 'server', 'frontend', 'backend'
];
```

#### Inappropriate Content Filtering:
- Hacking/malicious content detection
- Illegal activity prevention
- Adult content blocking
- Extensible pattern matching system

### 4. AI Safety Parameters

#### OpenAI Configuration:
```typescript
{
  model: 'gpt-4.1-mini',
  max_tokens: 2000,
  temperature: 0.7,
  frequency_penalty: 0.3,
  presence_penalty: 0.3
}
```

#### Additional Safeguards:
- ✅ API key protection (never exposed to client)
- ✅ Error message sanitization
- ✅ Request/response logging for monitoring
- ✅ Graceful degradation on AI service issues

### 5. Data Protection

#### Storage Security:
- **Temporary Storage**: Plans auto-expire after 30 days
- **IP Tracking**: Source IP logged for abuse monitoring
- **No Personal Data**: No user accounts or personal information stored
- **Automatic Cleanup**: Expired data automatically removed

#### Privacy:
- ✅ No user authentication required
- ✅ No persistent user tracking
- ✅ Minimal data collection (IP + content + timestamp)
- ✅ CORS configured for CLI access only

## Production Considerations

### 1. Environment Variables Required:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Recommended Infrastructure Upgrades:

#### For High-Traffic Production:
- **Redis**: Replace in-memory rate limiting with Redis
- **Database**: Move plan storage to PostgreSQL/MongoDB  
- **CDN**: Use CloudFlare for additional DDoS protection
- **Monitoring**: Implement proper logging and alerting

#### Example Redis Migration:
```typescript
// Replace in-memory storage with Redis
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Rate limiting with Redis
await redis.incr(`rate_limit:${ip}:${endpoint}`);
await redis.expire(`rate_limit:${ip}:${endpoint}`, windowMs / 1000);
```

### 3. Additional Security Headers:
Consider adding these headers in production:
```typescript
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
```

## Monitoring & Alerts

### Key Metrics to Monitor:
1. **Rate Limit Violations**: Unusual patterns of 429 responses
2. **Input Validation Failures**: High rejection rates might indicate attacks
3. **AI API Costs**: Monitor OpenAI usage and costs
4. **Storage Growth**: Plan storage usage over time
5. **Error Rates**: 4xx/5xx response patterns

### Recommended Alerts:
- Rate limit violations exceeding 100/hour from single IP
- AI generation costs exceeding daily budget
- Storage growing unusually fast (potential spam)
- High error rates indicating service issues

## Security Headers Reference

All endpoints return appropriate security headers:

```http
# Rate Limiting
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2024-01-01T15:00:00.000Z

# CORS (for CLI access)
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Accept

# Caching
Cache-Control: public, max-age=86400
```

## Testing Security Features

### Rate Limiting Test:
```bash
# Test AI generation rate limit
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/generate-plan \
    -H "Content-Type: application/json" \
    -d '{"idea":"Build a simple web app for task management"}' \
    --write-out "Status: %{http_code}\n"
done
```

### Input Validation Test:
```bash
# Test invalid input
curl -X POST http://localhost:3000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"idea":"hack into systems"}'
# Expected: 400 Bad Request
```

## Security Incident Response

### If Rate Limiting is Bypassed:
1. Check CloudFlare/proxy configuration
2. Verify IP detection logic
3. Consider reducing rate limits temporarily
4. Implement additional validation layers

### If Inappropriate Content Gets Through:
1. Update content filtering patterns
2. Review and improve keyword detection
3. Consider implementing AI-based content moderation
4. Add manual review capabilities for edge cases

### If AI Costs Spike:
1. Implement emergency circuit breakers
2. Reduce max_tokens temporarily
3. Add cost monitoring alerts
4. Review prompt efficiency

## Compliance Notes

- **GDPR**: No personal data collected, minimal processing
- **Privacy**: No user tracking, temporary storage only
- **Terms**: Usage limited to project planning purposes
- **Content**: Appropriate use policies enforced

---

For questions about security features or to report security issues, please review the code or create an issue in the repository. 
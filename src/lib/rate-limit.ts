import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

type Limiter = (identifier: string) => Promise<RateLimitResult>;

const buildLimiter = (): Limiter => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    logger.warn(
      'Upstash credentials missing; rate limiting disabled. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable.',
    );
    return async () => ({ success: true, limit: 0, remaining: 0, reset: 0 });
  }

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(20, '60 s'),
    analytics: true,
    prefix: 'madrid-noir:dialogue',
  });

  return (identifier: string) => limiter.limit(identifier);
};

export const dialogueRateLimit = buildLimiter();

export const clientIdentifier = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'anonymous';
  const realIp = request.headers.get('x-real-ip');
  return realIp ?? 'anonymous';
};

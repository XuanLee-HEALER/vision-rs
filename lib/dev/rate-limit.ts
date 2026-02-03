import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  entries: Map<string, RateLimitEntry>;
}

const RATE_LIMIT = 60; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute window

/**
 * Global rate limit store that persists across HMR reloads
 */
const globalStore: RateLimitStore = (globalThis as unknown as { __rateLimitStore?: RateLimitStore })
  .__rateLimitStore || {
  entries: new Map(),
};

// Persist store reference on globalThis for HMR
(globalThis as unknown as { __rateLimitStore: RateLimitStore }).__rateLimitStore = globalStore;

/**
 * Get client identifier from request
 * In development, we use a fixed identifier since we're on localhost
 */
function getClientId(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return 'localhost';
}

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of globalStore.entries) {
    if (now > entry.resetTime) {
      globalStore.entries.delete(key);
    }
  }
}

/**
 * Check rate limit and return error response if exceeded
 * @returns NextResponse if rate limited, null otherwise
 */
export function checkRateLimit(request: NextRequest): NextResponse | null {
  const clientId = getClientId(request);
  const now = Date.now();

  // Cleanup occasionally (1% of requests)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  let entry = globalStore.entries.get(clientId);

  // Create new entry if doesn't exist or window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
    globalStore.entries.set(clientId, entry);
  }

  // Increment count
  entry.count++;

  // Check if rate limited
  if (entry.count > RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(request: NextRequest): Record<string, string> {
  const clientId = getClientId(request);
  const entry = globalStore.entries.get(clientId);

  if (!entry) {
    return {
      'X-RateLimit-Limit': String(RATE_LIMIT),
      'X-RateLimit-Remaining': String(RATE_LIMIT),
    };
  }

  return {
    'X-RateLimit-Limit': String(RATE_LIMIT),
    'X-RateLimit-Remaining': String(Math.max(0, RATE_LIMIT - entry.count)),
    'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
  };
}

/**
 * Clear rate limit store (for testing)
 */
export function clearRateLimitStore(): void {
  globalStore.entries.clear();
}

/**
 * Get rate limit store size (for testing)
 */
export function getRateLimitStoreSize(): number {
  return globalStore.entries.size;
}

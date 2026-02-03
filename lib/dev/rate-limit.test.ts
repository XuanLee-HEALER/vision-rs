import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  checkRateLimit,
  getRateLimitHeaders,
  clearRateLimitStore,
  getRateLimitStoreSize,
} from './rate-limit';

function createMockRequest(ip?: string): NextRequest {
  const headers = new Headers();
  if (ip) {
    headers.set('x-forwarded-for', ip);
  }
  return new NextRequest('http://localhost:3000/api/test', { headers });
}

describe('rate-limit module', () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  describe('checkRateLimit', () => {
    it('should return null for requests within limit', () => {
      const request = createMockRequest('192.168.1.1');

      for (let i = 0; i < 60; i++) {
        const response = checkRateLimit(request);
        expect(response).toBeNull();
      }
    });

    it('should return 429 response when limit exceeded', () => {
      const request = createMockRequest('192.168.1.2');

      // Make 60 requests (the limit)
      for (let i = 0; i < 60; i++) {
        checkRateLimit(request);
      }

      // 61st request should be rate limited
      const response = checkRateLimit(request);
      expect(response).not.toBeNull();
      expect(response?.status).toBe(429);
    });

    it('should include Retry-After header when rate limited', async () => {
      const request = createMockRequest('192.168.1.3');

      // Exceed the limit
      for (let i = 0; i < 61; i++) {
        checkRateLimit(request);
      }

      const response = checkRateLimit(request);
      expect(response?.headers.get('Retry-After')).toBeDefined();
      expect(response?.headers.get('X-RateLimit-Remaining')).toBe('0');
    });

    it('should track different IPs separately', () => {
      const request1 = createMockRequest('192.168.1.4');
      const request2 = createMockRequest('192.168.1.5');

      // Exhaust limit for IP 1
      for (let i = 0; i < 61; i++) {
        checkRateLimit(request1);
      }

      // IP 2 should still have quota
      const response = checkRateLimit(request2);
      expect(response).toBeNull();
    });

    it('should reset after time window expires', () => {
      vi.useFakeTimers();

      const request = createMockRequest('192.168.1.6');

      // Exhaust limit
      for (let i = 0; i < 61; i++) {
        checkRateLimit(request);
      }

      // Move time forward past the window (1 minute)
      vi.advanceTimersByTime(61 * 1000);

      // Should be allowed again
      const response = checkRateLimit(request);
      expect(response).toBeNull();

      vi.useRealTimers();
    });

    it('should use localhost as fallback when no IP headers', () => {
      const request = createMockRequest(); // No IP

      // Should work and use 'localhost' as identifier
      const response = checkRateLimit(request);
      expect(response).toBeNull();
      expect(getRateLimitStoreSize()).toBe(1);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return headers with full quota for new clients', () => {
      const request = createMockRequest('192.168.1.7');
      const headers = getRateLimitHeaders(request);

      expect(headers['X-RateLimit-Limit']).toBe('60');
      expect(headers['X-RateLimit-Remaining']).toBe('60');
    });

    it('should return headers with remaining quota after requests', () => {
      const request = createMockRequest('192.168.1.8');

      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        checkRateLimit(request);
      }

      const headers = getRateLimitHeaders(request);
      expect(headers['X-RateLimit-Remaining']).toBe('50');
    });
  });

  describe('clearRateLimitStore', () => {
    it('should clear all entries', () => {
      const request = createMockRequest('192.168.1.9');
      checkRateLimit(request);

      expect(getRateLimitStoreSize()).toBe(1);

      clearRateLimitStore();

      expect(getRateLimitStoreSize()).toBe(0);
    });
  });
});

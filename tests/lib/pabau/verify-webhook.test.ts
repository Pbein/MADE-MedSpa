import { describe, it, expect } from 'vitest';
import { verifyPabauUrlToken } from '@/lib/pabau/verifyWebhook';

describe('verifyPabauUrlToken', () => {
  it('returns ok=false when providedToken is empty', () => {
    const result = verifyPabauUrlToken('', 'expected-secret-value');
    expect(result.ok).toBe(false);
  });

  it('returns ok=false when expectedSecret is empty', () => {
    const result = verifyPabauUrlToken('some-token', '');
    expect(result.ok).toBe(false);
  });

  it('returns ok=false when length mismatch (defeats prefix-match side-channel)', () => {
    // provided is shorter than expected — must fail BEFORE attempting any
    // byte-by-byte compare so it's not a prefix-match channel.
    const result = verifyPabauUrlToken('short', 'much-longer-secret');
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/length mismatch/i);
  });

  it('returns ok=true on exact match', () => {
    const secret = 'super-secret-token-value-1234567890';
    const result = verifyPabauUrlToken(secret, secret);
    expect(result.ok).toBe(true);
  });

  it('returns ok=false when one byte differs (timing-safe via timingSafeEqual)', () => {
    const secret = 'super-secret-token-value-1234567890';
    // Same length, last byte different.
    const tampered = secret.slice(0, -1) + 'X';
    expect(tampered.length).toBe(secret.length);
    const result = verifyPabauUrlToken(tampered, secret);
    expect(result.ok).toBe(false);
  });
});

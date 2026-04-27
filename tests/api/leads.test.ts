import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  PabauError,
  PabauRateLimitError,
  PabauCircuitOpenError,
} from '@/lib/pabau/types';

// Mock Pabau config + client at module level. We control these per test.
const isPabauConfiguredMock = vi.fn(() => true);
const getPabauConfigMock = vi.fn(() => ({
  apiKey: 'test-key',
  companyId: 'test-co',
  webhookSecret: 'test-secret',
  leadSourceId: '99',
  baseUrl: 'https://example.invalid',
  legacyBaseUrl: 'https://example.invalid',
}));
const leadsCreateMock = vi.fn();

vi.mock('@/lib/pabau/config', () => ({
  isPabauConfigured: () => isPabauConfiguredMock(),
  getPabauConfig: () => getPabauConfigMock(),
}));

vi.mock('@/lib/pabau/client', () => ({
  pabau: {
    leads: {
      create: (...args: unknown[]) => leadsCreateMock(...args),
    },
  },
}));

let ipCounter = 0;
function uniqueIp(): string {
  ipCounter++;
  return `10.0.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`;
}

function makeRequest(body: unknown, opts: { ip?: string; raw?: string } = {}) {
  const ip = opts.ip ?? uniqueIp();
  return new NextRequest('http://localhost/api/pabau/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: opts.raw ?? JSON.stringify(body),
  });
}

const validBody = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  message: 'Looking for info on services.',
};

beforeEach(() => {
  isPabauConfiguredMock.mockReturnValue(true);
  leadsCreateMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/pabau/leads', () => {
  it('returns 503 when Pabau is not configured', async () => {
    isPabauConfiguredMock.mockReturnValue(false);
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it('returns 400 with fieldErrors on validation failure', async () => {
    leadsCreateMock.mockResolvedValue({ success: true, lead_id: '123' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest({ ...validBody, email: 'not-valid' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.fieldErrors).toBeDefined();
    expect(json.fieldErrors.email).toBeTruthy();
    expect(leadsCreateMock).not.toHaveBeenCalled();
  });

  it('returns 200 + {success: true, leadId} on Pabau success', async () => {
    leadsCreateMock.mockResolvedValue({ success: true, lead_id: 'lead_xyz' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.leadId).toBe('lead_xyz');
    expect(leadsCreateMock).toHaveBeenCalledOnce();
  });

  it('returns 502 when Pabau returns success=false', async () => {
    leadsCreateMock.mockResolvedValue({ success: false, error: 'rejected' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it('returns 503 when Pabau client throws PabauRateLimitError', async () => {
    leadsCreateMock.mockRejectedValue(new PabauRateLimitError(60_000));
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
  });

  it('returns 503 when Pabau client throws PabauCircuitOpenError', async () => {
    leadsCreateMock.mockRejectedValue(
      new PabauCircuitOpenError(Date.now() + 60_000),
    );
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
  });

  it('returns 502 with safe message on generic PabauError', async () => {
    leadsCreateMock.mockRejectedValue(
      new PabauError('upstream blew up', 500, 'detail'),
    );
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    // Must NOT leak the internal "upstream blew up" string to the client.
    expect(JSON.stringify(json.error)).not.toContain('upstream blew up');
  });

  it('rate-limits per IP: 6th rapid request from same IP returns 429', async () => {
    leadsCreateMock.mockResolvedValue({ success: true, lead_id: 'ok' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    const sharedIp = `198.51.100.${(ipCounter++ % 250) + 1}`;
    // First 5 must succeed (under the limit of 5/min).
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(validBody, { ip: sharedIp }));
      expect(res.status).toBe(200);
    }
    // 6th should hit the limit.
    const res6 = await POST(makeRequest(validBody, { ip: sharedIp }));
    expect(res6.status).toBe(429);
  });

  it('includes _debug field in dev, omits in prod (PabauError path)', async () => {
    leadsCreateMock.mockRejectedValue(
      new PabauError('boom', 500, { detail: 'x' }),
    );
    const { POST } = await import('@/app/api/pabau/leads/route');

    // Dev: NODE_ENV !== 'production'
    vi.stubEnv('NODE_ENV', 'development');
    const devRes = await POST(makeRequest(validBody));
    const devJson = await devRes.json();
    expect(devJson._debug).toBeDefined();

    // Prod: NODE_ENV === 'production'
    vi.stubEnv('NODE_ENV', 'production');
    const prodRes = await POST(makeRequest(validBody));
    const prodJson = await prodRes.json();
    expect(prodJson._debug).toBeUndefined();
  });

  it('returns 400 on invalid JSON body', async () => {
    const { POST } = await import('@/app/api/pabau/leads/route');
    const res = await POST(makeRequest(undefined, { raw: '{not json' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    // Pabau client must NOT have been invoked.
    expect(leadsCreateMock).not.toHaveBeenCalled();
  });

  it('extracts client IP from x-forwarded-for chain (uses first hop)', async () => {
    // Two chains where the FIRST IP is the same → must share rate-limit bucket.
    leadsCreateMock.mockResolvedValue({ success: true, lead_id: 'ok' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    const sharedFirstHop = `203.0.113.${(ipCounter++ % 250) + 1}`;
    const buildReq = (chain: string) =>
      new NextRequest('http://localhost/api/pabau/leads', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': chain,
        },
        body: JSON.stringify(validBody),
      });

    // Fire 5 from chain A (consumes the budget for first-hop IP).
    // Each request must be a fresh NextRequest because the body stream is consumed.
    for (let i = 0; i < 5; i++) {
      const res = await POST(buildReq(`${sharedFirstHop}, 10.1.${i}.1`));
      expect(res.status).toBe(200);
    }
    // Chain B has same first IP, different proxy chain → should still be over budget → 429.
    const res = await POST(buildReq(`${sharedFirstHop}, 10.2.2.2`));
    expect(res.status).toBe(429);
  });

  it('falls back to x-real-ip when x-forwarded-for missing', async () => {
    leadsCreateMock.mockResolvedValue({ success: true, lead_id: 'ok' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    const ip = `192.0.2.${(ipCounter++ % 250) + 1}`;
    const req = new NextRequest('http://localhost/api/pabau/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-real-ip': ip,
      },
      body: JSON.stringify(validBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('forwards correctly mapped payload to Pabau (not just any payload)', async () => {
    leadsCreateMock.mockResolvedValue({ success: true, lead_id: 'ok' });
    const { POST } = await import('@/app/api/pabau/leads/route');

    await POST(
      makeRequest({
        firstName: '  Sarah  ',
        lastName: 'Lee',
        email: 'Sarah@Example.com',
        phone: '555-1234',
        treatmentInterest: 'Filler',
        message: 'Hi',
        marketingConsent: true,
        source: 'home_page',
      }),
    );

    expect(leadsCreateMock).toHaveBeenCalledOnce();
    const sentPayload = leadsCreateMock.mock.calls[0][0];
    // Field names mapped to Pabau-side conventions
    expect(sentPayload.first_name).toBe('Sarah'); // trimmed
    expect(sentPayload.last_name).toBe('Lee');
    expect(sentPayload.email).toBe('sarah@example.com'); // lowercased
    expect(sentPayload.mobile).toBe('555-1234');
    expect(sentPayload.notes).toBe('Hi');
    expect(sentPayload.marketing_consent).toBe(true);
    expect(sentPayload.lead_source).toBe('99'); // from getPabauConfigMock
    expect(sentPayload.custom_fields.treatment_interest).toBe('Filler');
    expect(sentPayload.custom_fields.website_source).toBe('home_page');
  });

  it('returns 500 on generic non-PabauError exception', async () => {
    leadsCreateMock.mockRejectedValue(new Error('something unexpected'));
    const { POST } = await import('@/app/api/pabau/leads/route');

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    // Generic error message must not leak the internal "something unexpected" string.
    expect(JSON.stringify(json.error)).not.toContain('something unexpected');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// --- Module mocks ---

const isPabauConfiguredMock = vi.fn(() => true);
const getPabauConfigMock = vi.fn(() => ({
  apiKey: 'test-key',
  companyId: 'test-co',
  webhookSecret: 'webhook-secret-correct',
  leadSourceId: '99',
  baseUrl: 'https://example.invalid',
  legacyBaseUrl: 'https://example.invalid',
}));

vi.mock('@/lib/pabau/config', () => ({
  isPabauConfigured: () => isPabauConfiguredMock(),
  getPabauConfig: () => getPabauConfigMock(),
}));

// dispatchWebhook is the entity-handler dispatcher; we control its return per test.
const dispatchWebhookMock = vi.fn();
vi.mock('@/lib/pabau/webhookHandlers', () => ({
  dispatchWebhook: (...args: unknown[]) => dispatchWebhookMock(...args),
}));

// Convex mutation is implemented by the ConvexHttpClient instance. Mock the class.
const mutationMock = vi.fn();
vi.mock('convex/browser', () => ({
  ConvexHttpClient: class FakeConvexHttpClient {
    mutation = (...args: unknown[]) => mutationMock(...args);
  },
}));

// --- Helpers ---

function makeRequest(body: unknown | string, opts: { contentType?: string } = {}) {
  return new NextRequest('http://localhost/api/pabau/webhooks/x', {
    method: 'POST',
    headers: { 'content-type': opts.contentType ?? 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function callPOST(
  token: string,
  req: NextRequest,
): Promise<Response> {
  const { POST } = await import(
    '@/app/api/pabau/webhooks/[token]/route'
  );
  return await POST(req, { params: Promise.resolve({ token }) });
}

const VALID_TOKEN = 'webhook-secret-correct';

const baseEvent = {
  event_id: 'evt_001',
  entity_type: 'client',
  action: 'create',
  data: { id: 1 },
};

beforeEach(() => {
  isPabauConfiguredMock.mockReturnValue(true);
  mutationMock.mockReset();
  dispatchWebhookMock.mockReset();
  // Default: insert returns a non-duplicate row.
  mutationMock.mockImplementation(async () => ({
    id: 'row_1',
    duplicate: false,
  }));
  // Default: dispatch returns ok+ignored (handler not implemented).
  dispatchWebhookMock.mockResolvedValue({
    ok: true,
    ignored: true,
    reason: 'not implemented',
  });
  // Make convex client construction succeed.
  process.env.NEXT_PUBLIC_CONVEX_URL = 'https://convex.invalid';
});

// --- Tests ---

describe('POST /api/pabau/webhooks/[token]', () => {
  it('returns 503 when Pabau is not configured', async () => {
    isPabauConfiguredMock.mockReturnValue(false);
    const res = await callPOST(VALID_TOKEN, makeRequest(baseEvent));
    expect(res.status).toBe(503);
  });

  it('returns 401 on bad token', async () => {
    const res = await callPOST('wrong-token', makeRequest(baseEvent));
    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid JSON body', async () => {
    const res = await callPOST(VALID_TOKEN, makeRequest('{not json', {}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when missing event_id', async () => {
    const { event_id: _omit, ...rest } = baseEvent;
    void _omit;
    const res = await callPOST(VALID_TOKEN, makeRequest(rest));
    expect(res.status).toBe(400);
  });

  it('returns 400 when missing entity_type', async () => {
    const { entity_type: _omit, ...rest } = baseEvent;
    void _omit;
    const res = await callPOST(VALID_TOKEN, makeRequest(rest));
    expect(res.status).toBe(400);
  });

  it('returns 400 when missing action', async () => {
    const { action: _omit, ...rest } = baseEvent;
    void _omit;
    const res = await callPOST(VALID_TOKEN, makeRequest(rest));
    expect(res.status).toBe(400);
  });

  it('returns {ok: true, duplicate: true} on repeated event_id', async () => {
    // Simulate the second insert returning duplicate=true.
    mutationMock.mockResolvedValueOnce({ id: 'row_1', duplicate: true });
    const res = await callPOST(VALID_TOKEN, makeRequest(baseEvent));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, duplicate: true });
    // dispatch must NOT be called for duplicates
    expect(dispatchWebhookMock).not.toHaveBeenCalled();
  });

  it('returns {ok: true, processed: true} on first delivery and calls markProcessed', async () => {
    dispatchWebhookMock.mockResolvedValue({ ok: true, ignored: false });
    const res = await callPOST(VALID_TOKEN, makeRequest(baseEvent));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, processed: true });
    // First call = insert, second call = markProcessed.
    expect(mutationMock).toHaveBeenCalledTimes(2);
    // Inspect 2nd call args = the markProcessed mutation function ref + payload.
    const secondCallArgs = mutationMock.mock.calls[1];
    expect(secondCallArgs[1]).toEqual({ id: 'row_1' });
  });

  it('returns {ok: true, processed: false} when handler returns ignored=true', async () => {
    dispatchWebhookMock.mockResolvedValue({
      ok: true,
      ignored: true,
      reason: 'not yet implemented',
    });
    const res = await callPOST(VALID_TOKEN, makeRequest(baseEvent));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, processed: false });
    // 2nd mutation call should be markIgnored with a reason.
    const secondCallArgs = mutationMock.mock.calls[1];
    expect(secondCallArgs[1]).toMatchObject({
      id: 'row_1',
      reason: expect.any(String),
    });
  });

  it('normalizes action: created -> create', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ ...baseEvent, action: 'created' }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.action).toBe('create');
  });

  it('normalizes action: updated -> update', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ ...baseEvent, action: 'updated' }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.action).toBe('update');
  });

  it('normalizes action: deleted -> delete', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ ...baseEvent, action: 'deleted' }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.action).toBe('delete');
  });

  it.each(['won', 'lost', 'reopen', 'canceled', 'reschedule', 'blockout_canceled'])(
    'normalizes Pabau-specific action %s -> update',
    async (action) => {
      await callPOST(VALID_TOKEN, makeRequest({ ...baseEvent, action }));
      const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
      expect(insertArgs.action).toBe('update');
    },
  );

  it('normalizes entity: booking -> appointment', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ ...baseEvent, entity_type: 'booking' }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.entityType).toBe('appointment');
  });

  it('preserves the original action in payload as _pabauOriginalAction', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ ...baseEvent, action: 'won' }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as {
      payload: Record<string, unknown>;
    };
    expect(insertArgs.payload._pabauOriginalAction).toBe('won');
  });

  it('uses body.id as fallback when event_id is missing', async () => {
    const res = await callPOST(
      VALID_TOKEN,
      makeRequest({ id: 'evt_via_id', entity_type: 'client', action: 'create', data: {} }),
    );
    expect(res.status).toBe(200);
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.eventId).toBe('evt_via_id');
  });

  it('uses body.entity as fallback for entity_type', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ event_id: 'e1', entity: 'lead', action: 'create', data: {} }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.entityType).toBe('lead');
  });

  it('uses body.object_type as fallback for entity_type', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ event_id: 'e1', object_type: 'invoice', action: 'create', data: {} }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.entityType).toBe('invoice');
  });

  it('uses body.event as fallback for action', async () => {
    await callPOST(
      VALID_TOKEN,
      makeRequest({ event_id: 'e1', entity_type: 'client', event: 'created', data: {} }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as Record<string, unknown>;
    expect(insertArgs.action).toBe('create');
  });

  it('returns 500 when Convex insert throws', async () => {
    mutationMock.mockReset();
    mutationMock.mockRejectedValueOnce(new Error('convex down'));
    const res = await callPOST(VALID_TOKEN, makeRequest(baseEvent));
    expect(res.status).toBe(500);
    // Internal error should not leak.
    const json = await res.json();
    expect(JSON.stringify(json)).not.toContain('convex down');
    // Dispatch must NOT have been called when insert failed.
    expect(dispatchWebhookMock).not.toHaveBeenCalled();
  });

  it('non-object payload (string) is wrapped in {raw: ...} before storing', async () => {
    // body.data is a string; payload-merge fallback should wrap it.
    await callPOST(
      VALID_TOKEN,
      makeRequest({
        event_id: 'e1',
        entity_type: 'client',
        action: 'create',
        data: 'not-an-object',
      }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as {
      payload: Record<string, unknown>;
    };
    expect(insertArgs.payload.raw).toBe('not-an-object');
    expect(insertArgs.payload._pabauOriginalAction).toBe('create');
  });

  it('payload spread does not allow incoming data to overwrite _pabauOriginalAction', async () => {
    // Hostile/legacy payload that already contains an _pabauOriginalAction key — ours must win.
    await callPOST(
      VALID_TOKEN,
      makeRequest({
        event_id: 'e1',
        entity_type: 'client',
        action: 'won',
        data: { id: 1, _pabauOriginalAction: 'spoofed' },
      }),
    );
    const insertArgs = mutationMock.mock.calls[0][1] as {
      payload: Record<string, unknown>;
    };
    // Our normalization key must override any payload-supplied value.
    expect(insertArgs.payload._pabauOriginalAction).toBe('won');
  });

  it('token verification happens before JSON parse (wrong token + bad JSON returns 401, not 400)', async () => {
    const res = await callPOST('wrong-token', makeRequest('{not json', {}));
    expect(res.status).toBe(401);
  });
});

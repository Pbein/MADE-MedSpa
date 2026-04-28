export type PabauHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface PabauServiceDTO {
  id: number;
  name: string;
  category?: string;
  duration?: number;
  price?: number;
  booking_url?: string;
  description?: string;
}

export interface PabauProductDTO {
  id: number;
  name: string;
  description?: string;
  price?: number;
  category?: string;
}

export interface PabauReviewDTO {
  id: number;
  client_name: string;
  rating?: number;
  comment: string;
  service?: string;
  created_at: string;
}

export interface PabauLeadCreatePayload {
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string;
  notes?: string;
  lead_source?: string;
  lead_status?: string;
  marketing_consent?: boolean;
  custom_fields?: Record<string, string | number | boolean>;
}

export interface PabauLeadCreateResponse {
  success: boolean;
  lead_id?: string | number;
  error?: string;
}

export class PabauError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly responseBody?: unknown,
  ) {
    super(message);
    this.name = "PabauError";
  }
}

export class PabauRateLimitError extends PabauError {
  constructor(retryAfterMs: number) {
    super(`Pabau rate limit hit. Retry in ${Math.round(retryAfterMs / 1000)}s.`, 429);
    this.name = "PabauRateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
  retryAfterMs: number;
}

export class PabauCircuitOpenError extends PabauError {
  constructor(reopenAtMs: number) {
    super(
      `Pabau circuit breaker open until ${new Date(reopenAtMs).toISOString()}.`,
    );
    this.name = "PabauCircuitOpenError";
    this.reopenAtMs = reopenAtMs;
  }
  reopenAtMs: number;
}

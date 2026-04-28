import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { getPabauConfig } from "./config";
import { throttle, tripCircuit } from "./throttle";
import {
  PabauError,
  PabauRateLimitError,
  type PabauHttpMethod,
  type PabauLeadCreatePayload,
  type PabauLeadCreateResponse,
  type PabauProductDTO,
  type PabauReviewDTO,
  type PabauServiceDTO,
} from "./types";

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url);
}

async function recordUsage(method: PabauHttpMethod): Promise<void> {
  const client = getConvexClient();
  if (!client) return;
  try {
    await client.mutation(api.pabauApiUsage.increment, { method });
  } catch (err) {
    console.warn("[pabau] failed to record usage", err);
  }
}

function redactKey(url: string, apiKey: string): string {
  return url.replace(apiKey, "***");
}

interface PabauFetchOptions {
  method?: PabauHttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

async function pabauFetch<T>(path: string, options: PabauFetchOptions = {}): Promise<T> {
  const { apiKey, baseUrl } = getPabauConfig();
  const method: PabauHttpMethod = options.method ?? "GET";
  const url = `${baseUrl}/${apiKey}${path.startsWith("/") ? path : `/${path}`}`;

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    await throttle();

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: "no-store",
      });

      void recordUsage(method);

      if (res.status === 429) {
        tripCircuit();
        throw new PabauRateLimitError(5 * 60 * 1000);
      }

      if (res.status >= 500 && attempt < MAX_RETRIES) {
        const backoff = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[pabau] ${method} ${redactKey(url, apiKey)} → ${res.status}, retrying in ${backoff}ms`,
        );
        await sleep(backoff);
        continue;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new PabauError(
          `Pabau ${method} ${path} failed: ${res.status} ${res.statusText}`,
          res.status,
          text,
        );
      }

      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof PabauRateLimitError) throw err;
      if (err instanceof PabauError) throw err;
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const backoff = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[pabau] ${method} ${redactKey(url, apiKey)} threw, retrying in ${backoff}ms`,
          err,
        );
        await sleep(backoff);
        continue;
      }
    }
  }
  throw new PabauError(
    `Pabau ${method} ${path} failed after ${MAX_RETRIES + 1} attempts`,
    undefined,
    lastError,
  );
}

async function pabauLegacyPost<T>(
  path: string,
  formFields: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const { apiKey, companyId, legacyBaseUrl } = getPabauConfig();
  const url = `${legacyBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const body = new URLSearchParams();
  body.set("api_key", apiKey);
  body.set("company", companyId);
  for (const [key, value] of Object.entries(formFields)) {
    if (value === undefined || value === null || value === "") continue;
    body.set(key, String(value));
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    await throttle();
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: body.toString(),
        cache: "no-store",
      });

      void recordUsage("POST");

      if (res.status === 429) {
        tripCircuit();
        throw new PabauRateLimitError(5 * 60 * 1000);
      }

      if (res.status >= 500 && attempt < MAX_RETRIES) {
        const backoff = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(`[pabau] POST ${path} → ${res.status}, retrying in ${backoff}ms`);
        await sleep(backoff);
        continue;
      }

      const text = await res.text();
      if (!res.ok) {
        throw new PabauError(
          `Pabau POST ${path} failed: ${res.status} ${res.statusText}`,
          res.status,
          text,
        );
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        // Some legacy Pabau endpoints return non-JSON success bodies; wrap them.
        return { success: true, raw: text } as unknown as T;
      }
    } catch (err) {
      if (err instanceof PabauRateLimitError) throw err;
      if (err instanceof PabauError) throw err;
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const backoff = RETRY_BASE_MS * Math.pow(2, attempt);
        await sleep(backoff);
        continue;
      }
    }
  }
  throw new PabauError(
    `Pabau POST ${path} failed after ${MAX_RETRIES + 1} attempts`,
    undefined,
    lastError,
  );
}

export const pabau = {
  leads: {
    async create(payload: PabauLeadCreatePayload): Promise<PabauLeadCreateResponse> {
      // Per Pabau 2 docs: POST https://api.oauth.pabau.com/{api_key}/leads/create
      // Custom fields use the convention: custom_field_<numeric_id>
      const body: Record<string, unknown> = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        mobile: payload.mobile,
        notes: payload.notes,
        marketing_consent: payload.marketing_consent,
      };
      // Pabau's create-lead endpoint reads the source ID under multiple aliases;
      // verified working with `lead_source` set as a number. Sending alternates as a
      // belt-and-suspenders measure in case Pabau's API renames fields in a future update.
      if (payload.lead_source !== undefined) {
        const numeric = Number(payload.lead_source);
        const value = Number.isFinite(numeric) ? numeric : payload.lead_source;
        body.lead_source = value;
        body.lead_source_id = value;
        body.marketing_source = value;
      }
      if (payload.custom_fields) {
        for (const [k, v] of Object.entries(payload.custom_fields)) {
          body[k] = v;
        }
      }

      const result = await pabauFetch<{
        success?: boolean;
        message?: string;
        lead_id?: string | number;
        token?: string;
      }>("/leads/create", { method: "POST", body });

      return {
        success: result.success !== false && result.lead_id !== undefined,
        lead_id: result.lead_id,
        error:
          result.lead_id === undefined
            ? result.message ?? "Pabau did not return a lead ID."
            : undefined,
      };
    },
  },
  leadSources: {
    async list(): Promise<{
      sources: Array<{ id: string | number; name: string; raw?: Record<string, unknown> }>;
      pathTried: string;
    }> {
      const candidates = [
        "/lead-sources",
        "/marketing-sources",
        "/lead_sources",
        "/marketing_sources",
        "/sources",
      ];
      const NAME_KEYS = [
        "name",
        "source_name",
        "marketing_source_name",
        "lead_source_name",
        "title",
        "label",
        "display_name",
      ];
      let lastError: unknown;
      for (const path of candidates) {
        try {
          const data = await pabauFetch<Record<string, unknown>>(path);
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value) && key !== "success") {
              const arr = value as Array<Record<string, unknown>>;
              if (arr.every((row) => row && typeof row === "object" && "id" in row)) {
                return {
                  sources: arr.map((r) => {
                    let name = "(no name)";
                    for (const nk of NAME_KEYS) {
                      if (typeof r[nk] === "string" && (r[nk] as string).trim()) {
                        name = r[nk] as string;
                        break;
                      }
                    }
                    return {
                      id: r.id as string | number,
                      name,
                      raw: r,
                    };
                  }),
                  pathTried: path,
                };
              }
            }
          }
        } catch (err) {
          lastError = err;
        }
      }
      // Fallback: pull from /leads (each lead has lead_source — we can derive distinct sources).
      try {
        const leadsData = await pabauFetch<{
          leads?: Array<{ lead_source?: string | number }>;
          lead_sources?: Array<{ id: string | number; name: string }>;
        }>("/leads");
        if (leadsData.lead_sources && leadsData.lead_sources.length > 0) {
          return {
            sources: leadsData.lead_sources.map((s) => ({ id: s.id, name: s.name })),
            pathTried: "/leads (embedded lead_sources)",
          };
        }
        const distinct = new Set<string>();
        for (const lead of leadsData.leads ?? []) {
          if (lead.lead_source !== undefined && lead.lead_source !== null) {
            distinct.add(String(lead.lead_source));
          }
        }
        if (distinct.size > 0) {
          return {
            sources: Array.from(distinct).map((id) => ({
              id,
              name: "(name not exposed — see Pabau marketing sources page)",
              raw: undefined,
            })),
            pathTried: "/leads (derived from lead_source IDs in lead records)",
          };
        }
      } catch (err) {
        lastError = err;
      }
      throw lastError ?? new Error("No working lead-source endpoint found.");
    },
  },
  services: {
    async list(): Promise<{ services: PabauServiceDTO[] }> {
      return pabauFetch<{ services: PabauServiceDTO[] }>("/services");
    },
  },
  products: {
    async list(): Promise<{ products: PabauProductDTO[] }> {
      return pabauFetch<{ products: PabauProductDTO[] }>("/products");
    },
  },
  reviews: {
    async list(): Promise<{ reviews: PabauReviewDTO[] }> {
      return pabauFetch<{ reviews: PabauReviewDTO[] }>("/reviews");
    },
  },
};

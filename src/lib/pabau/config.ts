import "server-only";

class PabauConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Pabau configuration is incomplete. Missing or empty env vars: ${missing.join(", ")}. ` +
        `See .env.local.example.`,
    );
    this.name = "PabauConfigError";
  }
}

function readRequired(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new PabauConfigError([name]);
  }
  return value;
}

function readOptional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}

export interface PabauConfig {
  apiKey: string;
  companyId: string;
  webhookSecret: string;
  leadSourceId: string | undefined;
  baseUrl: string;
  legacyBaseUrl: string;
}

let cached: PabauConfig | null = null;

export function getPabauConfig(): PabauConfig {
  if (cached) return cached;

  const missing: string[] = [];
  const apiKey = process.env.PABAU_API_KEY?.trim();
  const companyId = process.env.PABAU_COMPANY_ID?.trim();
  const webhookSecret = process.env.PABAU_WEBHOOK_SECRET?.trim();
  if (!apiKey) missing.push("PABAU_API_KEY");
  if (!companyId) missing.push("PABAU_COMPANY_ID");
  if (!webhookSecret) missing.push("PABAU_WEBHOOK_SECRET");
  if (missing.length > 0) throw new PabauConfigError(missing);

  cached = {
    apiKey: apiKey!,
    companyId: companyId!,
    webhookSecret: webhookSecret!,
    leadSourceId: readOptional("PABAU_LEAD_SOURCE_ID"),
    baseUrl: readOptional("PABAU_API_BASE_URL") ?? "https://api.oauth.pabau.com",
    legacyBaseUrl: readOptional("PABAU_LEGACY_BASE_URL") ?? "https://crm.pabau.com",
  };

  return cached;
}

export function isPabauConfigured(): boolean {
  try {
    getPabauConfig();
    return true;
  } catch {
    return false;
  }
}

import type { PabauLeadCreatePayload } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+()\-\s\d]{7,}$/;

export interface LeadFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  treatmentInterest?: string;
  message: string;
  marketingConsent: boolean;
  source?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  value?: LeadFormInput;
}

export function validateLeadInput(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== "object") {
    return { ok: false, errors: { _root: "Invalid request body." } };
  }
  const raw = input as Record<string, unknown>;

  const firstName = typeof raw.firstName === "string" ? raw.firstName.trim() : "";
  const lastName = typeof raw.lastName === "string" ? raw.lastName.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const phone = typeof raw.phone === "string" ? raw.phone.trim() : "";
  const treatmentInterest =
    typeof raw.treatmentInterest === "string" ? raw.treatmentInterest.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const marketingConsent = raw.marketingConsent === true;
  const source = typeof raw.source === "string" ? raw.source.trim() : "contact_page";

  if (firstName.length < 1) errors.firstName = "First name is required.";
  if (firstName.length > 80) errors.firstName = "First name is too long.";
  if (lastName.length < 1) errors.lastName = "Last name is required.";
  if (lastName.length > 80) errors.lastName = "Last name is too long.";
  if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address.";
  if (email.length > 200) errors.email = "Email is too long.";
  if (phone.length > 0 && !PHONE_REGEX.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (message.length < 1) errors.message = "Tell us a little about what you're looking for.";
  if (message.length > 5000) errors.message = "Message is too long.";
  if (treatmentInterest.length > 100) {
    errors.treatmentInterest = "Treatment interest is too long.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      treatmentInterest: treatmentInterest || undefined,
      message,
      marketingConsent,
      source,
    },
  };
}

export function leadInputToPabauPayload(
  input: LeadFormInput,
  options: { leadSourceId?: string },
): PabauLeadCreatePayload {
  const customFields: Record<string, string | number | boolean> = {};
  if (input.treatmentInterest) {
    customFields.treatment_interest = input.treatmentInterest;
  }
  if (input.source) {
    customFields.website_source = input.source;
  }

  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    mobile: input.phone,
    notes: input.message,
    lead_source: options.leadSourceId,
    marketing_consent: input.marketingConsent,
    custom_fields: Object.keys(customFields).length > 0 ? customFields : undefined,
  };
}

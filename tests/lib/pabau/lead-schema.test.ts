import { describe, it, expect } from 'vitest';
import {
  validateLeadInput,
  leadInputToPabauPayload,
  type LeadFormInput,
} from '@/lib/pabau/schemas/lead';

describe('validateLeadInput', () => {
  const goodInput = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    message: 'Hi there',
  };

  it('rejects when firstName is missing', () => {
    const result = validateLeadInput({ ...goodInput, firstName: undefined });
    expect(result.ok).toBe(false);
    expect(result.errors.firstName).toBeTruthy();
  });

  it('rejects when firstName is empty', () => {
    const result = validateLeadInput({ ...goodInput, firstName: '   ' });
    expect(result.ok).toBe(false);
    expect(result.errors.firstName).toBeTruthy();
  });

  it('rejects when lastName is missing', () => {
    const result = validateLeadInput({ ...goodInput, lastName: undefined });
    expect(result.ok).toBe(false);
    expect(result.errors.lastName).toBeTruthy();
  });

  it('rejects when lastName is empty', () => {
    const result = validateLeadInput({ ...goodInput, lastName: '' });
    expect(result.ok).toBe(false);
    expect(result.errors.lastName).toBeTruthy();
  });

  it('rejects when email is missing', () => {
    const result = validateLeadInput({ ...goodInput, email: undefined });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it('rejects when email is empty', () => {
    const result = validateLeadInput({ ...goodInput, email: '' });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it('rejects when email is invalid', () => {
    const result = validateLeadInput({ ...goodInput, email: 'not-an-email' });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it('rejects when email is over 200 chars', () => {
    const longLocal = 'a'.repeat(195);
    const result = validateLeadInput({
      ...goodInput,
      email: `${longLocal}@example.com`, // > 200
    });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it('rejects when message is empty', () => {
    const result = validateLeadInput({ ...goodInput, message: '' });
    expect(result.ok).toBe(false);
    expect(result.errors.message).toBeTruthy();
  });

  it('rejects when message is over 5000 chars', () => {
    const result = validateLeadInput({
      ...goodInput,
      message: 'a'.repeat(5001),
    });
    expect(result.ok).toBe(false);
    expect(result.errors.message).toBeTruthy();
  });

  it('rejects when phone is provided but invalid', () => {
    const result = validateLeadInput({ ...goodInput, phone: 'abc' });
    expect(result.ok).toBe(false);
    expect(result.errors.phone).toBeTruthy();
  });

  it('accepts when phone is omitted', () => {
    const result = validateLeadInput(goodInput);
    expect(result.ok).toBe(true);
    expect(result.value?.phone).toBeUndefined();
  });

  it('trims whitespace and lowercases email', () => {
    const result = validateLeadInput({
      firstName: '  Jane  ',
      lastName: '  Doe  ',
      email: '  Jane@Example.COM  ',
      message: '  hello  ',
    });
    expect(result.ok).toBe(true);
    expect(result.value?.firstName).toBe('Jane');
    expect(result.value?.lastName).toBe('Doe');
    expect(result.value?.email).toBe('jane@example.com');
    expect(result.value?.message).toBe('hello');
  });

  it('defaults marketingConsent to false when omitted', () => {
    const result = validateLeadInput(goodInput);
    expect(result.ok).toBe(true);
    expect(result.value?.marketingConsent).toBe(false);
  });

  it('defaults source to "contact_page" when omitted', () => {
    const result = validateLeadInput(goodInput);
    expect(result.ok).toBe(true);
    expect(result.value?.source).toBe('contact_page');
  });

  it('rejects when firstName > 80 chars', () => {
    const result = validateLeadInput({ ...goodInput, firstName: 'a'.repeat(81) });
    expect(result.ok).toBe(false);
    expect(result.errors.firstName).toMatch(/too long/i);
  });

  it('rejects when lastName > 80 chars', () => {
    const result = validateLeadInput({ ...goodInput, lastName: 'a'.repeat(81) });
    expect(result.ok).toBe(false);
    expect(result.errors.lastName).toMatch(/too long/i);
  });

  it('rejects when treatmentInterest > 100 chars', () => {
    const result = validateLeadInput({
      ...goodInput,
      treatmentInterest: 'a'.repeat(101),
    });
    expect(result.ok).toBe(false);
    expect(result.errors.treatmentInterest).toBeTruthy();
  });

  it('rejects non-object input (null) with _root error', () => {
    const result = validateLeadInput(null);
    expect(result.ok).toBe(false);
    expect(result.errors._root).toBeTruthy();
  });

  it('rejects non-object input (string) with _root error', () => {
    const result = validateLeadInput('some string');
    expect(result.ok).toBe(false);
    expect(result.errors._root).toBeTruthy();
  });

  it('rejects non-object input (number) with _root error', () => {
    const result = validateLeadInput(42);
    expect(result.ok).toBe(false);
    expect(result.errors._root).toBeTruthy();
  });

  it('marketingConsent uses strict boolean check — string "yes" coerces to false', () => {
    const result = validateLeadInput({ ...goodInput, marketingConsent: 'yes' });
    // Bots/clients sending non-boolean truthy values must NOT auto-opt-in users.
    expect(result.ok).toBe(true);
    expect(result.value?.marketingConsent).toBe(false);
  });

  it('marketingConsent uses strict boolean check — number 1 coerces to false', () => {
    const result = validateLeadInput({ ...goodInput, marketingConsent: 1 });
    expect(result.ok).toBe(true);
    expect(result.value?.marketingConsent).toBe(false);
  });

  it('marketingConsent stays true only when literal boolean true is passed', () => {
    const result = validateLeadInput({ ...goodInput, marketingConsent: true });
    expect(result.ok).toBe(true);
    expect(result.value?.marketingConsent).toBe(true);
  });
});

describe('leadInputToPabauPayload', () => {
  const baseInput: LeadFormInput = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    message: 'hello',
    marketingConsent: false,
  };

  it('maps treatmentInterest to custom_fields.treatment_interest', () => {
    const payload = leadInputToPabauPayload(
      { ...baseInput, treatmentInterest: 'Botox' },
      {},
    );
    expect(payload.custom_fields?.treatment_interest).toBe('Botox');
  });

  it('includes lead_source from options when provided', () => {
    const payload = leadInputToPabauPayload(baseInput, { leadSourceId: '42' });
    expect(payload.lead_source).toBe('42');
  });

  it('omits custom_fields when neither treatmentInterest nor source provided', () => {
    const payload = leadInputToPabauPayload(baseInput, {});
    expect(payload.custom_fields).toBeUndefined();
  });

  it('maps all field names correctly (firstName→first_name, phone→mobile, message→notes, etc.)', () => {
    const payload = leadInputToPabauPayload(
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-0100',
        message: 'Looking for info',
        marketingConsent: true,
      },
      { leadSourceId: '99' },
    );
    expect(payload.first_name).toBe('Jane');
    expect(payload.last_name).toBe('Doe');
    expect(payload.email).toBe('jane@example.com');
    expect(payload.mobile).toBe('555-0100');
    expect(payload.notes).toBe('Looking for info');
    expect(payload.marketing_consent).toBe(true);
    expect(payload.lead_source).toBe('99');
  });

  it('mobile is undefined when phone is undefined', () => {
    const payload = leadInputToPabauPayload(baseInput, {});
    expect(payload.mobile).toBeUndefined();
  });

  it('lead_source is undefined when leadSourceId is not provided', () => {
    const payload = leadInputToPabauPayload(baseInput, {});
    expect(payload.lead_source).toBeUndefined();
  });

  it('maps source to custom_fields.website_source', () => {
    const payload = leadInputToPabauPayload(
      { ...baseInput, source: 'home_page' },
      {},
    );
    expect(payload.custom_fields?.website_source).toBe('home_page');
  });

  it('includes both treatment_interest AND website_source in custom_fields when both set', () => {
    const payload = leadInputToPabauPayload(
      { ...baseInput, treatmentInterest: 'Botox', source: 'service_page' },
      {},
    );
    expect(payload.custom_fields?.treatment_interest).toBe('Botox');
    expect(payload.custom_fields?.website_source).toBe('service_page');
  });
});

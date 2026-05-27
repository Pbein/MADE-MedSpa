import { describe, it, expect } from 'vitest';
import { normalizePabauBookingUrl } from '@/lib/pabauBookingUrl';

const BASE = 'https://partner.pabau.com/online-bookings/made-med-spa';

describe('normalizePabauBookingUrl', () => {
  it('rewrites the dead made-51g64 slug onto the canonical slug, keeping deep-link params', () => {
    const dead =
      'https://partner.pabau.com/online-bookings/made-51g64?category=312809&services=3564434';
    expect(normalizePabauBookingUrl(dead, BASE)).toBe(
      `${BASE}?category=312809&services=3564434`,
    );
  });

  it('leaves an already-canonical deep link unchanged', () => {
    const ok = `${BASE}?category=10&services=20`;
    expect(normalizePabauBookingUrl(ok, BASE)).toBe(ok);
  });

  it('drops non-deep-link params (e.g. groupCategory) down to the bare base', () => {
    const generic = 'https://partner.pabau.com/online-bookings/made-51g64?groupCategory=0';
    expect(normalizePabauBookingUrl(generic, BASE)).toBe(BASE);
  });

  it('rewrites other Pabau hosts too (crm.pabau.com)', () => {
    const legacy = 'https://crm.pabau.com/online-bookings/made-51g64?category=5&services=6';
    expect(normalizePabauBookingUrl(legacy, BASE)).toBe(`${BASE}?category=5&services=6`);
  });

  it('returns null for empty / missing input', () => {
    expect(normalizePabauBookingUrl(undefined, BASE)).toBeNull();
    expect(normalizePabauBookingUrl(null, BASE)).toBeNull();
    expect(normalizePabauBookingUrl('   ', BASE)).toBeNull();
  });

  it('returns null for an unparseable string', () => {
    expect(normalizePabauBookingUrl('not a url', BASE)).toBeNull();
  });

  it('passes a non-Pabau custom link through untouched', () => {
    const custom = 'https://calendly.com/made-med-spa/consult';
    expect(normalizePabauBookingUrl(custom, BASE)).toBe(custom);
  });
});

"use client";

import { useState, FormEvent } from "react";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const TREATMENT_OPTIONS = [
  "Just exploring",
  "Botox / Tox",
  "Filler",
  "Skin Treatment",
  "Laser",
  "Membership",
  "Other",
];

const FALLBACK_EMAIL =
  process.env.NEXT_PUBLIC_FALLBACK_CONTACT_EMAIL ?? "hello@mademedspa.com";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function buildMailto(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  treatmentInterest: string;
  message: string;
}): string {
  const subject = encodeURIComponent(
    `Website inquiry from ${input.firstName} ${input.lastName}`,
  );
  const body = encodeURIComponent(
    [
      `Name: ${input.firstName} ${input.lastName}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      input.treatmentInterest ? `Interest: ${input.treatmentInterest}` : null,
      "",
      input.message,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
}

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [treatmentInterest, setTreatmentInterest] = useState("");
  const [message, setMessage] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim()) errs.lastName = "Last name is required.";
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!message.trim()) errs.message = "Please include a message.";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setShowFallback(false);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/pabau/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          treatmentInterest: treatmentInterest || undefined,
          message: message.trim(),
          marketingConsent,
          source: "contact_page",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (res.ok && data.success) {
        setIsSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setTreatmentInterest("");
        setMessage("");
        setMarketingConsent(false);
        setErrors({});
        return;
      }

      if (res.status === 400 && data.fieldErrors) {
        setErrors(data.fieldErrors as FormErrors);
        return;
      }

      setSubmitError(
        data.error ??
          "We couldn't send your message right now. You can email us directly instead.",
      );
      setShowFallback(true);
    } catch {
      setSubmitError(
        "We couldn't reach our system. You can email us directly instead.",
      );
      setShowFallback(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-20 px-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 mb-8"
          style={{ color: "var(--color-secondary)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3
          className="headline-section text-2xl md:text-3xl mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Thank You
        </h3>
        <p
          className="body-editorial max-w-md mx-auto mb-10"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Your message has been received. We will be in touch within 24 hours to
          assist you.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="link-editorial"
          style={{ color: "var(--color-secondary)" }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Name fields — 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <label
            htmlFor="firstName"
            className="label-micro block mb-3"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            required
            aria-required="true"
            aria-invalid={errors.firstName ? "true" : undefined}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            autoComplete="given-name"
            className="input-editorial w-full"
          />
          {errors.firstName && (
            <p
              id="firstName-error"
              className="text-xs mt-2"
              style={{ color: "var(--color-secondary)" }}
            >
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="relative">
          <label
            htmlFor="lastName"
            className="label-micro block mb-3"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required
            aria-required="true"
            aria-invalid={errors.lastName ? "true" : undefined}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            autoComplete="family-name"
            className="input-editorial w-full"
          />
          {errors.lastName && (
            <p
              id="lastName-error"
              className="text-xs mt-2"
              style={{ color: "var(--color-secondary)" }}
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email — full width */}
      <div>
        <label
          htmlFor="email"
          className="label-micro block mb-3"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          required
          aria-required="true"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
          className="input-editorial w-full"
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-xs mt-2"
            style={{ color: "var(--color-secondary)" }}
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone — full width */}
      <div>
        <label
          htmlFor="phone"
          className="label-micro block mb-3"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Phone{" "}
          <span className="normal-case tracking-normal opacity-50">
            (optional)
          </span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          autoComplete="tel"
          aria-invalid={errors.phone ? "true" : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className="input-editorial w-full"
        />
        {errors.phone && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-secondary)" }}
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Treatment interest dropdown */}
      <div>
        <label
          htmlFor="treatmentInterest"
          className="label-micro block mb-3"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          What are you interested in?{" "}
          <span className="normal-case tracking-normal opacity-50">
            (optional)
          </span>
        </label>
        <select
          id="treatmentInterest"
          value={treatmentInterest}
          onChange={(e) => setTreatmentInterest(e.target.value)}
          className="input-editorial w-full"
        >
          <option value="">Select one…</option>
          {TREATMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message — full width textarea */}
      <div>
        <label
          htmlFor="message"
          className="label-micro block mb-3"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us how we can help you..."
          className="input-editorial w-full"
          style={{ minHeight: "140px" }}
        />
        {errors.message && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-secondary)" }}
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Marketing consent — opt-in */}
      <label className="flex items-start gap-3 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-1"
        />
        <span style={{ color: "var(--color-on-surface-variant)" }}>
          I'd like to receive occasional updates and offers from MADE Med Spa.
        </span>
      </label>

      {submitError && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
            {submitError}
          </p>
          {showFallback && (
            <a
              href={buildMailto({
                firstName,
                lastName,
                email,
                phone,
                treatmentInterest,
                message,
              })}
              className="link-editorial inline-block"
              style={{ color: "var(--color-secondary)" }}
            >
              Email us directly →
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
        style={{ transition: "all 500ms ease" }}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}
      >
        By submitting, you agree to be contacted by MADE Med Spa. Your information
        is handled in our secure CRM (Pabau). See our{" "}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

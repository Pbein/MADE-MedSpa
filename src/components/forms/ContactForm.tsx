"use client";

import { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/* ── Validation helpers ────────────────────────────── */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

/* ── Component ─────────────────────────────────────── */
export default function ContactForm() {
  const createSubmission = useMutation(api.contactSubmissions.create);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);

    try {
      await createSubmission({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim(),
        source: "contact_page",
      });

      setIsSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Success state ──────────────────────────────── */
  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        style={{ minHeight: 400 }}
      >
        <div
          className="accent-line mx-auto mb-6"
          style={{ backgroundColor: "var(--color-burgundy)" }}
        />
        <h3
          className="headline-text mb-4"
          style={{
            fontSize: "var(--text-3xl)",
            color: "var(--color-chocolate)",
          }}
        >
          Thank You
        </h3>
        <p
          className="mb-8 max-w-sm leading-relaxed text-[var(--color-brown)]"
          style={{ fontSize: "var(--text-base)" }}
        >
          Your message has been received. We will be in touch within 24 hours to
          assist you.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="btn btn-outline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Name row */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="editorial-spacing mb-3 block text-[var(--color-stone-dark)]"
          >
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-b bg-transparent px-0 py-3 text-[var(--color-chocolate)] outline-none transition-colors placeholder:text-[var(--color-stone)]"
            style={{
              borderColor: errors.firstName
                ? "var(--color-burgundy)"
                : "var(--color-stone)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              transitionDuration: "var(--duration-normal)",
            }}
            placeholder="Jane"
          />
          {errors.firstName && (
            <p
              className="mt-2 text-[var(--color-burgundy)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="editorial-spacing mb-3 block text-[var(--color-stone-dark)]"
          >
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-b bg-transparent px-0 py-3 text-[var(--color-chocolate)] outline-none transition-colors placeholder:text-[var(--color-stone)]"
            style={{
              borderColor: errors.lastName
                ? "var(--color-burgundy)"
                : "var(--color-stone)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              transitionDuration: "var(--duration-normal)",
            }}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p
              className="mt-2 text-[var(--color-burgundy)]"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="editorial-spacing mb-3 block text-[var(--color-stone-dark)]"
        >
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b bg-transparent px-0 py-3 text-[var(--color-chocolate)] outline-none transition-colors placeholder:text-[var(--color-stone)]"
          style={{
            borderColor: errors.email
              ? "var(--color-burgundy)"
              : "var(--color-stone)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            transitionDuration: "var(--duration-normal)",
          }}
          placeholder="jane@example.com"
        />
        {errors.email && (
          <p
            className="mt-2 text-[var(--color-burgundy)]"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      <div>
        <label
          htmlFor="phone"
          className="editorial-spacing mb-3 block text-[var(--color-stone-dark)]"
        >
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-b bg-transparent px-0 py-3 text-[var(--color-chocolate)] outline-none transition-colors placeholder:text-[var(--color-stone)]"
          style={{
            borderColor: "var(--color-stone)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            transitionDuration: "var(--duration-normal)",
          }}
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="editorial-spacing mb-3 block text-[var(--color-stone-dark)]"
        >
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none border-b bg-transparent px-0 py-3 text-[var(--color-chocolate)] outline-none transition-colors placeholder:text-[var(--color-stone)]"
          style={{
            borderColor: errors.message
              ? "var(--color-burgundy)"
              : "var(--color-stone)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            transitionDuration: "var(--duration-normal)",
          }}
          placeholder="Tell us how we can help you..."
        />
        {errors.message && (
          <p
            className="mt-2 text-[var(--color-burgundy)]"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <div
          className="rounded-[var(--border-radius-sm)] border px-4 py-3"
          style={{
            borderColor: "var(--color-burgundy)",
            backgroundColor: "rgba(122, 0, 0, 0.05)",
          }}
        >
          <p
            className="text-[var(--color-burgundy)]"
            style={{ fontSize: "var(--text-sm)" }}
          >
            {submitError}
          </p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full sm:w-auto"
        style={{
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

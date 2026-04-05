"use client";

import { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

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

  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        style={{ minHeight: 400 }}
      >
        <div
          className="accent-line mx-auto mb-6"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        <h3
          className="headline-text mb-4"
          style={{
            fontSize: "var(--text-3xl)",
            color: "var(--color-deep-cocoa)",
          }}
        >
          Thank You
        </h3>
        <p
          className="mb-8 max-w-sm leading-relaxed"
          style={{ fontSize: "var(--text-base)", color: "var(--color-warm-taupe)", fontWeight: 300 }}
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

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="editorial-spacing mb-3 block"
            style={{ color: "var(--color-cream)" }}
          >
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-b bg-transparent px-0 py-3 outline-none transition-colors"
            style={{
              borderColor: errors.firstName ? "var(--color-accent)" : "var(--color-border)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-deep-cocoa)",
              transitionDuration: "var(--duration-normal)",
            }}
            placeholder="Jane"
          />
          {errors.firstName && (
            <p className="mt-2" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-text)" }}>
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="editorial-spacing mb-3 block"
            style={{ color: "var(--color-cream)" }}
          >
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-b bg-transparent px-0 py-3 outline-none transition-colors"
            style={{
              borderColor: errors.lastName ? "var(--color-accent)" : "var(--color-border)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-deep-cocoa)",
              transitionDuration: "var(--duration-normal)",
            }}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-2" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-text)" }}>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="editorial-spacing mb-3 block"
          style={{ color: "var(--color-cream)" }}
        >
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b bg-transparent px-0 py-3 outline-none transition-colors"
          style={{
            borderColor: errors.email ? "var(--color-accent)" : "var(--color-border)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-deep-cocoa)",
            transitionDuration: "var(--duration-normal)",
          }}
          placeholder="jane@example.com"
        />
        {errors.email && (
          <p className="mt-2" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-text)" }}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="editorial-spacing mb-3 block"
          style={{ color: "var(--color-cream)" }}
        >
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-b bg-transparent px-0 py-3 outline-none transition-colors"
          style={{
            borderColor: "var(--color-border)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-deep-cocoa)",
            transitionDuration: "var(--duration-normal)",
          }}
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="editorial-spacing mb-3 block"
          style={{ color: "var(--color-cream)" }}
        >
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none border-b bg-transparent px-0 py-3 outline-none transition-colors"
          style={{
            borderColor: errors.message ? "var(--color-accent)" : "var(--color-border)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-deep-cocoa)",
            transitionDuration: "var(--duration-normal)",
          }}
          placeholder="Tell us how we can help you..."
        />
        {errors.message && (
          <p className="mt-2" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent-text)" }}>
            {errors.message}
          </p>
        )}
      </div>

      {submitError && (
        <div
          className="px-4 py-3"
          style={{
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--color-accent-text)",
            backgroundColor: "rgba(139, 115, 64, 0.05)",
          }}
        >
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent-text)" }}>
            {submitError}
          </p>
        </div>
      )}

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

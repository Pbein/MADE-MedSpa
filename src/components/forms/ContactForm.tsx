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
        {/* Green checkmark */}
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(111, 130, 91, 0.1)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-matcha)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3
          className="headline-section mb-4"
          style={{ color: "var(--color-matcha)" }}
        >
          Thank You
        </h3>
        <p
          className="body-md mb-8 max-w-sm"
          style={{ color: "var(--color-olive)" }}
        >
          Your message has been received. We will be in touch within 24 hours to
          assist you.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="btn-secondary"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const labelClasses = "mb-3 block";
  const labelStyle = {
    color: "var(--color-mocha)",
    fontSize: "0.75rem",
    fontWeight: 600 as const,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Name fields - 2 column grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClasses} style={labelStyle}>
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-luxury w-full"
            placeholder="Jane"
          />
          {errors.firstName && (
            <p className="mt-2" style={{ fontSize: "0.75rem", color: "var(--color-blush)" }}>
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className={labelClasses} style={labelStyle}>
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-luxury w-full"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-2" style={{ fontSize: "0.75rem", color: "var(--color-blush)" }}>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email - full width */}
      <div>
        <label htmlFor="email" className={labelClasses} style={labelStyle}>
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-luxury w-full"
          placeholder="jane@example.com"
        />
        {errors.email && (
          <p className="mt-2" style={{ fontSize: "0.75rem", color: "var(--color-blush)" }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone - full width */}
      <div>
        <label htmlFor="phone" className={labelClasses} style={labelStyle}>
          Phone{" "}
          <span style={{ textTransform: "none", letterSpacing: "normal", fontWeight: 400 }}>
            (optional)
          </span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-luxury w-full"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Message - full width */}
      <div>
        <label htmlFor="message" className={labelClasses} style={labelStyle}>
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-luxury w-full resize-none"
          placeholder="Tell us how we can help you..."
        />
        {errors.message && (
          <p className="mt-2" style={{ fontSize: "0.75rem", color: "var(--color-blush)" }}>
            {errors.message}
          </p>
        )}
      </div>

      {submitError && (
        <div
          className="rounded-md px-4 py-3"
          style={{
            border: "1px solid var(--color-blush)",
            backgroundColor: "rgba(180, 120, 100, 0.05)",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "var(--color-blush)" }}>
            {submitError}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full sm:w-auto"
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

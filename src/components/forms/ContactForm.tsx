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
          className="font-headline italic text-3xl md:text-4xl mb-4"
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
            className="input-editorial w-full"
          />
          {errors.firstName && (
            <p
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
            className="input-editorial w-full"
          />
          {errors.lastName && (
            <p
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
          className="input-editorial w-full"
        />
        {errors.email && (
          <p
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
          className="input-editorial w-full"
        />
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

      {submitError && (
        <div>
          <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
            {submitError}
          </p>
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
    </form>
  );
}

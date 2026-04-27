"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const editorialEase = [0.2, 0, 0, 1] as const;

const LAST_REVIEWED = "April 26, 2026";
const CONTACT_EMAIL = "info@mademedspa.com";

export default function AccessibilityPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-48">
        <motion.div
          className="mx-auto max-w-7xl px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: editorialEase }}
        >
          <p className="label-micro text-[var(--color-surface)] opacity-80 mb-6">
            Legal
          </p>
          <h1 className="headline-editorial text-[var(--color-surface)]">
            Accessibility Statement
          </h1>
          <p
            className="body-editorial mt-8 text-[var(--color-surface)]"
            style={{ opacity: 0.75 }}
          >
            Last reviewed: {LAST_REVIEWED}
          </p>
        </motion.div>
      </section>

      {/* Body */}
      <section className="bg-[var(--color-surface)] py-40">
        <motion.div
          className="mx-auto max-w-3xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: editorialEase }}
        >
          {/* Our commitment */}
          <h2 className="font-headline italic text-3xl md:text-4xl mb-6 text-[var(--color-primary)]">
            Our commitment
          </h2>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
            MADE Med Spa is committed to making its website accessible to all
            users, including those with disabilities. We believe that thoughtful
            design serves everyone, and we work to ensure that the experience of
            learning about our practice, exploring our services, and reaching
            out to book a consultation is welcoming regardless of how you
            navigate the web.
          </p>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-16 leading-relaxed">
            We aim for our website to conform with the{" "}
            <a
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2 hover:text-[var(--color-secondary)]"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
            </a>
            . These guidelines explain how to make web content more accessible
            to people with a wide range of disabilities, including visual,
            auditory, motor, and cognitive limitations.
          </p>

          {/* What we do */}
          <h2 className="font-headline italic text-3xl md:text-4xl mb-6 text-[var(--color-primary)]">
            What we do
          </h2>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">
            Accessibility is part of how we build and maintain our site. Among
            the practices we follow:
          </p>
          <ul className="body-editorial text-[var(--color-on-surface-variant)] mb-16 leading-relaxed list-disc pl-6 space-y-3">
            <li>
              <strong className="text-[var(--color-primary)]">Keyboard navigation.</strong>{" "}
              The site can be operated using only a keyboard. A &ldquo;skip to
              main content&rdquo; link is available at the top of every page,
              and interactive elements show a visible focus state when tabbed
              to.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Alternative text.</strong>{" "}
              Images that convey information include descriptive text for
              screen readers. Decorative images are marked so assistive
              technology can skip past them.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Color and contrast.</strong>{" "}
              Body text and meaningful interface elements meet WCAG AA contrast
              requirements against their backgrounds.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Semantic HTML.</strong>{" "}
              Pages use proper headings, landmarks, lists, and form labels so
              the structure is clear to assistive technology.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Screen-reader compatibility.</strong>{" "}
              Forms include labeled inputs and error messages, buttons describe
              their action, and dynamic content uses standard ARIA patterns
              when appropriate.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Responsive layout.</strong>{" "}
              The site adapts to different screen sizes and zoom levels so it
              remains usable on phones, tablets, and at increased text sizes.
            </li>
          </ul>

          {/* Known limitations */}
          <h2 className="font-headline italic text-3xl md:text-4xl mb-6 text-[var(--color-primary)]">
            Known limitations
          </h2>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">
            We work to identify and resolve accessibility issues as we find
            them. As of {LAST_REVIEWED}, we are aware of the following
            limitations:
          </p>
          <ul className="body-editorial text-[var(--color-on-surface-variant)] mb-6 leading-relaxed list-disc pl-6 space-y-3">
            <li>
              <strong className="text-[var(--color-primary)]">Embedded booking widget.</strong>{" "}
              Our online booking is provided by Pabau, a third-party
              practice-management system. The accessibility of the embedded
              booking interface is governed by the vendor and is outside our
              direct control. If you have difficulty using the booking widget,
              please call or email us using the information below and we will
              schedule for you directly.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Embedded map.</strong>{" "}
              Our location is shown via Google Maps, whose accessibility is
              governed by Google. Our address, hours, and phone number are also
              provided in plain text on the contact page so the same
              information is available without the map.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Motion and animation.</strong>{" "}
              The site uses subtle fade and slide animations on scroll. These
              are decorative and do not convey information. We recommend users
              who are sensitive to motion enable their operating system&rsquo;s
              &ldquo;reduce motion&rdquo; preference; we are continuing to
              audit our animations to ensure they fully respect this setting.
            </li>
          </ul>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-16 leading-relaxed">
            If you encounter an accessibility barrier we have not listed,
            please tell us &mdash; see the next section. We treat accessibility
            reports with the same priority as any other functional bug.
          </p>

          {/* Reporting issues / contact */}
          <h2 className="font-headline italic text-3xl md:text-4xl mb-6 text-[var(--color-primary)]">
            Reporting an issue
          </h2>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">
            If something on this site is hard to use with assistive technology,
            or if you need information from the site provided in another
            format, please reach out and we will help directly:
          </p>
          <ul className="body-editorial text-[var(--color-on-surface-variant)] mb-4 leading-relaxed list-none pl-0 space-y-2">
            <li>
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-1 underline-offset-2 hover:text-[var(--color-secondary)]"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              Phone: see the{" "}
              <Link
                href="/contact"
                className="underline decoration-1 underline-offset-2 hover:text-[var(--color-secondary)]"
              >
                contact page
              </Link>{" "}
              for the current studio number
            </li>
            <li>Mail: 1311-A Dolley Madison Blvd, Suite 1B, McLean, VA 22101</li>
          </ul>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-16 leading-relaxed">
            When reporting an issue, please describe the page you were on, what
            you were trying to do, and the assistive technology and browser you
            were using. We aim to respond within two business days.
          </p>

          {/* Third-party content */}
          <h2 className="font-headline italic text-3xl md:text-4xl mb-6 text-[var(--color-primary)]">
            Third-party content
          </h2>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
            Some functionality on our site is provided by third parties whose
            accessibility we do not directly control:
          </p>
          <ul className="body-editorial text-[var(--color-on-surface-variant)] mb-6 leading-relaxed list-disc pl-6 space-y-3">
            <li>
              <strong className="text-[var(--color-primary)]">Pabau</strong> &mdash; online booking and patient portal.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Google Maps</strong> &mdash; embedded location map.
            </li>
            <li>
              <strong className="text-[var(--color-primary)]">Clerk</strong> &mdash; authentication for our private admin area.
            </li>
          </ul>
          <p className="body-editorial text-[var(--color-on-surface-variant)] mb-16 leading-relaxed">
            We choose vendors who treat accessibility as a priority and we
            raise concerns with them when we find issues. If a third-party
            component is preventing you from completing a task on our site,
            please contact us using the information above and we will help you
            another way.
          </p>

          <p
            className="body-editorial text-[var(--color-on-surface-variant)] leading-relaxed text-sm"
            style={{ opacity: 0.7 }}
          >
            This statement was last reviewed on {LAST_REVIEWED}. We review it
            at least annually and whenever we make significant changes to the
            site.
          </p>
        </motion.div>
      </section>
    </>
  );
}

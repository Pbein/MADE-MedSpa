// Full-width editorial moment — bold Playfair Display headline on Espresso.
// Karlyne 2026-05-28: "I want a section between the hero and services that's
// just a bold statement in large Playfair Display on an Espresso background.
// One line: 'REFINEMENT OVER TRANSFORMATION.' This is the kind of moment Aesop
// and Violet Grey nail."
//
// Deliberately unornamented (no diamond rules, no eyebrow, no subhead) so the
// statement carries the section by itself. For ornamented pull-quotes use
// EditorialBreak.tsx instead.
//
// Title case ("Refinement Over Transformation") is the home treatment. The
// existing /about page uses an all-caps Futura PT Book h2 of the same phrase —
// keeping different visual registers on each page is intentional so the moment
// reads as a callback rather than a duplicate.

interface EditorialMomentProps {
  headline?: string;
}

export default function EditorialMoment({
  headline = "Refinement Over Transformation.",
}: EditorialMomentProps) {
  return (
    <section
      className="py-32 md:py-44 lg:py-52 px-6 text-center"
      style={{
        backgroundColor: "var(--color-primary, #391e1e)",
        color: "var(--color-on-primary, #f7f6eb)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="headline-editorial"
          style={{
            color: "var(--color-on-primary, #f7f6eb)",
            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
            lineHeight: 1.1,
            textWrap: "balance",
          }}
        >
          {headline}
        </h2>
      </div>
    </section>
  );
}

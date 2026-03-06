import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Remove top padding (useful when first section handles its own spacing) */
  noPaddingTop?: boolean;
}

export default function PageWrapper({
  children,
  className,
  noPaddingTop = false,
}: PageWrapperProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[var(--max-width)] px-6 lg:px-10",
        !noPaddingTop && "pt-[var(--nav-height)]",
        className
      )}
    >
      {children}
    </main>
  );
}

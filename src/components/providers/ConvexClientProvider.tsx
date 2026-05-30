"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // reducedMotion="user" makes every framer-motion animation honor the OS
  // "reduce motion" setting (framer-motion ignores it by default): transforms
  // like the scroll fade-up are dropped while opacity fades still play.
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ConvexProviderWithClerk>
  );
}

"use client";

import PageEditor from "@/components/admin/PageEditor";
import { PAGE_DEFINITIONS } from "@/lib/sectionDefinitions";

const page = PAGE_DEFINITIONS.find((p) => p.key === "testimonials")!;

export default function EditTestimonialsPage() {
  return <PageEditor page={page} />;
}

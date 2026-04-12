import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import ServiceDetailClient from "./ServiceDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchQuery(api.services.getBySlug, { slug });

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  return {
    title: service.name,
    description: service.shortDescription,
    alternates: {
      canonical: `https://mademedspaaesthetics.com/services/${slug}`,
    },
    openGraph: {
      title: `${service.name} | MADE Med Spa`,
      description: service.shortDescription,
      type: "website",
      images: service.imageUrl
        ? [{ url: service.imageUrl, alt: service.name }]
        : undefined,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailClient slug={slug} />;
}

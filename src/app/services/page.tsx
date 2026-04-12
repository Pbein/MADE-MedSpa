import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import ServicesPageClient from "./ServicesPageClient";

export default async function ServicesPage() {
  const heroBg = await fetchQuery(api.siteContent.getByKey, {
    key: "services_hero_bg",
  });

  return <ServicesPageClient heroBgUrl={heroBg?.imageUrl} />;
}

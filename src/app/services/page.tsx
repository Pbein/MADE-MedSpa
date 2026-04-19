import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import ServicesPageClient from "./ServicesPageClient";
import { buildStyleOverrides } from "@/components/PageSettingsWrapper";

export default async function ServicesPage() {
  const [heroBg, pageSettings] = await Promise.all([
    fetchQuery(api.siteContent.getByKey, { key: "services_hero_bg" }),
    fetchQuery(api.siteContent.getByKey, { key: "page_settings_services" }),
  ]);

  const meta = pageSettings?.metadata as Record<string, unknown> | undefined;
  const styles = buildStyleOverrides(meta);

  return (
    <div style={styles}>
      <ServicesPageClient heroBgUrl={heroBg?.imageUrl} pageSettings={meta} />
    </div>
  );
}

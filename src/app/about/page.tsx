import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import AboutPageClient from "./AboutPageClient";
import { buildStyleOverrides } from "@/components/PageSettingsWrapper";

export default async function AboutPage() {
  const [heroBg, pageSettings] = await Promise.all([
    fetchQuery(api.siteContent.getByKey, { key: "about_hero_bg" }),
    fetchQuery(api.siteContent.getByKey, { key: "page_settings_about" }),
  ]);

  const meta = pageSettings?.metadata as Record<string, unknown> | undefined;
  const styles = buildStyleOverrides(meta);

  return (
    <div style={styles}>
      <AboutPageClient heroBgUrl={heroBg?.imageUrl} pageSettings={meta} />
    </div>
  );
}

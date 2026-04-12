import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage() {
  const heroBg = await fetchQuery(api.siteContent.getByKey, {
    key: "about_hero_bg",
  });

  return <AboutPageClient heroBgUrl={heroBg?.imageUrl} />;
}

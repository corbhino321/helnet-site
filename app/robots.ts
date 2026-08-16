import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://helnetservices.ch/sitemap.xml", host: "https://helnetservices.ch" }; }

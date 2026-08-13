import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return ["", "/notes", "/groups", "/about", "/contact", "/terms", "/privacy", "/refund-policy"].map((path) => ({ url: `${url}${path}`, lastModified: new Date() }));
}

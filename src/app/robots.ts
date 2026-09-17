import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Amazonbot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}

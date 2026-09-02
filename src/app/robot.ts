import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/checkout",
          "/checkout/",
          "/api/",
          "/order/track",
          "/order/[orderId]",
          "/order/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Googlebot-Image",
        disallow: ["/api/", "/checkout"],
        allow: ["/og/", "/notes/", "/groups/"],
      },
      {
        userAgent: "Googlebot-Mobile",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Googlebot-News",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Googlebot-Video",
        allow: ["/notes", "/groups"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Amazonbot",
        disallow: ["/admin", "/checkout", "/api/"],
        allow: ["/notes", "/groups", "/about", "/contact"],
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Omgilibot",
        disallow: ["/admin", "/checkout", "/api/"],
        allow: ["/notes", "/groups"],
      },
      {
        userAgent: "Anthropic AI",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Claude",
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
      {
        userAgent: "Coqui AI",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "Bytespider",
        disallow: ["/admin", "/checkout", "/api/"],
        allow: ["/notes", "/groups", "/about", "/contact"],
      },
      {
        userAgent: "Youbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Ahrefbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "Semrushbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "MJ12bot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "AhrefsSiteAudit",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      {
        userAgent: "DotBot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      {
        userAgent: "PetalBot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}

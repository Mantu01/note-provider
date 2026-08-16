import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://notesprovider.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rules for all crawlers
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
      // Google's primary crawler
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // Google's image crawler
      {
        userAgent: "Googlebot-Image",
        disallow: ["/api/", "/checkout"],
        allow: ["/og/", "/notes/", "/groups/"],
      },
      // Google's mobile crawler
      {
        userAgent: "Googlebot-Mobile",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // Google's sync crawler
      {
        userAgent: "Googlebot-News",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      // Google's video crawler
      {
        userAgent: "Googlebot-Video",
        allow: ["/notes", "/groups"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      // Bing crawler
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // Yahoo crawler
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // Baidu crawler
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // Yandex crawler
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // DuckDuckBot - AI/search crawler, allow content pages
      {
        userAgent: "DuckDuckBot",
        allow: ["/notes", "/groups", "/about", "/contact"],
        disallow: ["/admin", "/checkout", "/api/"],
      },
      // Applebot - Apple's crawler
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/", "/order/track", "/order/[orderId]"],
      },
      // Amazonbot - Amazon's crawler
      {
        userAgent: "Amazonbot",
        disallow: ["/admin", "/checkout", "/api/"],
        allow: ["/notes", "/groups", "/about", "/contact"],
      },
      // CCBot - Common Crawl (AI training data)
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      // Facebook crawler
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      // Twitter crawler
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      // LinkedIn crawler
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/api/"],
      },
      // Omgili crawler
      {
        userAgent: "Omgilibot",
        disallow: ["/admin", "/checkout", "/api/"],
        allow: ["/notes", "/groups"],
      },
      // AI / LLM crawlers - allow content, block sensitive
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

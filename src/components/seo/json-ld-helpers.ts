export type JsonLdScript = {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
};

export type JsonLdReturn = JsonLdScript[];

type WebPageJsonLd = JsonLdScript & { "@type": "WebPage" };

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://notesprovider.com";
}

export function organizationJsonLd(): JsonLdReturn {
  const url = getAppUrl();
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Notes Provider",
      url,
      logo: `${url}/og/home.png`,
      description: "Curated coding notes and developer resources for web development, DSA, DBMS, backend, frontend, and system design.",
      sameAs: [
        "https://x.com",
        "https://youtube.com",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@notesprovider.com",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
  ];
}

export function websiteJsonLd(): JsonLdReturn {
  const url = getAppUrl();
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Notes Provider",
      url,
      description: "Curated download-ready coding notes for web dev, backend, DSA, DBMS, and system design learners.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${url}/notes?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
      publisher: {
        "@type": "Organization",
        name: "Notes Provider",
      },
    },
  ];
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLdReturn {
  const url = getAppUrl();
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${url}${item.url}`,
      })),
    },
  ];
}

export function productJsonLd(note: {
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  currency: string;
  imageUrl: string | null;
  category: { name: string };
  level: string;
  pageCount: number | null;
  url: string;
  ratingValue?: number;
  ratingCount?: number;
}): JsonLdReturn {
  const appUrl = getAppUrl();
  const pageUrl = `${appUrl}${note.url.startsWith("/") ? note.url : `/${note.url}`}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: note.title,
      description: note.description,
      image: note.imageUrl || `${appUrl}/og/home.png`,
      url: pageUrl,
      brand: {
        "@type": "Brand",
        name: "Notes Provider",
      },
      offers: {
        "@type": "Offer",
        price: note.price,
        priceCurrency: note.currency,
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Notes Provider",
        },
      },
      aggregateRating: note.ratingValue && note.ratingCount
        ? {
            "@type": "AggregateRating",
            ratingValue: note.ratingValue,
            reviewCount: note.ratingCount,
          }
        : undefined,
      category: note.category.name,
      additionalProperty: [
        { "@type": "PropertyValue", name: "Format", value: "PDF" },
        { "@type": "PropertyValue", name: "Difficulty Level", value: note.level },
        note.pageCount
          ? { "@type": "PropertyValue", name: "Number of Pages", value: note.pageCount.toString() }
          : null,
      ].filter(Boolean),
    },
  ];
}

export function courseJsonLd(note: {
  title: string;
  description: string;
  url: string;
  category: { name: string };
  level: string;
  imageUrl: string | null;
}): JsonLdReturn {
  const appUrl = getAppUrl();
  const pageUrl = `${appUrl}${note.url.startsWith("/") ? note.url : `/${note.url}`}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: note.title,
      description: note.description,
      url: pageUrl,
      image: note.imageUrl || `${appUrl}/og/home.png`,
      provider: {
        "@type": "Organization",
        name: "Notes Provider",
        url: appUrl,
      },
      educationalLevel: note.level === "basics" ? "Beginner" : note.level === "intermediate" ? "Intermediate" : "Advanced",
      subject: note.category.name,
      inLanguage: "en-IN",
      teachingMethod: "Self-study with PDF notes",
      learningResourceType: "Study Guide",
    },
  ];
}

export function reviewJsonLd(note: {
  title: string;
  ratingValue?: number;
  ratingCount?: number;
  url: string;
}): JsonLdReturn {
  if (!note.ratingValue || !note.ratingCount) return [];
  const appUrl = getAppUrl();
  const pageUrl = `${appUrl}${note.url.startsWith("/") ? note.url : `/${note.url}`}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Review",
      name: `${note.title} — ${note.ratingValue} out of 5 stars`,
      reviewBody: `Students rate ${note.title} highly for exam preparation.`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: note.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Organization",
        name: "Notes Provider Students",
      },
      itemReviewed: {
        "@type": "Product",
        name: note.title,
        url: pageUrl,
      },
    },
  ];
}

export function faqJsonLd(faqs: readonly { question: string; answer: string }[]): JsonLdReturn {
  return [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}

export function howToJsonLd(steps: readonly { name: string; text: string }[]): JsonLdReturn {
  return [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to get study notes from Notes Provider",
      description: "Follow these steps to download or purchase study notes.",
      step: steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
      totalTime: "PT5M",
    },
  ];
}

export function webpageJsonLd(params: {
  title: string;
  description: string;
  url: string;
  image?: string;
  itemCount?: number;
}): JsonLdReturn {
  const appUrl = getAppUrl();
  const base: WebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.title,
    description: params.description,
    url: params.url,
    inLanguage: "en-IN",
    about: {
      "@type": "Organization",
      name: "Notes Provider",
    },
    primaryImageOfPage: params.image
      ? { "@type": "ImageObject", url: params.image }
      : undefined,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    isPartOf: {
      "@type": "WebSite",
      name: "Notes Provider",
      url: appUrl,
    },
  };
  if (params.itemCount !== undefined) {
    base.numberOfItems = params.itemCount;
  }
  return [base];
}

export function collectionPageJsonLd(params: {
  title: string;
  description: string;
  url: string;
  image?: string;
  itemCount?: number;
}): JsonLdReturn {
  const appUrl = getAppUrl();
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: params.title,
      description: params.description,
      url: params.url,
      inLanguage: "en-IN",
      about: {
        "@type": "Organization",
        name: "Notes Provider",
      },
      primaryImageOfPage: params.image
        ? { "@type": "ImageObject", url: params.image }
        : undefined,
      isPartOf: {
        "@type": "WebSite",
        name: "Notes Provider",
        url: appUrl,
      },
      ...(params.itemCount ? { numberOfItems: params.itemCount } : {}),
    },
  ];
}

export function articleJsonLd(note: {
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  category: { name: string };
  level: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}): JsonLdReturn {
  const appUrl = getAppUrl();
  const pageUrl = `${appUrl}${note.url.startsWith("/") ? note.url : `/${note.url}`}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: note.title,
      description: note.description,
      image: note.imageUrl || `${appUrl}/og/home.png`,
      url: pageUrl,
      datePublished: note.createdAt,
      dateModified: note.updatedAt,
      author: {
        "@type": "Organization",
        name: "Notes Provider",
        url: appUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Notes Provider",
        logo: { "@type": "ImageObject", url: `${appUrl}/og/home.png` },
      },
      keywords: [`${note.category.name} notes`, note.level, "PDF study notes", ...(note.tags || [])],
      inLanguage: "en-IN",
      about: {
        "@type": "EducationalOccupationalCredential",
        name: `${note.category.name} Developer Notes`,
      },
    },
  ];
}

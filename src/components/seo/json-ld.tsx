import Script from "next/script";
import type { JsonLdScript } from "./json-ld-helpers";

export type { JsonLdScript, JsonLdReturn } from "./json-ld-helpers";
export {
  organizationJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
  productJsonLd,
  courseJsonLd,
  reviewJsonLd,
  faqJsonLd,
  howToJsonLd,
  webpageJsonLd,
  collectionPageJsonLd,
  articleJsonLd,
} from "./json-ld-helpers";

interface JsonLdProps {
  scripts: JsonLdScript[] | (JsonLdScript | JsonLdScript[])[];
}

function safeStringifyJsonLd(data: JsonLdScript): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default function JsonLd({ scripts }: JsonLdProps) {
  const flatScripts = scripts
    .flat(Infinity)
    .filter((s): s is JsonLdScript => typeof s === "object" && s !== null && "@context" in s);
  return (
    <>
      {flatScripts.map((script) => {
        const id = `json-ld-${script["@type"]}-${script.name ?? ""}`;
        return (
          <Script
            key={id}
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeStringifyJsonLd(script) }}
          />
        );
      })}
    </>
  );
}

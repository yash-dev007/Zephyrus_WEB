import { HomePage } from "@/components/home/HomePage";
import { moduleHighlights, siteConfig, statementLines } from "@/data/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "AI workspace",
  operatingSystem: "Linux, macOS, Windows",
  url: siteConfig.url,
  codeRepository: siteConfig.github,
  license: siteConfig.licenseUrl,
  softwareVersion: siteConfig.version,
  featureList: moduleHighlights.map((module) => module.label),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  sameAs: [siteConfig.github],
  abstract: statementLines.flat().join(" "),
};

export default function Home() {
  return (
    <>
      <HomePage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

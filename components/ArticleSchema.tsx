export interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}

export default function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  url,
}: ArticleSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    url,
    author: { "@type": "Organization", name: "시니어라이프" },
    publisher: {
      "@type": "Organization",
      name: "시니어라이프",
      url: "https://senior-life.kr",
    },
    inLanguage: "ko",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

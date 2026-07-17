import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `https://seniordeundun.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", listStyle: "none", padding: 0, margin: 0, fontSize: 11, color: "#9B9890" }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {idx > 0 && (
                <span style={{ fontSize: 15 }} aria-hidden="true">›</span>
              )}
              {item.href ? (
                <Link href={item.href} style={{ color: "#9B9890", textDecoration: "none" }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: "#1A1A1A", fontWeight: 500 }}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

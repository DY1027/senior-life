"use client";
import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section aria-label="자주 묻는 질문">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 14, letterSpacing: "-0.3px" }}>
          자주 묻는 질문
        </h2>
        <div style={{ borderTop: "0.5px solid #EEECE6" }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ borderBottom: "0.5px solid #EEECE6" }}>
              <button
                style={{ width: "100%", textAlign: "left", padding: "14px 0", fontSize: 14, fontWeight: 500, color: "#1A1A1A", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer" }}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
              >
                <span>{item.question}</span>
                <i
                  className={`ti ${openIdx === idx ? "ti-chevron-up" : "ti-chevron-down"}`}
                  style={{ fontSize: 16, color: "#9B9890", flexShrink: 0 }}
                  aria-hidden="true"
                />
              </button>
              {openIdx === idx && (
                <div style={{ paddingBottom: 14, fontSize: 13, color: "#6B6860", lineHeight: 1.7 }}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

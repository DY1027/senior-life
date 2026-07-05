import BreadcrumbNav, { BreadcrumbItem } from "@/components/BreadcrumbNav";

export default function LegalDoc({
  title,
  effectiveDate,
  breadcrumb,
  children,
}: {
  title: string;
  effectiveDate: string;
  breadcrumb: BreadcrumbItem[];
  children: React.ReactNode;
}) {
  return (
    <>
      <div style={{ background: "#FAFAF8", borderBottom: "0.5px solid #EEECE6", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BreadcrumbNav items={breadcrumb} />
          <h1 style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 10 }}>
            {title}
          </h1>
          <p style={{ fontSize: 12, color: "#9B9890" }}>시행일: {effectiveDate}</p>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 48px" }}>
        {children}
      </article>
    </>
  );
}

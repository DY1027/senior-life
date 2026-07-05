export default function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 10, letterSpacing: "-0.3px" }}>
        {title}
      </h2>
      <div style={{ fontSize: 13.5, color: "#4A4844", lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

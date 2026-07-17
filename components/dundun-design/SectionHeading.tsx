import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  level?: 1 | 2;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
  align = "left",
  id,
}: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={`dd-heading dd-heading-${align}`}>
      {eyebrow && <p className="dd-eyebrow">{eyebrow}</p>}
      <Heading id={id} className="dd-heading-title">{title}</Heading>
      {description && <p className="dd-heading-description">{description}</p>}
    </div>
  );
}

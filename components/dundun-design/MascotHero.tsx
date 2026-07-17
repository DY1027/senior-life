import Image from "next/image";
import type { ReactNode } from "react";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";

type MascotHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  image: string;
  imageAlt: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function MascotHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: MascotHeroProps) {
  return (
    <section className="dd-hero">
      <div className="dd-shell dd-hero-grid">
        <div className="dd-hero-copy">
          <SectionHeading
            level={1}
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </div>
        <div className="dd-hero-visual">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 52vw"
            className="object-cover object-left"
          />
        </div>
        <div className="dd-hero-actions">
          <PrimaryAction href={primaryHref}>{primaryLabel}</PrimaryAction>
          <PrimaryAction href={secondaryHref} variant="secondary">{secondaryLabel}</PrimaryAction>
        </div>
      </div>
    </section>
  );
}

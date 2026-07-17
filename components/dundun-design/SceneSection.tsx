import Image from "next/image";
import type { ReactNode } from "react";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";

type SceneSectionProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  image: string;
  imageAlt: string;
  href: string;
  actionLabel: string;
  reverse?: boolean;
  tone?: "warm" | "green" | "blue" | "plain";
  children?: ReactNode;
};

export function SceneSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  href,
  actionLabel,
  reverse = false,
  tone = "plain",
  children,
}: SceneSectionProps) {
  return (
    <section className={`dd-scene dd-scene-${tone}`}>
      <div className={`dd-shell dd-scene-grid ${reverse ? "dd-scene-reverse" : ""}`.trim()}>
        <div className="dd-scene-visual">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, 52vw"
            className="object-cover"
          />
        </div>
        <div className="dd-scene-copy">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          {children}
          <PrimaryAction href={href}>{actionLabel}</PrimaryAction>
        </div>
      </div>
    </section>
  );
}

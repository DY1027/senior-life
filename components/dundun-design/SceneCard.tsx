import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type SceneCardProps = {
  href: string;
  image: string;
  imageAlt: string;
  tag: string;
  title: string;
  subtitle?: string;
  description: string;
  actionLabel?: string;
  status?: ReactNode;
  priority?: boolean;
};

export function SceneCard({
  href,
  image,
  imageAlt,
  tag,
  title,
  subtitle,
  description,
  actionLabel = "시작하기",
  status,
  priority = false,
}: SceneCardProps) {
  return (
    <article className="dd-scene-card">
      <Link href={href} className="dd-scene-card-link" aria-label={`${title} ${actionLabel}`}>
        <span className="dd-scene-card-visual">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
            className="object-contain"
          />
        </span>
        <span className="dd-scene-card-body">
          <span className="dd-card-tag">{tag}</span>
          <span className="dd-scene-card-title">{title}</span>
          {subtitle && <span className="dd-scene-card-subtitle">{subtitle}</span>}
          <span className="dd-scene-card-description">{description}</span>
          {status && <span className="dd-scene-card-status">{status}</span>}
          <span className="dd-scene-card-action">{actionLabel} <span aria-hidden="true">→</span></span>
        </span>
      </Link>
    </article>
  );
}

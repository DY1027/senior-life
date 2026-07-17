type CurvedSectionDividerProps = {
  tone?: "ivory" | "warm" | "green" | "blue";
  flip?: boolean;
};

export function CurvedSectionDivider({ tone = "ivory", flip = false }: CurvedSectionDividerProps) {
  return (
    <div className={`dd-curve dd-curve-${tone} ${flip ? "dd-curve-flip" : ""}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" focusable="false">
        <path d="M0 46C230 94 500 82 734 42C1014 0 1238 4 1440 42V90H0Z" />
      </svg>
    </div>
  );
}

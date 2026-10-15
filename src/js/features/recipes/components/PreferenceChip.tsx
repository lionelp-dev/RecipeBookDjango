import type { ReactNode } from "react";

type PreferenceChipProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
};

export function PreferenceChip({
  selected,
  onClick,
  children,
}: PreferenceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`preference-chip ${selected ? "preference-chip-active" : ""}`}
    >
      {children}
    </button>
  );
}

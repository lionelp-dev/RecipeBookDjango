import type { ReactNode } from "react";

type PreferenceGroupProps = {
  label: string;
  children: ReactNode;
};

export function PreferenceGroup({ label, children }: PreferenceGroupProps) {
  return (
    <section className="mt-6 border-b border-stone-200 pb-5">
      <h2 className="text-sm font-semibold text-stone-900">
        {label}{" "}
        <span className="font-normal text-stone-500">(facultatif)</span>
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span>{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

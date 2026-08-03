import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  className?: string;
  icon?: ReactNode;
};

export function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  autoComplete,
  className,
  icon,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-sky-950">
        {label}
      </Label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sky-600/80 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-10 border-sky-200 bg-white text-sm shadow-none md:text-sm",
            icon && "pl-10",
            className,
          )}
        />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

import { useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
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
  /** Toont een rode ster naast het label */
  required?: boolean;
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
  required = false,
}: FormInputProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-sky-950">
        {label}
        {required ? (
          <span className="ml-0.5 text-rkz-red" aria-hidden="true">
            *
          </span>
        ) : null}
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
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-10 border-sky-200 bg-white text-sm shadow-none md:text-sm",
            icon && "pl-10",
            isPassword && "pr-10",
            error &&
              "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200",
            className,
          )}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
            className="absolute top-1/2 right-2.5 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-sky-700/70 transition-colors hover:bg-sky-50 hover:text-sky-900"
          >
            <HugeiconsIcon
              icon={showPassword ? ViewOffSlashIcon : ViewIcon}
              strokeWidth={2}
              className="size-4"
            />
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

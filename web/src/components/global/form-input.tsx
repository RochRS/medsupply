import { Label } from "../ui/label";
import { Input } from "../ui/input";

type FormInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
};


export function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
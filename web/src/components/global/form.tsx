type FormInputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  //   onChange: (value: string) => void;
};

export function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  //   onChange,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        // onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
      />
    </div>
  );
}

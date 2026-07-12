type FilterProps = {
    label: string;
    options: string[];
    value: string;
    onChange: (value:string) => void;
}

export function FilterDropdown({ label, options, value, onChange}: FilterProps) {
    return (
        <div className= "flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded-md px-3 py-2">

                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
} 
interface Option {
  value: string;
  label: string;
}

export default function ChipGroup({
  options,
  selected,
  onChange,
  multi = false,
}: {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  multi?: boolean;
}) {
  function toggle(value: string) {
    if (multi) {
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    } else {
      onChange(selected.includes(value) ? [] : [value]);    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
              active
                ? "bg-sauge text-white border-sauge"
                : "bg-white text-encre border-ardoise/20 hover:border-sauge/40"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
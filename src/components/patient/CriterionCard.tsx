import ChipGroup from "./ChipGroup";

export default function CriterionCard({
  letter,
  title,
  description,
  options,
  selected,
  onChange,
  multi = false,
  required = true,
}: {
  letter: string;
  title: string;
  description: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  multi?: boolean;
  required?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="w-7 h-7 rounded-lg bg-sauge text-white text-sm font-medium flex items-center justify-center shrink-0">
          {letter}
        </span>
        <div>
          <p className="font-medium text-encre text-sm">
            {title}
            {required && <span className="text-urgent ml-0.5">*</span>}
          </p>
          <p className="text-xs text-ardoise">{description}</p>
        </div>
      </div>
      <ChipGroup options={options} selected={selected} onChange={onChange} multi={multi} />
    </div>
  );
}
import { X } from 'lucide-react';

export interface FilterChipOption {
  value: string;
  label: string;
  active?: boolean;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FilterChips({ options, selected, onChange, className = '' }: FilterChipsProps) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {options.map(opt => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500/25 ${
              active
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-white text-ink-600 border-sand-200 hover:border-sand-300 hover:bg-sand-50'
            }`}
          >
            {active && <X className="w-3 h-3" />}
            {opt.label}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs font-medium text-ink-400 hover:text-ink-700 hover:underline ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

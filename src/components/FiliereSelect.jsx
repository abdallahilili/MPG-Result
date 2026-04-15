import { GraduationCap, ChevronDown } from "lucide-react";

/**
 * FiliereSelect – menu déroulant pour sélectionner une filière
 */
export default function FiliereSelect({ filieres, value, onChange }) {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-4 flex items-center pointer-events-none text-muted">
        <GraduationCap size={18} strokeWidth={1.75} />
      </div>
      <select
        className="w-full h-12 pl-11 pr-10 bg-surface border border-border rounded-lg text-xs font-medium focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer shadow-soft text-[#1c1917]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sélectionner une filière"
      >
        {filieres.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <div className="absolute right-4 flex items-center pointer-events-none text-muted">
        <ChevronDown size={18} strokeWidth={1.75} />
      </div>
    </div>
  );
}

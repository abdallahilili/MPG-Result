import { useState } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar – champ de recherche unique (nom / téléphone / NNI)
 * Gère son propre état local et ne déclenche la recherche que sur validation.
 */
export default function SearchBar({ onSearch }) {
  const [localValue, setLocalValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    onSearch(val); // Instant search
  };

  const handleClear = () => {
    setLocalValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full group">
      <input
        type="text"
        className="w-full h-12 pl-4 pr-32 bg-surface border border-border rounded-lg text-xs font-medium focus:outline-none focus:border-primary transition-all placeholder:text-muted/60 shadow-soft"
        placeholder="Nom, téléphone ou NNI…"
        value={localValue}
        onChange={handleChange}
        aria-label="Nom, téléphone ou NNI…"
      />
      <div className="absolute right-1.5 flex items-center gap-1">
        {localValue && (
          <button
            type="button"
            className="p-1.5 hover:bg-bg rounded-full transition-colors text-muted"
            onClick={handleClear}
            aria-label="Effacer"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
        <button
          type="submit"
          className="bg-primary text-white h-9 px-3.5 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all shadow-sm flex items-center gap-2 active:scale-95"
        >
          <Search size={14} strokeWidth={2.5} />
          <span>Chercher</span>
        </button>
      </div>
    </form>
  );
}

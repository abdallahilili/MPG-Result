import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1c1917] hover:text-primary transition-colors bg-white/50 hover:bg-surface px-2 py-1 rounded-md border border-border/40 shadow-sm"
      aria-label="Changer la langue / تغيير اللغة"
    >
      <Globe size={12} strokeWidth={2.5} />
      <span className="mb-[1px]">{i18n.language === 'fr' ? 'العربية' : 'Français'}</span>
    </button>
  );
}

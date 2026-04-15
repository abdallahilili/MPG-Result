import { useTranslation } from "react-i18next";

/**
 * Footer - Bas de page simplifié
 */
export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-auto border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs text-muted font-medium tracking-wide italic flex items-center justify-center gap-1">
          &copy; {currentYear} {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}

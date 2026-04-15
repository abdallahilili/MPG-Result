import { useTranslation } from "react-i18next";

/**
 * Footer - Bas de page simplifié
 */
export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-auto border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <div className="text-xs text-muted/80">
          <p className="font-bold mb-1">Besoin d'aide ou d'information ?</p>
          <p>
            En cas de réclamation concernant votre résultat, veuillez contacter l'administration de l'EETFP MPG.
          </p>
          <p className="mt-1 font-medium select-all">
            ✉️ scolarite@eetfp-mpg.mr | 📞 +222 45 24 22 00
          </p>
        </div>

        <p className="text-[10px] text-muted/50 font-medium tracking-wide">
          &copy; {currentYear} {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

/**
 * Header - Affichage de l'entête de l'école
 * Français à gauche, Arabe à droite, Logo au milieu.
 * Optimisé pour afficher le français au complet sans troncature.
 */
export default function Header() {
  const textBlack = "text-[#1c1917]";

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Français (Gauche) - Un peu plus d'espace pour le texte long */}
        <div className="flex-[3] sm:flex-[4] min-w-0">
          <div className={`text-[6.5px] sm:text-[9px] md:text-[11px] font-bold ${textBlack} leading-[1.2] uppercase`}>
            <p className="opacity-70 font-medium hidden md:block mb-1">République Islamique de Mauritanie</p>
            
            <div className="space-y-0.5">
              <p className="whitespace-normal sm:whitespace-nowrap">Ministère de la formation professionnelle,</p>
              <p className="whitespace-normal sm:whitespace-nowrap font-black">de l'Artisannat et des Métiers</p>
            </div>
            
            <div className="mt-1 pt-1 border-t border-border/50">
              <p className="font-extrabold leading-tight">Ecole d'Enseignement Technique Et De Formation Professionnelle</p>
              <p className="font-bold opacity-90">Dans Le Domaine Des Mines, Pétrole Et Gaz</p>
            </div>
          </div>
        </div>

        {/* Logo (Décalé légèrement vers la droite) */}
        <Link to="/" className="flex flex-col items-center shrink-0 group mx-2 sm:mx-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-primary p-1 bg-white shadow-soft flex items-center justify-center overflow-hidden transition-all group-hover:shadow-card">
            <img 
              src="/logo-mpg.png" 
              alt="Logo MPG" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=MPG&background=c6613f&color=fff&size=100";
              }}
            />
          </div>
        </Link>

        {/* Arabe (Droite) - Un peu plus compact */}
        <div className="flex-[2] sm:flex-[3] min-w-0 text-right" dir="rtl">
          <div className={`text-[9px] sm:text-[11px] md:text-[14px] font-bold ${textBlack} leading-[1.2] font-serif`}>
            <p className="opacity-70 font-sans hidden md:block mb-1 text-[8px] sm:text-[10px]">الجمهورية الإسلامية الموريتانية</p>
            
            <div className="space-y-0.5">
              <p className="whitespace-normal sm:whitespace-nowrap font-black">وزارة التكوين المهني والصناعة التقليدية والحرف</p>
            </div>
            
            <div className="mt-1 pt-1 border-t border-border/50">
              <p className="whitespace-normal sm:whitespace-nowrap font-sans text-[8px] sm:text-[10px] md:text-[12px]">مدرسة التعليم التقني والتكوين المهني في مجال</p>
              <p className="whitespace-normal sm:whitespace-nowrap font-bold opacity-90">المعادن والنفط والغاز</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

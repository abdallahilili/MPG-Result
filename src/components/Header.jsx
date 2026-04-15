import { Link } from "react-router-dom";

/**
 * Header - Design Fidèle aux Documents Officiels
 * Utilise les textes exacts et la disposition institutionnelle.
 */
export default function Header() {
  const textBlack = "text-[#1c1917]";

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col items-center gap-4">
        
        {/* Section Entête : Disposition 3 colonnes symétrique */}
        <div className="w-full flex items-center justify-between gap-2 sm:gap-6 md:gap-12">
          
          {/* Bloc Français (Gauche) */}
          <div className="flex-1 min-w-0">
            <div className={`text-[5px] sm:text-[6.5px] md:text-[10px] font-bold ${textBlack} leading-[1.3] uppercase`}>
              <div className="flex flex-col">
                <div className="mt-0">
                  <p className="whitespace-normal underline decoration-border/20 underline-offset-4">Ministère de la formation professionnelle, de l'Artisanat et des Métiers</p>
                </div>
              </div>
              
              <div className="mt-2 pt-1.5 border-t border-border/80">
                <p className="font-black leading-tight">Ecole d'Enseignement Technique</p>
                <p className="font-extrabold leading-tight">Et De Formation Professionnelle Dans</p>
                <p className="font-bold leading-tight">Le Domaines Des, Mines, Pétrole Et Du Gaz</p>
              </div>
            </div>
          </div>

          {/* Logo Central */}
          <div className="shrink-0 scale-90 sm:scale-100">
            <Link to="/" className="block group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full border border-border/50 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/logo-mpg.png" 
                  alt="Logo MPG" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://ui-avatars.com/api/?name=MPG&background=c6613f&color=fff&size=200";
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Bloc Arabe (Droite) */}
          <div className="flex-1 min-w-0 text-right" dir="rtl">
            <div className={`text-[8px] sm:text-[11px] md:text-[13px] font-bold ${textBlack} leading-[1.3]`}>
              <div className="mt-0">
                <p className="whitespace-normal font-black underline decoration-border/20 underline-offset-4">وزارة التكوين المهني والصناعة التقليدية والحرف</p>
              </div>
              
              <div className="mt-2 pt-1.5 border-t border-border/80">
                <p className="font-black leading-tight">مدرسة التعليم التقني والتكوين المهني</p>
                <p className="font-bold leading-tight">في مجال المعادن والنفط والغاز</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

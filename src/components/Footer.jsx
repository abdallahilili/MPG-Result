/**
 * Footer - Bas de page simplifié
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-auto border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">

        <p className="text-[10px] text-muted/100 font-medium tracking-wide">
          &copy; {currentYear} Copyright <span className="text-bold">Rawafid services</span>
        </p>
      </div>
    </footer>
  );
}

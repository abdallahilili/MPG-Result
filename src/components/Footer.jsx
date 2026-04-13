/**
 * Footer - Bas de page simplifié
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-auto border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs text-muted font-medium tracking-wide italic">
          &copy; {currentYear} Copyright Rawafid services
        </p>
      </div>
    </footer>
  );
}

import { Phone, MessageCircle } from "lucide-react";

/**
 * Footer - Bas de page simplifié avec contacts
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-auto border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2 text-center">
        
        <p className="text-[10px] text-muted/40 font-bold tracking-tight">
          &copy; {currentYear} Rawafid services
        </p>

        {/* Contacts - Ultra Minimal below copyright */}
        <div className="flex justify-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
          <a 
            href="https://wa.me/22246635996" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 group"
          >
            <MessageCircle size={10} className="text-[#25D366]" />
            <span className="text-[8px] font-medium">+222 46635996</span>
          </a>

          <a 
            href="tel:+22231177008" 
            className="flex items-center gap-1 group"
          >
            <Phone size={10} className="text-primary" />
            <span className="text-[8px] font-medium">+222 31177008</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

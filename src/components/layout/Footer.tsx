import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="border-t border-border/60 bg-background/70 supports-[backdrop-filter]:backdrop-blur"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Sol: Marka / Telif */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MailSender. Tüm hakları saklıdır.
          </div>

          {/* Orta: Menü Linkleri */}
          <nav className="flex gap-4 text-sm">
            <Link to="/about" className="hover:text-foreground">
              Hakkımızda
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Gizlilik
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Kullanım Şartları
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              İletişim
            </Link>
          </nav>

          {/* Sağ: Sosyal ikonlar (lucide-react kullanabilirsin) */}
          <div className="flex gap-3">
            <a
              href="https://github.com/izzettinkarasayar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground"
            >
              
            </a>
            <a
              href="https://linkedin.com/in/izzettinkarasayar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground"
            >
              
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

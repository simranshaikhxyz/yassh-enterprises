import { Link } from "react-router-dom";

function Footer() {
  const linkStyle =
    "text-xs font-medium text-slate-400 hover:text-white transition-colors duration-200";

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 sm:py-10 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">

        {/* Brand */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-white font-extrabold tracking-tight text-sm">
              YASSH
            </span>

            <span className="text-[9px] sm:text-[10px] tracking-[3px] text-slate-500 font-bold uppercase">
              ENTERPRISES
            </span>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5">
            © {new Date().getFullYear()} YASSH ENTERPRISES. All Rights Reserved.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-2">
          <Link to="/products" className={linkStyle}>
            Products
          </Link>

          <Link to="/contact" className={linkStyle}>
            Contact
          </Link>

          <a href="#privacy" className={linkStyle}>
            Privacy Policy
          </a>

          <a href="#terms" className={linkStyle}>
            Terms of Service
          </a>
        </nav>

      </div>
    </footer>
  );
}

export default Footer;
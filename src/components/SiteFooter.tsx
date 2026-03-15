import type { AppView } from '../types';

interface SiteFooterProps {
  onNavigate: (view: AppView) => void;
}

export default function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="bg-ink border-t border-white/10 text-white/60 text-sm">
      <div className="max-w-[1400px] mx-auto px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2"
          >
            <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-8 w-auto brightness-0 invert" />
            <span className="font-display text-white text-base leading-none">Koda</span>
          </button>
          <p className="text-xs text-white/40 max-w-xs text-center md:text-left">
            AI Readiness Platform — helping organisations understand and accelerate their AI maturity.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2">
          <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors duration-150">Platform</button>
          <button onClick={() => onNavigate('assessment')} className="hover:text-white transition-colors duration-150">Assessment</button>
          <button onClick={() => onNavigate('security')} className="hover:text-white transition-colors duration-150">Security &amp; Trust</button>
          <button onClick={() => onNavigate('retrieve')} className="hover:text-white transition-colors duration-150">Retrieve Report</button>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Koda. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

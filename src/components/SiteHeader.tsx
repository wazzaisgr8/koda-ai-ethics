import type { AppView } from '../types';

interface SiteHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  hasAssessment?: boolean;
}

export default function SiteHeader({ currentView, onNavigate, hasAssessment = false }: SiteHeaderProps) {
  const navItems: { label: string; view: AppView }[] = [
    { label: 'Platform', view: 'landing' },
    { label: 'Assessment', view: 'assessment' },
    ...(hasAssessment
      ? [
          { label: 'Results', view: 'results' as AppView },
          { label: 'Roadmap', view: 'roadmap' as AppView },
        ]
      : []),
    { label: 'Security & Trust', view: 'security' },
    { label: 'Retrieve Report', view: 'retrieve' },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="px-8 py-3.5 flex items-center justify-between max-w-[1400px] mx-auto">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-8 w-auto" />
          <span className="font-display text-ink text-lg leading-none">Koda</span>
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map(({ label, view }) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => onNavigate(view)}
                className={[
                  'text-[11px] tracking-wider uppercase px-3 py-2 rounded transition-colors duration-150',
                  isActive
                    ? 'text-gold-deep font-medium bg-gold-bg'
                    : 'text-body-text hover:text-gold-deep hover:bg-gold-bg/50',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}

          <div className="w-px h-4 bg-border mx-2" />

          <button
            onClick={() => onNavigate('assessment')}
            className="bg-gold text-ink text-[11px] font-medium tracking-wide px-5 py-2 rounded hover:bg-gold-light transition-colors duration-150"
          >
            Start Assessment
          </button>
        </nav>
      </div>
    </header>
  );
}

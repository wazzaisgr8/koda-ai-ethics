import { Shield, Lock, Eye, Trash2, FileCheck, Server, AlertCircle, CheckCircle, ArrowLeft, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppView } from '../types';

interface SecurityProps {
  onNavigate: (view: AppView) => void;
}

const STANDARDS = [
  {
    name: 'NIST AI RMF',
    fullName: 'NIST AI Risk Management Framework',
    desc: "Koda's platform design aligns to the four core functions — Govern, Map, Measure, Manage — ensuring AI risks are identified, assessed, and continuously monitored throughout your organisation's AI lifecycle.",
    badge: 'Aligned',
  },
  {
    name: 'ISO 42001',
    fullName: 'ISO/IEC 42001 AI Management System',
    desc: 'Our assessment framework and governance tooling are structured to support ISO 42001 compliance, covering AI policy, risk assessment, incident management, and continuous improvement.',
    badge: 'Aligned',
  },
  {
    name: 'SOC 2 Type II',
    fullName: 'Service Organisation Control 2',
    desc: 'Koda is designed with SOC 2 Type II principles at its core — covering security, availability, processing integrity, confidentiality, and privacy controls across all platform operations.',
    badge: 'By Design',
  },
  {
    name: 'UK GDPR',
    fullName: 'UK General Data Protection Regulation',
    desc: 'No personal data is required to use the platform. All assessment inputs are organisational in nature. We do not collect, store, or process personal data in any form that triggers GDPR obligations.',
    badge: 'Compliant',
  },
  {
    name: 'EU AI Act',
    fullName: 'European Union AI Act',
    desc: "Koda actively monitors EU AI Act developments and embeds relevant obligations — including transparency, human oversight, and risk classification — into its assessment methodology and Nia's guidance.",
    badge: 'Monitored',
  },
];

const DATA_COMMITMENTS = [
  {
    icon: Trash2,
    title: 'Active Data Purging',
    desc: 'Assessment data is automatically purged after session completion. No residual data is retained beyond what is strictly necessary for your current session. You can request immediate deletion at any time.',
  },
  {
    icon: Eye,
    title: 'Zero Training Use',
    desc: "Your data is never used to train AI models — ours or any third party's. Assessment responses, strategy reports, and Nia conversations are completely isolated from any model training pipeline.",
  },
  {
    icon: Lock,
    title: 'No Persistent Storage of Sensitive Inputs',
    desc: 'We do not store your raw assessment responses on persistent infrastructure. Session data exists only for the duration of your active engagement and is cryptographically isolated per session.',
  },
  {
    icon: Server,
    title: 'Secure Data Handling',
    desc: 'All data in transit is encrypted using TLS 1.3. Data at rest uses AES-256 encryption. Access to any stored data requires authenticated, role-based authorisation with full audit logging.',
  },
  {
    icon: Activity,
    title: 'Every Transaction Logged',
    desc: 'Every interaction with the Koda platform — assessments, report generation, Nia conversations, roadmap updates — is logged with a tamper-resistant audit trail. Full transparency, always.',
  },
  {
    icon: AlertCircle,
    title: 'Breach Response Protocol',
    desc: 'Koda maintains a documented incident response procedure aligned to ISO 27035. In the unlikely event of a security incident, affected parties are notified within 72 hours in line with regulatory requirements.',
  },
];

const TRUST_PRINCIPLES = [
  'We do not sell or share your data with third parties',
  'We do not use customer inputs to improve or train models',
  'We do not retain assessment data after your session ends',
  'We do not require account creation or personal information',
  'We do not track users across sessions or platforms',
  'We do not use third-party analytics that can identify individuals',
];

const NAV_SECTIONS = [
  { id: 'commitments', label: 'Our Commitments' },
  { id: 'data-practices', label: 'Data Practices' },
  { id: 'standards', label: 'Standards Alignment' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function FloatingNav({ activeSection }: { activeSection: string }) {
  return (
    <>
      <div className="sticky top-0 z-40 xl:hidden bg-white border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          <span className="text-[9px] tracking-widest uppercase text-muted mr-2 flex-shrink-0">
            On this page
          </span>
          {NAV_SECTIONS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                  isActive
                    ? 'text-gold-deep bg-gold-bg border-gold-light font-medium'
                    : 'text-body-text border-border hover:text-ink hover:bg-parchment'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-1">
        <div className="bg-white border border-border rounded-lg shadow-sm p-3 flex flex-col gap-1 min-w-[180px]">
          <div className="text-[9px] tracking-widest uppercase text-muted px-2 pb-2 border-b border-border mb-1">
            On this page
          </div>
          {NAV_SECTIONS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-left text-xs px-2 py-1.5 rounded transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'text-gold-deep bg-gold-bg font-medium'
                    : 'text-body-text hover:text-ink hover:bg-parchment'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${
                    isActive ? 'bg-gold' : 'bg-border'
                  }`}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function Security({ onNavigate }: SecurityProps) {
  const [activeSection, setActiveSection] = useState('commitments');

  useEffect(() => {
    const sectionIds = NAV_SECTIONS.map((s) => s.id);

    function onScroll() {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-parchment">
      <FloatingNav activeSection={activeSection} />

      <nav className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-8 w-auto" />
          <span className="font-display text-ink text-xl">Koda</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-body-text tracking-wider uppercase hover:text-gold-deep transition-colors"
          >
            Platform
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            className="bg-gold text-ink text-xs font-medium tracking-wide px-5 py-2.5 rounded hover:bg-gold-light transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </nav>

      <section className="bg-white border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/6 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-gold/4 blur-2xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-16 py-20">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-xs text-muted hover:text-gold-deep transition-colors mb-8"
          >
            <ArrowLeft size={13} /> Back to Platform
          </button>
          <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-4">
            Security & Trust
          </div>
          <h1 className="font-display text-5xl text-ink font-normal leading-tight mb-6 max-w-3xl">
            Built on a foundation of <em className="text-gold not-italic">trust.</em>
          </h1>
          <p className="text-base text-body-text max-w-xl leading-relaxed">
            Koda is designed from the ground up with data privacy, security, and regulatory alignment as non-negotiable principles — not afterthoughts. Here is exactly how we protect your organisation's information.
          </p>
        </div>
      </section>

      <section id="commitments" className="max-w-5xl mx-auto px-16 py-20 scroll-mt-8">
        <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-3">Our Commitments</div>
        <h2 className="font-display text-3xl text-ink mb-3">What we will never do with your data</h2>
        <p className="text-sm text-body-text mb-10 max-w-lg">These are absolute commitments — not subject to change based on commercial considerations.</p>

        <div className="bg-white border border-border rounded overflow-hidden">
          {TRUST_PRINCIPLES.map((principle, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-6 py-4 ${i < TRUST_PRINCIPLES.length - 1 ? 'border-b border-border' : ''}`}
            >
              <CheckCircle size={16} className="text-success flex-shrink-0" />
              <span className="text-sm text-ink">{principle}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="data-practices" className="bg-white border-y border-border py-20 scroll-mt-8">
        <div className="max-w-5xl mx-auto px-16">
          <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-3">Data Practices</div>
          <h2 className="font-display text-3xl text-ink mb-3">How we handle your data</h2>
          <p className="text-sm text-body-text mb-12 max-w-lg">Security is embedded in every interaction — from the moment you begin an assessment to the moment your session ends.</p>

          <div className="grid grid-cols-2 gap-6">
            {DATA_COMMITMENTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border rounded p-6 bg-parchment hover:border-gold/40 transition-colors group">
                <div className="w-10 h-10 bg-gold-bg border border-gold-light rounded flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                  <Icon size={17} className="text-gold-deep" />
                </div>
                <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
                <p className="text-sm text-body-text leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="standards" className="max-w-5xl mx-auto px-16 py-20 scroll-mt-8">
        <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-3">Standards Alignment</div>
        <h2 className="font-display text-3xl text-ink mb-3">Industry frameworks we align to</h2>
        <p className="text-sm text-body-text mb-12 max-w-lg">Koda's design, methodology, and operational practices are informed by globally recognised standards for AI governance and information security.</p>

        <div className="space-y-4">
          {STANDARDS.map(({ name, fullName, desc, badge }) => (
            <div key={name} className="bg-white border border-border rounded p-6 flex gap-6 hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0 w-28">
                <div className="font-display text-base text-ink mb-1">{name}</div>
                <span className={`inline-block text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-medium ${
                  badge === 'Compliant' ? 'bg-success/10 text-success border border-success/20' :
                  badge === 'Aligned' ? 'bg-gold-bg text-gold-deep border border-gold-light' :
                  badge === 'By Design' ? 'bg-gold-bg text-gold-deep border border-gold-light' :
                  'bg-border-mid text-muted border border-border'
                }`}>
                  {badge}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted mb-2">{fullName}</div>
                <p className="text-sm text-body-text leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-16 pb-20">
        <div className="bg-white border border-border rounded p-10 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: Lock, stat: 'TLS 1.3', label: 'Encryption in Transit' },
            { icon: Server, stat: 'AES-256', label: 'Encryption at Rest' },
            { icon: FileCheck, stat: '100%', label: 'Transactions Audit Logged' },
          ].map(({ icon: Icon, stat, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gold-bg border border-gold-light rounded-full flex items-center justify-center mb-3">
                <Icon size={18} className="text-gold-deep" />
              </div>
              <div className="font-display text-3xl text-gold mb-1">{stat}</div>
              <div className="text-xs text-muted tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-16 pb-20">
        <div className="bg-gold-bg border border-gold-light rounded overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-gold/10 to-transparent pointer-events-none" />
          <div className="relative p-12">
            <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-4">Ready to Begin</div>
            <h2 className="font-display text-4xl text-ink mb-4 max-w-lg">Assess your AI readiness with complete confidence.</h2>
            <p className="text-sm text-body-text mb-8 max-w-md">No account. No personal data. No persistent storage. Just honest, expert insight into your organisation's AI position.</p>
            <button
              onClick={() => onNavigate('assessment')}
              className="bg-gold text-ink font-medium text-sm tracking-wide px-7 py-3.5 rounded flex items-center gap-2 hover:bg-gold-light transition-colors"
            >
              Begin Your Assessment
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border px-16 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-6 w-auto" />
          <span className="font-display text-ink text-base">Koda</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield size={12} className="text-muted" />
          <span className="text-xs text-muted">AI Strategy & Ethics Platform</span>
        </div>
      </footer>
    </div>
  );
}

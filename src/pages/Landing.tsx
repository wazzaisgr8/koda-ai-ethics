import { Shield, BarChart2, FileText, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import type { AppView } from '../types';

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-parchment">
      <nav className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-8 w-auto" />
          <span className="font-display text-ink text-xl">Koda</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-xs text-body-text tracking-wider uppercase hover:text-gold-deep transition-colors">Platform</a>
          <a href="#pillars" className="text-xs text-body-text tracking-wider uppercase hover:text-gold-deep transition-colors">Framework</a>
          <button
            onClick={() => onNavigate('security')}
            className="text-xs text-body-text tracking-wider uppercase hover:text-gold-deep transition-colors"
          >
            Security &amp; Trust
          </button>
          <button
            onClick={() => onNavigate('retrieve')}
            className="text-xs text-body-text tracking-wider uppercase hover:text-gold-deep transition-colors"
          >
            Retrieve Report
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            className="bg-gold text-ink text-xs font-medium tracking-wide px-5 py-2.5 rounded hover:bg-gold-light transition-colors duration-120"
          >
            Start Assessment
          </button>
        </div>
      </nav>

      <section className="bg-white border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-2xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-16 py-24">
          <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-6">
            AI Strategy & Ethics Platform
          </div>
          <h1 className="font-display text-5xl text-ink font-normal leading-tight mb-6 max-w-3xl">
            Build a responsible <em className="text-gold not-italic">AI strategy.</em><br />
            Govern it with confidence.
          </h1>
          <p className="text-base text-body-text max-w-xl leading-relaxed mb-10">
            Koda empowers organisations to assess their AI readiness across five pillars, generate a bespoke strategy roadmap, and access a virtual AI Ethics Officer for ongoing governance guidance.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('assessment')}
              className="bg-gold text-ink font-medium text-sm tracking-wide px-7 py-3.5 rounded flex items-center gap-2 hover:bg-gold-light transition-colors duration-150"
            >
              Begin Your Assessment <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('retrieve')}
              className="text-sm text-body-text hover:text-gold-deep transition-colors underline underline-offset-2"
            >
              Retrieve an existing report
            </button>
          </div>
          <p className="text-xs text-muted mt-2">Takes 8–12 minutes · No account required</p>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-12">
            {[
              { value: '5', label: 'Assessment Pillars' },
              { value: '20', label: 'Diagnostic Questions' },
              { value: '4', label: 'Readiness Tiers' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-display text-3xl text-gold mb-1">{stat.value}</div>
                <div className="text-xs text-muted tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="max-w-5xl mx-auto px-16 py-20">
        <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-3">Platform Capabilities</div>
        <h2 className="font-display text-3xl text-ink mb-12">Everything your organisation needs</h2>

        <div className="grid grid-cols-2 gap-6">
          {[
            {
              icon: BarChart2,
              title: 'AI Readiness Assessment',
              desc: 'A structured diagnostic across Technology, Data, People & Culture, Process, and Ethics & Governance. Produces a maturity score and tier classification.',
            },
            {
              icon: FileText,
              title: 'Bespoke Strategy Report',
              desc: 'An executive-grade readiness report with pillar scores, radar visualisation, and a narrative summary of your organisation\'s AI position.',
            },
            {
              icon: CheckCircle,
              title: 'Prioritised Roadmap',
              desc: 'A targeted action plan with prioritised initiatives, effort estimates, and timelines — tailored to your gaps and generated automatically from your results.',
            },
            {
              icon: MessageSquare,
              title: 'Meet Nia — Your AI Ethics Officer',
              desc: 'A 24/7 AI governance advisor. Ask Nia about bias, fairness, regulation, incident response, or any ethics challenge — and receive considered, expert guidance.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-border rounded p-6 hover:shadow-sm transition-shadow duration-150">
              <div className="w-9 h-9 bg-gold-bg border border-gold-light rounded flex items-center justify-center mb-4">
                <Icon size={16} className="text-gold-deep" />
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
              <p className="text-sm text-body-text leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pillars" className="bg-white border-y border-border py-20">
        <div className="max-w-5xl mx-auto px-16">
          <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-3">Assessment Framework</div>
          <h2 className="font-display text-3xl text-ink mb-4">Five pillars of AI readiness</h2>
          <p className="text-sm text-body-text mb-12 max-w-lg">Koda evaluates your organisation across the five dimensions that determine sustainable, responsible AI adoption.</p>

          <div className="grid grid-cols-5 gap-4">
            {[
              { num: '01', name: 'Technology', desc: 'Infrastructure, tools, and technical capability to run AI at scale.' },
              { num: '02', name: 'Data', desc: 'Quality, governance, and accessibility of the data that powers your AI.' },
              { num: '03', name: 'People & Culture', desc: 'Skills, leadership, and organisational culture for AI success.' },
              { num: '04', name: 'Process', desc: 'Workflows, accountability, and lifecycle management for AI systems.' },
              { num: '05', name: 'Ethics & Governance', desc: 'Policies, oversight, and safeguards for responsible AI use.' },
            ].map(p => (
              <div key={p.name} className="border border-border rounded p-5 bg-parchment hover:border-gold/40 transition-colors">
                <div className="text-[10px] text-gold-deep tracking-widest mb-3">{p.num}</div>
                <div className="font-display text-base text-ink mb-2">{p.name}</div>
                <p className="text-xs text-body-text leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-16 py-20">
        <div className="bg-gold-bg border border-gold-light rounded overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-gold/10 to-transparent pointer-events-none" />
          <div className="relative p-12">
            <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-4">Get Started Today</div>
            <h2 className="font-display text-4xl text-ink mb-4 max-w-lg">Your AI strategy begins with an honest assessment.</h2>
            <p className="text-sm text-body-text mb-8 max-w-md">Complete the 20-question diagnostic in under 15 minutes and receive your full strategy report, roadmap, and access to the Ethics Officer.</p>
            <button
              onClick={() => onNavigate('assessment')}
              className="bg-gold text-ink font-medium text-sm tracking-wide px-7 py-3.5 rounded flex items-center gap-2 hover:bg-gold-light transition-colors"
            >
              Begin Your Assessment <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border px-16 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-6 w-auto" />
          <span className="font-display text-ink text-base">Koda</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('security')}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-gold-deep transition-colors"
          >
            <Shield size={12} /> Security &amp; Trust
          </button>
          <span className="text-xs text-muted">AI Strategy &amp; Ethics Platform</span>
        </div>
      </footer>
    </div>
  );
}

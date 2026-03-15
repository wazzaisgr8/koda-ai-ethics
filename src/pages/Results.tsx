import { useEffect, useState } from 'react';
import { ArrowRight, Download, TrendingUp, Target, CheckCircle2, Copy, Check } from 'lucide-react';
import PhaseBar from '../components/PhaseBar';
import RadarChart from '../components/RadarChart';
import PillarBar from '../components/PillarBar';
import { getTier, PILLARS, getPillarColor } from '../data/questions';
import { supabase } from '../lib/supabase';
import type { AppView, Organisation, Assessment, RoadmapItem } from '../types';

interface ResultsProps {
  org: Organisation;
  assessment: Assessment;
  onNavigate: (view: AppView) => void;
}

const PILLAR_CURRENT_STATE: Record<string, Record<string, string>> = {
  Technology: {
    Foundational: 'AI tooling is absent or ad hoc. Infrastructure has not been assessed for AI readiness and no data pipelines exist for AI workloads.',
    Developing: 'Some AI tools are deployed but inconsistently. Infrastructure gaps exist and pipelines are not yet automated or reliably monitored.',
    Scaling: 'AI tools are deployed in production. Infrastructure broadly supports AI workloads, though scalability and pipeline reliability need strengthening.',
    Leading: 'A mature, AI-native technology stack with automated pipelines, scalable cloud infrastructure, and standardised ML tooling embedded in engineering workflows.',
  },
  Data: {
    Foundational: 'Data assets are undocumented and inconsistently structured. No formal governance exists and data quality is insufficient for AI use.',
    Developing: 'Some data is accessible for analysis but quality and governance are patchy. A data catalogue is absent or incomplete.',
    Scaling: 'A data governance framework is in place but not fully operationalised. Quality is improving and AI-ready datasets exist in some domains.',
    Leading: 'A governed, high-quality data estate with documented lineage, active quality monitoring, and AI-ready datasets across all key business domains.',
  },
  'People & Culture': {
    Foundational: 'AI literacy is very low. No dedicated AI skills exist and leadership has not formally committed to AI adoption. Cultural resistance is likely.',
    Developing: 'Early AI champions exist and some upskilling has begun. Leadership interest is growing but AI culture is not yet widespread.',
    Scaling: 'A growing AI capability exists. Leadership is engaged and upskilling programmes are underway, though coverage across the organisation is uneven.',
    Leading: 'AI literacy is embedded at every level. A dedicated AI team exists alongside broad upskilling programmes, and leadership actively sponsors responsible AI innovation.',
  },
  Process: {
    Foundational: 'No formal processes exist for AI deployment or monitoring. Accountability for AI outputs is unclear and there are no feedback mechanisms in place.',
    Developing: 'Some project management practices apply to AI work but deployment and monitoring processes are informal and inconsistently applied.',
    Scaling: 'AI deployment processes are documented and mostly followed. Ownership is clearer but monitoring and feedback loops need formalising.',
    Leading: 'All AI systems have named owners, follow structured deployment checklists, and are monitored against defined KPIs with clear escalation paths.',
  },
  'Ethics & Governance': {
    Foundational: 'No ethics policy or governance structure exists. Bias has not been assessed and there is no incident response process for AI failures.',
    Developing: 'Ethics awareness is growing but policy is nascent or informal. Human oversight is inconsistent and bias testing has not been formalised.',
    Scaling: 'An ethics policy exists and human review applies to high-stakes decisions. Bias testing is underway but governance structures need deepening.',
    Leading: 'A mature AI governance framework is in place — published ethics policy, independent bias audits, human oversight for consequential decisions, and a functioning governance committee.',
  },
};

const PILLAR_FUTURE_STATE: Record<string, string> = {
  Technology: 'AI tools are standardised, automated pipelines operate reliably, and infrastructure scales to meet AI workload demands with full observability.',
  Data: 'A fully governed data estate with documented lineage, active quality monitoring, and consistently AI-ready datasets across all key business domains.',
  'People & Culture': 'AI literacy is embedded at every level. A dedicated AI capability exists, upskilling is continuous, and leadership visibly champions responsible innovation.',
  Process: 'Every AI system has a named owner, follows a structured deployment and review lifecycle, and is monitored against defined KPIs with clear escalation paths.',
  'Ethics & Governance': 'A published ethics policy, regular independent audits, mandatory human oversight for high-stakes decisions, and a cross-functional governance committee operating proactively.',
};

function getTargetScore(score: number): number {
  if (score >= 4.0) return 5.0;
  if (score >= 3.0) return 4.5;
  if (score >= 2.0) return 3.5;
  return 2.5;
}

function getNextTier(tier: string): string {
  if (tier === 'Leading') return 'Leading (Sustained)';
  if (tier === 'Scaling') return 'Leading';
  if (tier === 'Developing') return 'Scaling';
  return 'Developing';
}

function getCurrentStateLabel(score: number): string {
  if (score >= 4) return 'Leading';
  if (score >= 3) return 'Scaling';
  if (score >= 2) return 'Developing';
  return 'Foundational';
}

function getPillarCurrentDesc(pillar: string, score: number): string {
  const label = getCurrentStateLabel(score);
  return PILLAR_CURRENT_STATE[pillar]?.[label] ?? '';
}

export default function Results({ org, assessment, onNavigate }: ResultsProps) {
  const { pillar_scores, overall_score } = assessment;
  const tierInfo = getTier(overall_score);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [copied, setCopied] = useState(false);

  function copyAssessmentId() {
    navigator.clipboard.writeText(assessment.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    supabase
      .from('roadmap_items')
      .select('*')
      .eq('assessment_id', assessment.id)
      .eq('priority', 'high')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setRoadmapItems(data as RoadmapItem[]);
      });
  }, [assessment.id]);

  const sortedPillars = PILLARS.map(p => ({
    pillar: p,
    score: pillar_scores[p] ?? 0,
  })).sort((a, b) => a.score - b.score);

  const strongest = [...sortedPillars].sort((a, b) => b.score - a.score)[0];
  const weakest = sortedPillars[0];
  const nextTier = getNextTier(tierInfo.tier);

  const assessedDate = new Date(assessment.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const targetScores = Object.fromEntries(
    Object.entries(pillar_scores).map(([p, s]) => [p, getTargetScore(s)])
  );
  const avgTargetScore = Object.values(targetScores).length
    ? (Object.values(targetScores).reduce((a, b) => a + b, 0) / Object.values(targetScores).length).toFixed(1)
    : '—';

  const roadmapSummary = roadmapItems.slice(0, 6);

  return (
    <div className="min-h-screen bg-parchment">
      <PhaseBar
        currentView="results"
        onNavigate={onNavigate}
        completedViews={['assessment']}
      />

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-2">AI Readiness Strategy Report</div>
            <h1 className="font-display text-4xl text-ink mb-1">{org.name}</h1>
            <div className="text-xs text-muted">{org.industry} · {org.size} · Assessed {assessedDate}</div>
          </div>
          <button className="flex items-center gap-2 text-xs text-body-text border border-border rounded px-4 py-2 hover:border-gold/40 transition-colors">
            <Download size={13} /> Export Report
          </button>
        </div>

        <div className="bg-white border border-border rounded px-5 py-3.5 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] tracking-widest uppercase text-muted flex-shrink-0">Assessment ID</span>
            <span className="font-mono text-xs text-ink truncate">{assessment.id}</span>
          </div>
          <button
            onClick={copyAssessmentId}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-gold-deep transition-colors flex-shrink-0"
          >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy ID'}
          </button>
        </div>

        <div
          className="bg-white border-l-4 rounded-r p-6 mb-6 flex items-center gap-8"
          style={{ borderLeftColor: tierInfo.color }}
        >
          <div className="flex-shrink-0">
            <div className="text-[10px] tracking-widest uppercase text-muted mb-1">AI Readiness Tier</div>
            <div className="font-display text-3xl mb-2" style={{ color: tierInfo.color }}>
              {tierInfo.tier}
            </div>
            <div className="inline-flex items-center bg-gold-bg border border-gold-light text-gold-deep text-xs font-medium px-2.5 py-1 rounded">
              Score {overall_score.toFixed(1)} / 5.0
            </div>
          </div>
          <div className="w-px h-12 bg-border flex-shrink-0" />
          <p className="text-sm text-body-text leading-relaxed max-w-xl">{tierInfo.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-border rounded p-6">
            <div className="text-[10px] tracking-widest uppercase text-muted mb-4">Maturity Radar — Current State</div>
            <div className="flex justify-center">
              <RadarChart scores={pillar_scores} size={280} />
            </div>
          </div>

          <div className="bg-white border border-border rounded p-6">
            <div className="text-[10px] tracking-widest uppercase text-muted mb-5">Pillar Scores</div>
            <div className="space-y-4">
              {PILLARS.map((p, i) => (
                <PillarBar key={p} pillar={p} score={pillar_scores[p] ?? 0} delay={i * 100} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border-mid flex items-center justify-between">
              <span className="text-xs text-muted">Overall Score</span>
              <span className="font-display text-xl" style={{ color: tierInfo.color }}>
                {overall_score.toFixed(2)} / 5.0
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-border rounded p-5">
            <div className="text-[10px] tracking-widest uppercase text-muted mb-2">Strongest Pillar</div>
            <div className="font-display text-xl text-gold mb-1">{strongest.pillar}</div>
            <div className="text-xs text-muted">{strongest.score.toFixed(1)} / 5.0</div>
          </div>
          <div className="bg-white border border-border rounded p-5">
            <div className="text-[10px] tracking-widest uppercase text-muted mb-2">Greatest Opportunity</div>
            <div className="font-display text-xl text-danger mb-1">{weakest.pillar}</div>
            <div className="text-xs text-muted">{weakest.score.toFixed(1)} / 5.0 — critical gap</div>
          </div>
          <div className="bg-white border border-border rounded p-5">
            <div className="text-[10px] tracking-widest uppercase text-muted mb-2">Average Maturity</div>
            <div className="font-display text-xl mb-1" style={{ color: tierInfo.color }}>
              {overall_score.toFixed(1)} / 5
            </div>
            <div className="text-xs text-muted">{tierInfo.tier} tier</div>
          </div>
        </div>

        <div className="bg-white border border-border rounded mb-8">
          <div className="px-6 py-4 border-b border-border-mid">
            <div className="text-[10px] tracking-widest uppercase text-muted">Current State — Pillar Analysis</div>
          </div>
          <div className="divide-y divide-border-mid">
            {sortedPillars.map((item) => {
              const color = getPillarColor(item.score);
              const stateLabel = getCurrentStateLabel(item.score);
              return (
                <div key={item.pillar} className="px-6 py-5 flex gap-6">
                  <div className="w-44 flex-shrink-0">
                    <div className="text-xs font-medium text-ink mb-1.5">{item.pillar}</div>
                    <div
                      className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {stateLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 w-14">
                    <span className="font-display text-lg" style={{ color }}>
                      {item.score.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted">/ 5</span>
                  </div>
                  <p className="text-xs text-body-text leading-relaxed flex-1">
                    {getPillarCurrentDesc(item.pillar, item.score)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-border rounded mb-8">
          <div className="px-6 py-4 border-b border-border-mid flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-gold" />
              <div className="text-[10px] tracking-widest uppercase text-muted">Future State — Target: {nextTier}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <Target size={12} className="text-muted" />
              <span className="text-xs text-muted">Target overall score: {avgTargetScore} / 5.0</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-parchment border-b border-border-mid">
            <p className="text-sm text-body-text leading-relaxed">
              Reaching <strong className="text-ink">{nextTier}</strong> requires closing the gaps identified across your five pillars.
              The targets below represent the maturity level your organisation should aim to achieve through the actions in your roadmap.
              Prioritise your lowest-scoring pillars first — they represent the highest leverage for overall score improvement.
            </p>
          </div>

          <div className="divide-y divide-border-mid">
            {PILLARS.map((pillar) => {
              const current = pillar_scores[pillar] ?? 0;
              const target = getTargetScore(current);
              const currentColor = getPillarColor(current);
              const gap = +(target - current).toFixed(1);
              return (
                <div key={pillar} className="px-6 py-5 flex gap-6">
                  <div className="w-44 flex-shrink-0">
                    <div className="text-xs font-medium text-ink mb-2">{pillar}</div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-muted">Now</span>
                      <span className="font-display text-base" style={{ color: currentColor }}>{current.toFixed(1)}</span>
                      <span className="text-muted text-xs">→</span>
                      <span className="font-display text-base text-success">{target.toFixed(1)}</span>
                    </div>
                    {gap > 0 ? (
                      <div className="mt-1 text-[10px] text-warning">+{gap} points to close</div>
                    ) : (
                      <div className="mt-1 text-[10px] text-success">Sustain current level</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] tracking-wider uppercase text-muted mb-1.5">What good looks like</div>
                    <p className="text-xs text-body-text leading-relaxed mb-3">
                      {PILLAR_FUTURE_STATE[pillar]}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted w-12">Current</span>
                        <div className="flex-1 h-1 bg-border-mid rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${(current / 5) * 100}%`, backgroundColor: currentColor }}
                          />
                        </div>
                        <span className="text-[10px] w-6 text-right" style={{ color: currentColor }}>{current.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted w-12">Target</span>
                        <div className="flex-1 h-1 bg-border-mid rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-success/50 transition-all duration-700"
                            style={{ width: `${(target / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-success w-6 text-right">{target.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {roadmapSummary.length > 0 && (
          <div className="bg-white border border-border rounded mb-8">
            <div className="px-6 py-4 border-b border-border-mid flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-gold" />
                <div className="text-[10px] tracking-widest uppercase text-muted">Roadmap Summary — High Priority Actions</div>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs text-gold-deep hover:underline flex items-center gap-1"
              >
                View full roadmap <ArrowRight size={11} />
              </button>
            </div>
            <div className="divide-y divide-border-mid">
              {roadmapSummary.map((item) => {
                const color = getPillarColor(pillar_scores[item.pillar] ?? 0);
                return (
                  <div key={item.id} className="px-6 py-4 flex items-start gap-4">
                    <div
                      className="flex-shrink-0 text-[10px] font-medium tracking-wide px-2 py-1 rounded mt-0.5 whitespace-nowrap"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {item.pillar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink mb-0.5">{item.title}</div>
                      <p className="text-xs text-body-text leading-relaxed truncate">{item.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-muted">{item.timeline}</div>
                      <div className="text-[10px] text-muted mt-0.5">{item.effort} effort</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-4 bg-parchment border-t border-border-mid">
              <p className="text-xs text-muted">
                Showing {roadmapSummary.length} high-priority actions.
                {roadmapItems.length > roadmapSummary.length && ` Your full roadmap contains additional medium and low priority initiatives across all five pillars.`}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gold-bg border border-gold-light rounded p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-gold/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-3">Next Steps</div>
            <h2 className="font-display text-2xl text-ink mb-3">Execute your roadmap. Govern with Nia.</h2>
            <p className="text-sm text-body-text mb-6 max-w-lg">
              Your full action plan is ready with prioritised initiatives targeting your most critical gaps.
              Nia, your AI Ethics Officer, is available to advise on governance, compliance, and responsible AI decisions as you execute.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('roadmap')}
                className="bg-gold text-ink font-medium text-sm tracking-wide px-6 py-3 rounded flex items-center gap-2 hover:bg-gold-light transition-colors"
              >
                View Full Roadmap <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigate('ethics')}
                className="border border-gold text-gold-deep text-sm px-6 py-3 rounded hover:bg-gold/10 transition-colors"
              >
                Talk to Nia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

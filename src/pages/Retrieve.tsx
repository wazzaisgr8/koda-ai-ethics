import { useState } from 'react';
import { ArrowRight, Search, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AppView, Organisation, Assessment } from '../types';

interface RetrieveProps {
  onComplete: (org: Organisation, assessment: Assessment) => void;
  onNavigate: (view: AppView) => void;
}

export default function Retrieve({ onComplete, onNavigate }: RetrieveProps) {
  const [assessmentId, setAssessmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRetrieve(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = assessmentId.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    const { data: assessment, error: aErr } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', trimmed)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (aErr || !assessment) {
      setError('No report found for that ID. Please check and try again.');
      setLoading(false);
      return;
    }

    const { data: org, error: oErr } = await supabase
      .from('organisations')
      .select('*')
      .eq('id', assessment.org_id)
      .maybeSingle();

    if (oErr || !org) {
      setError('Could not load the organisation linked to this assessment.');
      setLoading(false);
      return;
    }

    onComplete(org as Organisation, assessment as Assessment);
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <nav className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2"
        >
          <img src="/logo_koda_1-transparent.png" alt="Koda" className="h-8 w-auto" />
          <span className="font-display text-ink text-xl">Koda</span>
        </button>
        <button
          onClick={() => onNavigate('assessment')}
          className="bg-gold text-ink text-xs font-medium tracking-wide px-5 py-2.5 rounded hover:bg-gold-light transition-colors"
        >
          Start New Assessment
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-border rounded-lg p-10 shadow-sm">
            <div className="w-10 h-10 bg-gold-bg border border-gold-light rounded flex items-center justify-center mb-6">
              <Search size={18} className="text-gold-deep" />
            </div>

            <div className="text-[10px] tracking-widest uppercase text-gold-deep mb-2">Retrieve Your Report</div>
            <h1 className="font-display text-2xl text-ink mb-2">Load a previous assessment</h1>
            <p className="text-sm text-body-text leading-relaxed mb-8">
              Enter the assessment ID you received when you completed your assessment to reload your report and roadmap.
            </p>

            <form onSubmit={handleRetrieve} className="space-y-4">
              <div>
                <label className="block text-xs text-muted tracking-wider uppercase mb-2">
                  Assessment ID
                </label>
                <input
                  type="text"
                  value={assessmentId}
                  onChange={e => { setAssessmentId(e.target.value); setError(null); }}
                  placeholder="e.g. a1b2c3d4-e5f6-..."
                  className="w-full border border-border rounded px-4 py-3 text-sm text-ink bg-parchment placeholder-muted focus:outline-none focus:border-gold/60 focus:bg-white transition-colors font-mono"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded px-4 py-3">
                  <AlertCircle size={14} className="text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-danger leading-relaxed">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !assessmentId.trim()}
                className="w-full bg-gold text-ink font-medium text-sm tracking-wide px-6 py-3 rounded flex items-center justify-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    Retrieving...
                  </>
                ) : (
                  <>
                    Retrieve Report <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border-mid">
              <p className="text-xs text-muted text-center">
                Don't have an ID?{' '}
                <button
                  onClick={() => onNavigate('assessment')}
                  className="text-gold-deep hover:underline"
                >
                  Start a new assessment
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

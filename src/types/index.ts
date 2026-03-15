export type Pillar = 'Technology' | 'Data' | 'People & Culture' | 'Process' | 'Ethics & Governance';

export interface Organisation {
  id: string;
  name: string;
  industry: string;
  size: string;
  ai_context: string;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  pillar: Pillar;
  text: string;
  helpText?: string;
}

export interface AssessmentResponse {
  questionId: string;
  score: number;
}

export interface PillarScore {
  pillar: Pillar;
  score: number;
  label: string;
  color: string;
}

export interface Assessment {
  id: string;
  org_id: string;
  responses: Record<string, number>;
  pillar_scores: Record<string, number>;
  overall_score: number;
  tier: string;
  created_at: string;
}

export interface RoadmapItem {
  id: string;
  assessment_id: string;
  org_id: string;
  pillar: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timeline: string;
  effort: string;
  completed: boolean;
  created_at: string;
}

export interface EthicsMessage {
  id: string;
  org_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export type AppView = 'landing' | 'assessment' | 'results' | 'roadmap' | 'ethics' | 'security' | 'retrieve';

export interface AppState {
  view: AppView;
  orgId: string | null;
  assessmentId: string | null;
  org: Organisation | null;
  assessment: Assessment | null;
}

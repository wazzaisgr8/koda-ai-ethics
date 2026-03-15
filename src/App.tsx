import { useState } from 'react';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Roadmap from './pages/Roadmap';
import EthicsOfficer from './pages/EthicsOfficer';
import Security from './pages/Security';
import Retrieve from './pages/Retrieve';
import type { AppView, Organisation, Assessment as AssessmentType } from './types';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [org, setOrg] = useState<Organisation | null>(null);
  const [assessment, setAssessment] = useState<AssessmentType | null>(null);

  function handleAssessmentComplete(completedOrg: Organisation, completedAssessment: AssessmentType) {
    setOrg(completedOrg);
    setAssessment(completedAssessment);
    setView('results');
  }

  function handleNavigate(target: AppView) {
    if ((target === 'results' || target === 'roadmap' || target === 'ethics') && (!org || !assessment)) {
      setView('assessment');
      return;
    }
    setView(target);
  }

  if (view === 'landing') {
    return <Landing onNavigate={handleNavigate} />;
  }

  if (view === 'assessment') {
    return <Assessment onComplete={handleAssessmentComplete} onNavigate={handleNavigate} />;
  }

  if (view === 'results' && org && assessment) {
    return <Results org={org} assessment={assessment} onNavigate={handleNavigate} />;
  }

  if (view === 'roadmap' && org && assessment) {
    return <Roadmap org={org} assessment={assessment} onNavigate={handleNavigate} />;
  }

  if (view === 'ethics' && org && assessment) {
    return <EthicsOfficer org={org} assessment={assessment} onNavigate={handleNavigate} />;
  }

  if (view === 'security') {
    return <Security onNavigate={handleNavigate} />;
  }

  if (view === 'retrieve') {
    return <Retrieve onComplete={handleAssessmentComplete} onNavigate={handleNavigate} />;
  }

  return <Landing onNavigate={handleNavigate} />;
}

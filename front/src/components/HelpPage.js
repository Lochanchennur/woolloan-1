import React from 'react';
import { ArrowLeft, BookOpen, Info, ShieldCheck, Database } from 'lucide-react';

const HelpPage = ({ onBack }) => {
  return (
    <div className="page-enter" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-header">
        <div>
          <h2>Help & Documentation</h2>
          <p style={{ color: 'var(--text-muted)' }}>How to utilize the Credit Assessor</p>
        </div>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={18} /> Back to App
        </button>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ color: 'var(--primary)', padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%' }}>
            <Database size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>1. Uploading a Global Model</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              The application begins by establishing a baseline. You must upload a CSV file containing historical customer data (e.g., Kaggle Credit Score Classifications). We parse this locally in your browser memory via Papaparse to simulate a training dataset without sending sensitive info to a server.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ color: 'var(--primary)', padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>2. Risk Assessment Architecture</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Our engine uses heuristic comparison to mock a robust ML model. When you evaluate a single applicant, we map their requested Debt-to-Income constraint and credit age profile to established lending baselines to calculate a Risk Score up to 100. Lower is safer.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ color: 'var(--primary)', padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%' }}>
            <Info size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>3. The 'Thin-File' Problem</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              "Thin-file" applicants are people with little to no credit history. Traditional bureaus auto-reject them. Our application is designed to find alternative trust factors (like stable Income vs. Duration) to potentially approve borrowers who only have 0-1 credit cards.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ color: 'var(--primary)', padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>4. The UI Wizard</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Keep an eye on the wizard floating in the corner! Expanding upon modern UX guides, this intelligent helper monitors the state of your application and reacts with contextual guidance to reduce the lending operator's cognitive load.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;

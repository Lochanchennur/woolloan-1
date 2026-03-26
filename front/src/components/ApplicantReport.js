import React from 'react';
import { ShieldCheck, AlertOctagon, Info, ArrowLeft } from 'lucide-react';

const ApplicantReport = ({ applicant, result, onReset }) => {
  if (!result) return null;

  const { riskScore, recommendation, factors, dti } = result;

  const isApproved = riskScore < 60; // Just a visual threshold
  const ColorIcon = isApproved ? ShieldCheck : AlertOctagon;
  const iconColor = isApproved ? 'var(--success)' : 'var(--danger)';

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      
      <div className="dashboard-header">
        <div>
          <h2>Evaluation Complete</h2>
          <p style={{ color: 'var(--text-muted)' }}>Comparison against baseline dataset generated.</p>
        </div>
        <button className="btn btn-outline" onClick={onReset}>
          <ArrowLeft size={18} /> Evaluate Another
        </button>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
        
        <div style={{ margin: '0 auto', color: iconColor }}>
          <ColorIcon size={80} />
        </div>

        <div>
           <h1 style={{ fontSize: '2.5rem', color: iconColor }}>{recommendation}</h1>
           <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.2rem' }}>
             Simulated Risk Metric: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{riskScore} / 100</span>
           </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left' }}>
           <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Applicant Profile</h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Loan Requested</span>
                 <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${parseInt(applicant.loanAmount).toLocaleString()}</p>
              </div>
              <div>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Income</span>
                 <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${parseInt(applicant.annualIncome).toLocaleString()}</p>
              </div>
              <div>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Debt-To-Income (Req)</span>
                 <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{dti}%</p>
              </div>
           </div>
        </div>

        <div style={{ textAlign: 'left' }}>
           <h3 style={{ marginBottom: '1rem' }}>Risk Factors</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {factors.map((factor, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', 
                  borderRadius: '8px', background: `var(--${factor.type})`, opacity: 0.9, color: 'white'
                }}>
                  <Info size={20} />
                  <span>{factor.message}</span>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ApplicantReport;

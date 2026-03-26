import React from 'react';
import { Users, AlertTriangle, Activity, CreditCard, ArrowLeft, UserPlus } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = ({ metrics, onReset, filename, onEvaluateSingle }) => {
  if (!metrics) return null;

  const { totalUsers, thinFileCount, thinFilePercent, avgCreditScore, defaultRate, charts } = metrics;

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s ease' }}>
      <div className="dashboard-header">
        <div>
          <h2>Risk Analysis Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Dataset: {filename} • Analyzed {totalUsers.toLocaleString()} profiles</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button id="tour-assess-btn" className="btn btn-primary" onClick={onEvaluateSingle}>
            <UserPlus size={18} /> Assess Applicant
          </button>
          <button className="btn btn-outline" onClick={onReset}>
            <ArrowLeft size={18} /> New Dataset
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper"><Users size={24} /></div>
          <span className="metric-label">Total Profiles Analyzed</span>
          <span className="metric-value">{totalUsers.toLocaleString()}</span>
        </div>
        
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}><AlertTriangle size={24} /></div>
          <span className="metric-label">Thin-File Users</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="metric-value">{thinFileCount.toLocaleString()}</span>
            <span style={{ color: 'var(--warning)', fontWeight: 600 }}>({thinFilePercent}%)</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}><Activity size={24} /></div>
          <span className="metric-label">Avg Credit Score</span>
          <span className="metric-value">{avgCreditScore}</span>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}><CreditCard size={24} /></div>
          <span className="metric-label">Default Rate</span>
          <span className="metric-value">{defaultRate}%</span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="glass-card chart-container">
          <h3 className="chart-title">Age Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.ageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <RechartsTooltip 
                contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card chart-container">
          <h3 className="chart-title">Credit Card Allocation</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.cardData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {charts.cardData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

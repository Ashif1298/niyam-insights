import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';
import { api } from '../services/api';

export default function DisclaimerPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings()
      .then((data) => setSettings(data))
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  return (
    <div className="container" style={{ maxWidth: '820px', padding: '4rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-600)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--color-navy-subtle)', color: 'var(--color-navy)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy-dark)', fontFamily: 'var(--font-serif)', margin: 0 }}>
            Regulatory & Legal Disclaimer
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', margin: '0.25rem 0 0' }}>
            Terms of Reference & Independent Knowledge Statement
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-slate-800)', whiteSpace: 'pre-line' }}>
          {settings?.disclaimerFull || `Niyam Insights curates and explains publicly available regulatory information issued by regulators such as the Securities and Exchange Board of India (SEBI) and the International Financial Services Centres Authority (IFSCA). The content is provided solely for educational and informational purposes.

Niyam Insights does not provide legal, compliance, investment, or regulatory advice, and does not undertake advisory or execution services. Readers should refer to original regulatory documents and consult qualified professionals where required.

Niyam Insights is an independent knowledge initiative, not an advisory or execution platform.`}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
            Last Reviewed: <strong>October 2024</strong>
          </div>
          <Link to="/" className="btn btn-primary btn-sm">
            Return to Knowledge Repository
          </Link>
        </div>
      </div>
    </div>
  );
}

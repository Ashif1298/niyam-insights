import React from 'react';
import { X, ShieldAlert, BookOpen } from 'lucide-react';

export default function DisclaimerModal({ isOpen, onClose, fullText }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close disclaimer modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              backgroundColor: 'var(--color-navy-subtle)',
              color: 'var(--color-navy)',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 id="disclaimer-modal-title" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-navy-dark)' }}>
              Regulatory Disclaimer
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', margin: 0 }}>
              Independent Educational & Informational Initiative
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderLeft: '3px solid var(--color-navy)',
            padding: '1.25rem 1.5rem',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
            color: 'var(--color-slate-800)',
            lineHeight: '1.75',
            whiteSpace: 'pre-line',
          }}
        >
          {fullText || `Niyam Insights curates and explains publicly available regulatory information issued by regulators such as the Securities and Exchange Board of India (SEBI) and the International Financial Services Centres Authority (IFSCA). The content is provided solely for educational and informational purposes.

Niyam Insights does not provide legal, compliance, investment, or regulatory advice, and does not undertake advisory or execution services. Readers should refer to original regulatory documents and consult qualified professionals where required.

Niyam Insights is an independent knowledge initiative, not an advisory or execution platform.`}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}

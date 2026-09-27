import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info } from 'lucide-react';

export default function Footer({ onOpenDisclaimer }) {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* Institutional Minimal Disclaimer Box */}
        <div className="footer-disclaimer-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Info size={16} color="var(--color-navy)" />
            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Institutional Disclaimer
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.65' }}>
            Niyam Insights curates and explains publicly available regulatory information. It does not provide legal, compliance, or investment advice. Niyam Insights is an independent knowledge initiative, not an advisory or execution platform.
          </p>
        </div>

        {/* Clickable One-liner Banner */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm disclaimer-clickable-text"
            onClick={onOpenDisclaimer}
            style={{ fontSize: '0.875rem' }}
          >
            <ShieldCheck size={16} color="var(--color-slate-500)" />
            <span>Content is for educational and informational purposes only. (Click for full disclaimer)</span>
          </button>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Niyam Insights</span>
            <Link to="/regulator/sebi" style={{ color: 'var(--color-slate-600)', fontSize: '0.85rem' }}>
              SEBI Repository
            </Link>
            <Link to="/regulator/ifsca" style={{ color: 'var(--color-slate-600)', fontSize: '0.85rem' }}>
              IFSCA Repository
            </Link>
            <Link to="/blogs" style={{ color: 'var(--color-slate-600)', fontSize: '0.85rem' }}>
              Regulatory Notes & Blogs
            </Link>
            <Link to="/disclaimer" style={{ color: 'var(--color-slate-600)', fontSize: '0.85rem' }}>
              Disclaimer Page
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>&copy; {new Date().getFullYear()} Niyam Insights. All rights reserved.</span>
            <Link to="/admin" style={{ color: 'var(--color-slate-400)', fontSize: '0.775rem' }}>
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

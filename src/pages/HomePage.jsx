import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import AudioPronunciation from '../components/AudioPronunciation';
import { api } from '../services/api';

export default function HomePage({ onOpenDisclaimer }) {
  const [settings, setSettings] = useState(null);
  const [regulators, setRegulators] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    api.getSettings()
      .then((data) => setSettings(data))
      .catch((err) => console.error('Error fetching settings:', err));

    api.getRegulators()
      .then((data) => setRegulators(data.filter((r) => r.isPublished)))
      .catch((err) => console.error('Error fetching regulators:', err));
  }, []);

  const toggleSection = (sectionKey) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  return (
    <div className="home-page-root institutional-bg-pattern">
      {/* 1. ABOVE THE FOLD (Fits on one screen) */}
      <section className="hero-screen" id="hero-section">
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="hero-content">
            <div className="hero-tagline">
              {settings?.tagline || 'A regulatory navigation and interpretation platform'}
            </div>

            <h1 className="hero-title">
              {settings?.siteName || 'Niyam Insights'}
            </h1>

            {/* Oxford-Style Phonetic Definition Box */}
            <div className="definition-box">
              <div className="definition-header">
                <span className="word-term">Niyam</span>
                <span className="word-part-of-speech">{settings?.definitionNoun || 'noun'}</span>

                <span className="word-phonetic">
                  {settings?.definitionPronunciation || '/ˈnɪ.yəm/ (nee-yum)'}
                  <AudioPronunciation term="Niyam" />
                </span>

                <span className="word-devanagari">{settings?.definitionHindi || 'नियम'}</span>
              </div>

              {/* One tight paragraph only */}
              <div className="definition-text">
                {settings?.definitionParagraph ||
                  'Niyam refers to rule, order, or governing principle. In modern institutions, it appears as regulations and compliance frameworks that quietly shape how capital markets operate. Niyam Insights applies this idea of order to financial market regulation.'}
              </div>
            </div>

            {/* Quick Access Launch Cards for Fast Navigation */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                marginTop: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <Link
                to="/regulator/sebi"
                className="card"
                style={{
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  border: '1px solid rgba(13, 39, 77, 0.12)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>SEBI</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy-dark)' }}>
                      Portfolio Managers (PMS)
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>
                    Regulations • Master Circulars • Interpretation
                  </span>
                </div>
                <ArrowRight size={15} color="var(--color-navy)" />
              </Link>

              <Link
                to="/regulator/ifsca"
                className="card"
                style={{
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  border: '1px solid rgba(13, 39, 77, 0.12)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>IFSCA</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy-dark)' }}>
                      Fund Management (FME)
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>
                    GIFT City IFSC • Non-Retail Schemes
                  </span>
                </div>
                <ArrowRight size={15} color="var(--color-navy)" />
              </Link>

              <Link
                to="/blogs"
                className="card"
                style={{
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  border: '1px solid rgba(13, 39, 77, 0.12)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-bronze" style={{ fontSize: '0.65rem' }}>COMMUNIQUE</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy-dark)' }}>
                      Regulatory Notes & Essays
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>
                    Analytical Memoranda • PDF Downloads
                  </span>
                </div>
                <ArrowRight size={15} color="var(--color-navy)" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator prompt */}
        <div className="container" style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
          <a
            href="#summaries-section"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.825rem',
              color: 'var(--color-slate-500)',
              textDecoration: 'none',
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-slate-200)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s',
            }}
          >
            <span>Read institutional purpose & platform architecture</span>
            <ChevronDown size={14} />
          </a>
        </div>
      </section>

      {/* 2. SECTION SUMMARIES (Visible, Scannable with In-Place Accordion Expansion) */}
      <section id="summaries-section" style={{ padding: '4.5rem 0 5.5rem', borderTop: 'var(--border-subtle)', backgroundColor: '#FFFFFF' }}>
        <div className="container-narrow">
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-slate-500)' }}>
              Institutional Architecture
            </span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--color-navy-dark)', marginTop: '0.35rem' }}>
              Understanding the Initiative
            </h2>
          </div>

          <div className="section-summaries-grid">
            {/* Section 1: Why Niyam Insights exists */}
            <div className="summary-card">
              <div className="summary-card-header" onClick={() => toggleSection('why')}>
                <div style={{ flex: 1 }}>
                  <h3 className="summary-heading">Why Niyam Insights exists</h3>
                  <div className="summary-snippet">
                    {settings?.whyItExistsShort ||
                      'Capital market regulation is extensive, but difficult to navigate for founders and investment professionals. Niyam Insights exists to make regulatory frameworks readable and intelligible for people who operate regulated institutions.'}
                  </div>
                </div>
                <button
                  type="button"
                  className="expand-toggle-btn"
                  aria-expanded={expandedSection === 'why'}
                  aria-label="Toggle Why Niyam Insights exists full content"
                >
                  <span>{expandedSection === 'why' ? 'Show less' : 'Read more'}</span>
                  {expandedSection === 'why' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {expandedSection === 'why' && (
                <div className="expanded-body">
                  {settings?.whyItExistsFull || `Capital market regulation is extensive, but understanding it is rarely simple.

Regulatory obligations evolve through regulations, circulars, amendments, clarifications, and enforcement actions. These are written to be legally precise and regulator-focused. They are not always intuitive for founders, chief investment officers, or fund managers whose primary responsibility is investment decision-making and long-term performance.

This creates a recurring problem.
Obligations are understood late. Regulatory intent is missed. Compliance becomes reactive rather than designed into the structure of the institution.

Niyam Insights exists to reduce this gap by making regulation readable, navigable, and intelligible for the people who operate within regulated financial systems.`}
                </div>
              )}
            </div>

            {/* Section 2: What Niyam Insights does */}
            <div className="summary-card">
              <div className="summary-card-header" onClick={() => toggleSection('what')}>
                <div style={{ flex: 1 }}>
                  <h3 className="summary-heading">What Niyam Insights does</h3>
                  <div className="summary-snippet">
                    {settings?.whatItDoesShort ||
                      'Niyam Insights organises publicly available regulatory material by regulator and intermediary, focusing on how rules operate in practice rather than how they are drafted.'}
                  </div>
                </div>
                <button
                  type="button"
                  className="expand-toggle-btn"
                  aria-expanded={expandedSection === 'what'}
                  aria-label="Toggle What Niyam Insights does full content"
                >
                  <span>{expandedSection === 'what' ? 'Show less' : 'Read more'}</span>
                  {expandedSection === 'what' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {expandedSection === 'what' && (
                <div className="expanded-body">
                  {settings?.whatItDoesFull || `Niyam Insights organises publicly available regulatory material by regulator and by intermediary, rather than by document type.

Regulatory frameworks are presented under authorities such as:
• Securities and Exchange Board of India (SEBI)
• International Financial Services Centres Authority (IFSCA)

Within each regulator, content is structured by intermediary, including:
• Investment Adviser (IA)
• Research Analyst (RA)
• Portfolio Manager (PMS)
• Alternative Investment Fund (AIF)

For each intermediary, Niyam Insights:
• links original regulations, circulars, and directions directly from the regulator
• explains regulatory intent in clear, non-legal language
• highlights responsibilities that materially affect operations and governance
• distinguishes formal requirements from practical expectations observed in supervisory practice

Interpretation is always clearly separated from original source material.`}
                </div>
              )}
            </div>

            {/* Section 3: Who this is for */}
            <div className="summary-card">
              <div className="summary-card-header" onClick={() => toggleSection('who')}>
                <div style={{ flex: 1 }}>
                  <h3 className="summary-heading">Who this is for</h3>
                  <div className="summary-snippet">
                    {settings?.whoItIsForShort ||
                      'Designed for founders, chief investment officers, fund managers, and serious learners who value understanding before execution.'}
                  </div>
                </div>
                <button
                  type="button"
                  className="expand-toggle-btn"
                  aria-expanded={expandedSection === 'who'}
                  aria-label="Toggle Who this is for full content"
                >
                  <span>{expandedSection === 'who' ? 'Show less' : 'Read more'}</span>
                  {expandedSection === 'who' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {expandedSection === 'who' && (
                <div className="expanded-body">
                  {settings?.whoItIsForFull || `Niyam Insights is intended for:
• founders and promoters of regulated financial intermediaries
• chief investment officers and fund managers seeking regulatory clarity without legal noise
• senior professionals working across multiple licences
• students who want to understand regulation as a living system rather than an examination subject

The platform is not designed for speed or virality.
It is designed for people who value understanding before execution.`}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALWAYS VISIBLE ONE-LINER DISCLAIMER */}
      <div className="home-disclaimer-bar">
        <div className="container">
          <button
            type="button"
            className="btn btn-ghost btn-sm disclaimer-clickable-text"
            onClick={onOpenDisclaimer}
          >
            <ShieldCheck size={16} color="var(--color-slate-500)" />
            <span>{settings?.disclaimerShort || 'Content is for educational and informational purposes only.'}</span>
            <span style={{ textDecoration: 'underline', fontWeight: 600, color: 'var(--color-navy)' }}>
              (View Full Disclaimer)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

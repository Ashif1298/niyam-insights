import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  FileText,
  BookOpen,
  Download,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  Lock,
  Scale,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api';
import PDFViewerModal from '../components/PDFViewerModal';

export default function RegulatorPage() {
  const { slug } = useParams();
  const [regulator, setRegulator] = useState(null);
  const [intermediaries, setIntermediaries] = useState([]);
  const [selectedIntermediary, setSelectedIntermediary] = useState(null);

  // Data for current selected intermediary
  const [documents, setDocuments] = useState([]);
  const [interpretation, setInterpretation] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Filters & State
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('documents'); // 'documents' | 'interpretation' | 'blogs'
  const [frameworksOpen, setFrameworksOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // PDF Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getRegulator(slug)
      .then((regData) => {
        setRegulator(regData);
        return api.getIntermediaries(regData.id);
      })
      .then((interData) => {
        setIntermediaries(interData);
        const activeOne = interData.find((i) => i.isActive) || interData[0];
        setSelectedIntermediary(activeOne);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading regulator details:', err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!selectedIntermediary || !regulator) return;

    api.getDocuments({ regulatorId: regulator.id, intermediaryId: selectedIntermediary.id })
      .then((docs) => setDocuments(docs))
      .catch((err) => console.error('Error fetching documents:', err));

    api.getInterpretationForIntermediary(selectedIntermediary.id)
      .then((interp) => setInterpretation(interp))
      .catch((err) => console.error('Error fetching interpretation:', err));

    api.getBlogs({ regulatorTag: regulator.shortName, intermediaryTag: selectedIntermediary.shortCode })
      .then((posts) => setRelatedBlogs(posts))
      .catch((err) => console.error('Error fetching related blogs:', err));
  }, [selectedIntermediary, regulator]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-slate-400)' }}>
        Loading statutory repository...
      </div>
    );
  }

  if (!regulator) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Regulator Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-slate-600)' }}>
          The requested regulatory authority is not configured in the knowledge repository.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  // Count by category
  const countByCategory = (cat) => {
    if (cat === 'All') return documents.length;
    return documents.filter((d) => d.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      docCategoryFilter === 'All' || doc.category.toLowerCase() === docCategoryFilter.toLowerCase();
    const matchesSearch =
      !docSearchQuery.trim() ||
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      (doc.summary && doc.summary.toLowerCase().includes(docSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenPdf = (doc) => {
    setSelectedPdfDoc(doc);
    setPdfModalOpen(true);
  };

  return (
    <div className="regulator-page-root">
      {/* Regulator Hero Header */}
      <section className="regulator-hero">
        <div className="container">
          <div className="regulator-header-meta">
            <span className="badge badge-navy" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
              {regulator.shortName}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-400)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', fontWeight: 500 }}>
              Statutory Capital Market Authority
            </span>
          </div>

          <h1 className="regulator-title">{regulator.name}</h1>
          <p className="regulator-tagline">{regulator.tagline || regulator.about}</p>

          <div className="regulator-details-strip">
            {regulator.established && (
              <div className="detail-item">
                <span>Established: </span>
                <strong>{regulator.established}</strong>
              </div>
            )}
            {regulator.headquarters && (
              <div className="detail-item">
                <span>Headquarters: </span>
                <strong>{regulator.headquarters}</strong>
              </div>
            )}
            {regulator.website && (
              <div className="detail-item" style={{ marginLeft: 'auto' }}>
                <a
                  href={regulator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ fontWeight: 600 }}
                >
                  <span>Official Statutory Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section style={{ padding: '3rem 0 6rem', backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          {/* Understanding Financial Structure & Common Acts Matrix */}
          {regulator.frameworks && regulator.frameworks.length > 0 && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem 1.75rem',
                marginBottom: '2.75rem',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => setFrameworksOpen(!frameworksOpen)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: 'var(--color-navy-subtle)', padding: '0.6rem', borderRadius: 'var(--radius-xs)', color: 'var(--color-navy)' }}>
                    <Scale size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-slate-400)', display: 'block' }}>
                      Statutory Blueprint
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-navy-dark)' }}>
                      Understanding Financial Structure & Common Frameworks ({regulator.shortName})
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.85rem' }}
                >
                  <span>{frameworksOpen ? 'Hide Statutory Matrix' : 'Explore Enabling Acts & Frameworks'}</span>
                  {frameworksOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>

              {frameworksOpen && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.25rem',
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--color-slate-200)',
                    animation: 'fadeIn 0.2s',
                  }}
                >
                  {regulator.frameworks.map((fw) => (
                    <div
                      key={fw.id}
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-slate-200)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span className="badge badge-slate" style={{ fontSize: '0.65rem', marginBottom: '0.4rem' }}>
                          {fw.code}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                          {fw.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: 0, lineHeight: '1.6' }}>
                          {fw.summary}
                        </p>
                      </div>

                      {fw.docUrl && (
                        <a
                          href={fw.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.785rem', fontWeight: 600, color: 'var(--color-navy)' }}
                        >
                          <span>Statutory Text</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Intermediary Specific Navigation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-slate-500)' }}>
              Intermediary Specific Repository
            </span>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-navy-dark)', marginTop: '0.25rem' }}>
              Select Intermediary Regime
            </h2>
          </div>

          {/* Intermediary Tabs */}
          <div className="intermediary-nav-bar">
            {intermediaries.map((item) => {
              const isSelected = selectedIntermediary?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`intermediary-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedIntermediary(item)}
                >
                  <span>{item.name}</span>
                  {item.isActive ? (
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                      Active
                    </span>
                  ) : (
                    <span className="badge badge-inactive" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Lock size={10} /> Backend Ready
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Selected Intermediary Context Header Card */}
          {selectedIntermediary && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                marginBottom: '2.5rem',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-navy">{regulator.shortName}</span>
                    <span className="badge badge-slate">{selectedIntermediary.shortCode}</span>
                  </div>
                  <h3 style={{ fontSize: '1.65rem', color: 'var(--color-navy-dark)', fontFamily: 'var(--font-serif)' }}>
                    {selectedIntermediary.name}
                  </h3>
                  <p style={{ fontSize: '1rem', color: 'var(--color-slate-600)', margin: '0.35rem 0 0' }}>
                    {selectedIntermediary.description}
                  </p>
                </div>
                {!selectedIntermediary.isActive && (
                  <div className="badge badge-inactive" style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem' }}>
                    Registration specifications configured; active commentary rolling out.
                  </div>
                )}
              </div>

              {/* Fiduciary & Capital Metrics Strip */}
              {(selectedIntermediary.minTicket || selectedIntermediary.minNetWorth || selectedIntermediary.regulationsYear) && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    paddingTop: '1.25rem',
                    marginTop: '0.75rem',
                    borderTop: '1px solid var(--color-slate-100)',
                    fontSize: '0.885rem',
                  }}
                >
                  {selectedIntermediary.minTicket && (
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textTransform: 'uppercase', display: 'block' }}>Minimum Investment Ticket</span>
                      <strong style={{ color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>{selectedIntermediary.minTicket}</strong>
                    </div>
                  )}
                  {selectedIntermediary.minNetWorth && (
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textTransform: 'uppercase', display: 'block' }}>Capital Adequacy (Net Worth)</span>
                      <strong style={{ color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>{selectedIntermediary.minNetWorth}</strong>
                    </div>
                  )}
                  {selectedIntermediary.regulationsYear && (
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textTransform: 'uppercase', display: 'block' }}>Principal Statutory Code</span>
                      <strong style={{ color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>{selectedIntermediary.regulationsYear}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sub-Tabs: Regulatory Documents vs. Niyam Insights Interpretation vs. Related Blogs */}
          <div className="content-sub-tabs">
            <button
              type="button"
              className={`sub-tab-btn ${activeSubTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('documents')}
            >
              Regulatory Documents ({documents.length})
            </button>
            <button
              type="button"
              className={`sub-tab-btn ${activeSubTab === 'interpretation' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('interpretation')}
            >
              Niyam Insights Interpretation
            </button>
            <button
              type="button"
              className={`sub-tab-btn ${activeSubTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('blogs')}
            >
              Related Blogs & Notes ({relatedBlogs.length})
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: REGULATORY DOCUMENTS */}
          {/* ========================================================================= */}
          {activeSubTab === 'documents' && (
            <div>
              {/* Category Filter & Search Bar */}
              <div className="document-filter-bar">
                <div className="category-pills">
                  {['All', 'Regulations', 'Master Circulars', 'Circulars'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-pill ${docCategoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setDocCategoryFilter(cat)}
                    >
                      <span>{cat}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '0.25rem' }}>
                        ({countByCategory(cat)})
                      </span>
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={15} color="var(--color-slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search documents by title or topic..."
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Documents List */}
              {filteredDocuments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
                  <FileText size={40} color="var(--color-slate-300)" style={{ marginBottom: '0.85rem' }} />
                  <h4 style={{ color: 'var(--color-slate-700)', marginBottom: '0.25rem' }}>No regulatory documents found</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
                    Try adjusting your category filter or search query.
                  </p>
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-card-top">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                          <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                            {doc.category}
                          </span>
                          {doc.version && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', fontFamily: 'var(--font-mono)' }}>
                              {doc.version}
                            </span>
                          )}
                        </div>
                        <h4 className="document-title">{doc.title}</h4>
                      </div>

                      <div className="document-meta-line">
                        <Calendar size={14} />
                        <span>{doc.date}</span>
                      </div>
                    </div>

                    {doc.summary && <p className="document-summary">{doc.summary}</p>}

                    <div className="document-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenPdf(doc)}
                      >
                        <Download size={13} />
                        <span>Download / View PDF</span>
                      </button>

                      {doc.originalRegulatorUrl && (
                        <a
                          href={doc.originalRegulatorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <ExternalLink size={13} />
                          <span>Original Regulator Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: NIYAM INSIGHTS INTERPRETATION */}
          {/* ========================================================================= */}
          {activeSubTab === 'interpretation' && (
            <div>
              {interpretation ? (
                <div className="interpretation-container">
                  {/* Editorial Notice & Delineation */}
                  <div className="editorial-notice">
                    <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Niyam Insights Analytical Commentary: </strong>
                      This interpretation represents independent analytical commentary explaining regulatory intent and supervisory practice. It is strictly delineated from official statutory regulations and does not constitute legal or investment advice.
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-slate-200)' }}>
                    <div>
                      <h2 style={{ fontSize: '2.1rem', color: 'var(--color-navy-dark)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
                        {interpretation.title}
                      </h2>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                        Last Analytical Review: <strong>{interpretation.lastUpdated}</strong> • Prepared by Niyam Editorial Research
                      </div>
                    </div>

                    {interpretation.downloadPdfUrl && (
                      <a
                        href={interpretation.downloadPdfUrl}
                        download
                        className="btn btn-primary btn-sm"
                        style={{ fontWeight: 600 }}
                      >
                        <Download size={14} />
                        <span>Download Complete Analytical Memorandum (PDF)</span>
                      </a>
                    )}
                  </div>

                  {/* 1. Regulatory Intent */}
                  <div className="editorial-section">
                    <h3 className="editorial-section-title">
                      <BookOpen size={22} color="var(--color-navy)" />
                      <span>1. Regulatory Intent & Fiduciary Architecture</span>
                    </h3>
                    <div className="editorial-prose">
                      {interpretation.intent}
                    </div>
                  </div>

                  {/* 2. Practical Supervisory Expectations */}
                  <div className="editorial-section">
                    <h3 className="editorial-section-title">
                      <CheckCircle2 size={22} color="var(--color-emerald)" />
                      <span>2. Practical Supervisory Expectations Observed in Practice</span>
                    </h3>
                    <div className="editorial-prose">
                      {interpretation.practicalExpectations}
                    </div>
                  </div>

                  {/* 3. Operational Governance & Capital Impact */}
                  {interpretation.governanceImpact && (
                    <div className="editorial-section">
                      <h3 className="editorial-section-title">
                        <Building2 size={22} color="var(--color-bronze)" />
                        <span>3. Key Governance, Capital Adequacy & Operational Impact</span>
                      </h3>
                      <div className="editorial-prose">
                        {interpretation.governanceImpact}
                      </div>
                    </div>
                  )}

                  {/* 4. Deep Dive Sections & Callouts */}
                  {interpretation.sections && interpretation.sections.map((sec, idx) => (
                    <div key={idx} className="editorial-section">
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-navy-dark)', marginBottom: '0.85rem' }}>
                        {sec.title}
                      </h4>
                      <p style={{ fontSize: '1.075rem', lineHeight: '1.8', color: 'var(--color-slate-700)' }}>
                        {sec.content}
                      </p>
                      {sec.callout && (
                        <div className="editorial-callout">
                          <strong>Supervisory Note: </strong>
                          {sec.callout}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
                  <BookOpen size={40} color="var(--color-slate-300)" style={{ marginBottom: '0.85rem' }} />
                  <h4 style={{ color: 'var(--color-slate-700)', marginBottom: '0.25rem' }}>Interpretation in editorial preparation</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
                    Detailed analytical commentary for this intermediary is currently being curated.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: RELATED BLOGS & REGULATORY NOTES */}
          {/* ========================================================================= */}
          {activeSubTab === 'blogs' && (
            <div>
              {relatedBlogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
                  <Layers size={40} color="var(--color-slate-300)" style={{ marginBottom: '0.85rem' }} />
                  <h4 style={{ color: 'var(--color-slate-700)', marginBottom: '0.25rem' }}>No related articles tagged yet</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
                    Articles and regulatory notes tagged with {selectedIntermediary?.shortCode} will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="notes-grid">
                  {relatedBlogs.map((post) => (
                    <div key={post.id} className="note-card">
                      <div>
                        <div className="note-tags">
                          <span className="badge badge-navy">{post.regulatorTag}</span>
                          <span className="badge badge-slate">{post.intermediaryTag}</span>
                        </div>
                        <h4 className="note-title">{post.title}</h4>
                        <p className="note-excerpt">{post.excerpt}</p>
                      </div>

                      <div>
                        <div className="note-meta">{post.date} • {post.readTime || '5 min read'}</div>
                        <div className="note-actions">
                          {post.pdfUrl ? (
                            <a
                              href={post.pdfUrl}
                              download
                              className="btn btn-outline btn-sm"
                            >
                              <Download size={13} />
                              <span>Download PDF</span>
                            </a>
                          ) : (
                            <button disabled className="btn btn-ghost btn-sm" style={{ opacity: 0.4 }}>
                              No PDF
                            </button>
                          )}
                          <Link to={`/blogs/${post.slug}`} className="btn btn-primary btn-sm">
                            <span>Read More</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* PDF Modal */}
      <PDFViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        docTitle={selectedPdfDoc?.title}
        pdfUrl={selectedPdfDoc?.pdfUrl}
        externalUrl={selectedPdfDoc?.originalRegulatorUrl}
      />
    </div>
  );
}

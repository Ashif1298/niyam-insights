import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, BookOpen, Layers, Search, Filter } from 'lucide-react';
import { api } from '../services/api';

export default function BlogsPage() {
  const [regulatoryNotes, setRegulatoryNotes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRegulator, setSelectedRegulator] = useState('All');
  const [selectedIntermediary, setSelectedIntermediary] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination for Regulatory Notes
  const [notesPage, setNotesPage] = useState(1);
  const notesPerPage = 6;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getBlogs({ type: 'regulatory_note' }),
      api.getBlogs({ type: 'blog' }),
    ])
      .then(([notesData, blogsData]) => {
        setRegulatoryNotes(notesData);
        setBlogs(blogsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs and notes:', err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filterPost = (post) => {
    const matchesRegulator =
      selectedRegulator === 'All' ||
      (post.regulatorTag && post.regulatorTag.toUpperCase() === selectedRegulator.toUpperCase());

    const matchesIntermediary =
      selectedIntermediary === 'All' ||
      (post.intermediaryTag && post.intermediaryTag.toUpperCase() === selectedIntermediary.toUpperCase());

    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegulator && matchesIntermediary && matchesSearch;
  };

  const filteredNotes = regulatoryNotes.filter(filterPost);
  const filteredBlogs = blogs.filter(filterPost);

  // Paginated Notes
  const totalNotesPages = Math.ceil(filteredNotes.length / notesPerPage) || 1;
  const paginatedNotes = filteredNotes.slice((notesPage - 1) * notesPerPage, notesPage * notesPerPage);

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Page Hero */}
        <div style={{ maxWidth: '820px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-slate-500)' }}>
            Institutional Commentary & Archival
          </span>
          <h1 style={{ fontSize: '2.85rem', color: 'var(--color-navy-dark)', marginTop: '0.35rem', marginBottom: '1rem' }}>
            Regulatory Notes & Long-Form Thinking
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-slate-600)', lineHeight: '1.7' }}>
            Structured commentary on capital market frameworks, supervisory expectations, and institutional governance. Designed for readability and long-term reference.
          </p>
        </div>

        {/* Global Filter & Search Strip */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            marginBottom: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
              <Filter size={15} />
              <span>Regulator:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['All', 'SEBI', 'IFSCA'].map((reg) => (
                <button
                  key={reg}
                  type="button"
                  className={`btn btn-sm ${selectedRegulator === reg ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setSelectedRegulator(reg);
                    setNotesPage(1);
                  }}
                >
                  {reg}
                </button>
              ))}
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-slate-200)', margin: '0 0.5rem' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
              <span>Intermediary:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', 'PMS', 'FME', 'IA', 'RA', 'AIF'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`btn btn-sm ${selectedIntermediary === item ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setSelectedIntermediary(item);
                    setNotesPage(1);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="var(--color-slate-400)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search commentary..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setNotesPage(1);
              }}
              className="form-input"
              style={{ paddingLeft: '2.2rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: REGULATORY NOTES */}
        {/* ========================================================================= */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ marginBottom: '1.75rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--color-navy)' }}>
            <h2 className="blog-section-title">Section 1: Regulatory Notes</h2>
            <div className="blog-section-subtitle">
              Concise analytical memoranda dissecting recent circulars, amendments, and operational directives.
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-slate-400)' }}>
              Loading regulatory notes...
            </div>
          ) : paginatedNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
              <p style={{ color: 'var(--color-slate-500)', margin: 0 }}>
                No regulatory notes match the selected filters.
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {paginatedNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <div>
                    <div className="note-tags">
                      <span className="badge badge-navy">{note.regulatorTag}</span>
                      <span className="badge badge-slate">{note.intermediaryTag}</span>
                    </div>
                    <h3 className="note-title">{note.title}</h3>
                    <p className="note-excerpt">{note.excerpt}</p>
                  </div>

                  <div>
                    <div className="note-meta">{note.date} • {note.readTime || '5 min read'}</div>
                    <div className="note-actions">
                      {note.pdfUrl ? (
                        <a
                          href={note.pdfUrl}
                          download
                          className="btn btn-outline btn-sm"
                          title="Download attached PDF document"
                        >
                          <Download size={13} />
                          <span>Download PDF</span>
                        </a>
                      ) : (
                        <button disabled className="btn btn-ghost btn-sm" style={{ opacity: 0.35 }}>
                          No PDF
                        </button>
                      )}
                      <Link to={`/blogs/${note.slug}`} className="btn btn-primary btn-sm">
                        <span>Read More</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls for Section 1 */}
          {totalNotesPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={notesPage === 1}
                onClick={() => setNotesPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', padding: '0 0.5rem' }}>
                Page {notesPage} of {totalNotesPages}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={notesPage === totalNotesPages}
                onClick={() => setNotesPage((p) => Math.min(totalNotesPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: BLOGS (LONG-FORM ESSAYS) */}
        {/* ========================================================================= */}
        <div>
          <div style={{ marginBottom: '1.75rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--color-navy)' }}>
            <h2 className="blog-section-title">Section 2: Long-Form Essays & Thought Leadership</h2>
            <div className="blog-section-subtitle">
              Deep foundational perspectives on financial market architecture, governance theory, and regulatory strategy.
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-slate-400)' }}>
              Loading long-form blogs...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
              <p style={{ color: 'var(--color-slate-500)', margin: 0 }}>
                No long-form articles match the selected filters.
              </p>
            </div>
          ) : (
            <div className="blogs-grid">
              {filteredBlogs.map((blog) => (
                <article key={blog.id} className="blog-card">
                  {blog.featuredImage && (
                    <div className="blog-card-img-wrap">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="blog-card-img"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="blog-card-body">
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      <span className="badge badge-navy">{blog.regulatorTag}</span>
                      {blog.intermediaryTag && (
                        <span className="badge badge-slate">{blog.intermediaryTag}</span>
                      )}
                    </div>

                    <h3 className="blog-card-title">
                      <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>

                    <p className="blog-card-excerpt">{blog.excerpt}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-slate-100)', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>
                        {blog.date} • {blog.readTime || '6 min read'}
                      </span>
                      <Link
                        to={`/blogs/${blog.slug}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)' }}
                      >
                        <span>Read Article</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

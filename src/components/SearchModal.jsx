import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ documents: [], interpretations: [], blogs: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ documents: [], interpretations: [], blogs: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ documents: [], interpretations: [], blogs: [] });
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.search(query)
        .then((data) => setResults(data))
        .catch((err) => console.error('Search error:', err))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.documents.length + results.interpretations.length + results.blogs.length;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--color-slate-200)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Search size={20} color="var(--color-slate-400)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search regulations, circulars, interpretations, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-slate-800)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)' }}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--color-slate-100)',
              border: '1px solid var(--color-slate-200)',
              borderRadius: '4px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              color: 'var(--color-slate-500)',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-slate-400)', fontSize: '0.9rem' }}>
              Searching regulatory repository...
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-slate-500)' }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>No results found for "{query}"</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>
                Try searching for terms like "PMS", "SEBI", "Valuation", "FME", or "High-Water Mark"
              </span>
            </div>
          )}

          {!loading && !query && (
            <div style={{ padding: '0.5rem 0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)' }}>
                Popular Topics
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                {['PMS Regulations 2020', 'Master Circular PMS', 'IFSCA Non-Retail FME', 'Valuation Framework', 'Direct Onboarding'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results groups */}
          {!loading && totalResults > 0 && (
            <div>
              {/* Interpretations */}
              {results.interpretations.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Niyam Editorial Interpretations
                  </div>
                  {results.interpretations.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNavigate(`/regulator/${item.regulatorId}`)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-slate-50)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <BookOpen size={16} color="var(--color-navy)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--color-navy)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>
                          {item.summary?.slice(0, 100)}...
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--color-slate-400)" />
                    </div>
                  ))}
                </div>
              )}

              {/* Regulatory Documents */}
              {results.documents.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Regulatory Documents
                  </div>
                  {results.documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleNavigate(`/regulator/${doc.regulatorId}`)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-slate-50)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <FileText size={16} color="var(--color-slate-600)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--color-slate-800)' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-slate-400)', marginTop: '0.2rem' }}>
                          {doc.category} • {doc.date}
                        </div>
                      </div>
                      <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>{doc.category}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Blogs & Notes */}
              {results.blogs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Blogs & Regulatory Notes
                  </div>
                  {results.blogs.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleNavigate(`/blogs/${b.slug}`)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-slate-50)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Layers size={16} color="var(--color-bronze)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--color-slate-800)' }}>{b.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>
                          {b.excerpt?.slice(0, 90)}...
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--color-slate-400)" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

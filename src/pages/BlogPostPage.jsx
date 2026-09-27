import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Calendar, Clock, BookOpen, Check, FileText, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getBlogBySlug(slug)
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load post:', err);
        setLoading(false);
      });
  }, [slug]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}%`;
      setScrollProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-slate-400)' }}>
        Loading analytical memorandum...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ marginTop: '0.75rem', color: 'var(--color-slate-600)' }}>
          The requested article or regulatory note does not exist in the archive.
        </p>
        <Link to="/blogs" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Blogs & Notes
        </Link>
      </div>
    );
  }

  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx}>{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h4 key={idx} style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', margin: '1.75rem 0 0.5rem', color: 'var(--color-navy)' }}>{trimmed.replace('#### ', '')}</h4>;
      }
      if (trimmed === '---') {
        return <hr key={idx} />;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        return (
          <li key={idx} style={{ marginLeft: '1.75rem', marginBottom: '0.45rem', listStyleType: 'disc' }}>
            {trimmed.replace(/^(\*|•)\s+/, '')}
          </li>
        );
      }
      if (trimmed.match(/^\d+\.\s+/)) {
        return (
          <li key={idx} style={{ marginLeft: '1.75rem', marginBottom: '0.45rem', listStyleType: 'decimal' }}>
            {trimmed.replace(/^\d+\.\s+/, '')}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} style={{ height: '0.85rem' }} />;
      }
      return <p key={idx}>{trimmed}</p>;
    });
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: scrollProgress,
          height: '3px',
          backgroundColor: 'var(--color-navy)',
          zIndex: 100,
          transition: 'width 0.1s ease-out',
        }}
      />

      <div className="container reading-container">
        {/* Navigation Breadcrumbs & Share */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.25rem' }}>
          <Link
            to="/blogs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.885rem', fontWeight: 600, color: 'var(--color-slate-600)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Commentary</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--color-slate-200)', backgroundColor: '#FFFFFF' }}
          >
            {copied ? <Check size={14} color="var(--color-emerald)" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied' : 'Share Note'}</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="reading-header">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-navy">{post.regulatorTag}</span>
            {post.intermediaryTag && <span className="badge badge-slate">{post.intermediaryTag}</span>}
            <span className="badge badge-slate" style={{ textTransform: 'capitalize' }}>
              {post.type === 'regulatory_note' ? 'Regulatory Memorandum' : 'Long-Form Essay'}
            </span>
          </div>

          <h1 className="reading-title">{post.title}</h1>

          <div className="reading-meta-bar">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              <span>{post.readTime || '5 min read'}</span>
            </span>
            <span>•</span>
            <span>By Niyam Insights Editorial Research</span>
          </div>
        </header>

        {/* Download PDF Memorandum Box if Attached */}
        {post.pdfUrl && (
          <div
            style={{
              backgroundColor: 'var(--bg-parchment)',
              border: '1px solid var(--bg-parchment-border)',
              borderLeft: '4px solid var(--color-navy)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.35rem 1.75rem',
              marginBottom: '2.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={24} color="var(--color-navy)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-navy-dark)', fontSize: '0.975rem' }}>
                  Institutional Memorandum (PDF) Available
                </div>
                <div style={{ fontSize: '0.835rem', color: 'var(--color-slate-600)' }}>
                  Download a clean, unbranded PDF copy of this note for compliance files and committee archival.
                </div>
              </div>
            </div>

            <a
              href={post.pdfUrl}
              download
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <Download size={14} />
              <span>Download PDF Note</span>
            </a>
          </div>
        )}

        {/* Featured Image if present */}
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="reading-hero-img"
          />
        )}

        {/* Main Prose Content */}
        <div className="reading-prose">
          {renderFormattedContent(post.content)}
        </div>

        {/* Bottom Institutional Seal & Return Strip */}
        <div
          style={{
            marginTop: '4.5rem',
            paddingTop: '2.25rem',
            borderTop: '1px solid var(--color-slate-200)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
            <ShieldCheck size={16} color="var(--color-navy)" />
            <span>Niyam Insights curates and explains publicly available regulatory information for educational and informational purposes.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/blogs" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} />
              <span>All Articles & Notes</span>
            </Link>
            <Link to={`/regulator/${post.regulatorId || 'sebi'}`} className="btn btn-primary btn-sm">
              <span>Explore {post.regulatorTag || 'SEBI'} Repository</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

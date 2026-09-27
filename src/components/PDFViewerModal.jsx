import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

export default function PDFViewerModal({ isOpen, onClose, docTitle, pdfUrl, externalUrl }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '850px', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--color-slate-200)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <FileText size={20} color="var(--color-navy)" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--color-navy-dark)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {docTitle || 'Regulatory Document Preview'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>
            )}
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink size={14} />
                <span>Original Link</span>
              </a>
            )}
            <button
              type="button"
              className="modal-close-btn"
              style={{ position: 'static' }}
              onClick={onClose}
              aria-label="Close PDF Viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewer iframe or fallback */}
        <div style={{ flex: 1, backgroundColor: '#F1F5F9', position: 'relative' }}>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={docTitle}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <FileText size={48} color="var(--color-slate-400)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-slate-700)', marginBottom: '0.5rem' }}>
                Document Available on Regulator Portal
              </h3>
              <p style={{ color: 'var(--color-slate-500)', maxWidth: '400px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                This regulatory document is indexed directly from the statutory regulator portal.
              </p>
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <ExternalLink size={16} />
                  <span>Open Official Document on Regulator Portal</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

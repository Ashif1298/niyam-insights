import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Shield, BookOpen, Layers, Settings, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onOpenSearch }) {
  const location = useLocation();
  const [regulators, setRegulators] = useState([]);
  const [regulatorDropdownOpen, setRegulatorDropdownOpen] = useState(false);

  useEffect(() => {
    api.getRegulators()
      .then((data) => setRegulators(data.filter((r) => r.isPublished)))
      .catch((err) => console.error('Failed to load regulators:', err));
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-link" aria-label="Niyam Insights Home">
          <img src="/logo.svg" alt="Niyam Insights" className="brand-logo-img" />
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Primary Navigation">
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>

            {/* Regulators Dropdown / Dynamic List */}
            <li
              style={{ position: 'relative' }}
              onMouseEnter={() => setRegulatorDropdownOpen(true)}
              onMouseLeave={() => setRegulatorDropdownOpen(false)}
            >
              <button
                type="button"
                className={`nav-link ${location.pathname.startsWith('/regulator') ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setRegulatorDropdownOpen(!regulatorDropdownOpen)}
                aria-expanded={regulatorDropdownOpen}
              >
                Regulators <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: regulatorDropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {regulatorDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-slate-200)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '220px',
                    padding: '0.5rem 0',
                    zIndex: 60,
                    animation: 'fadeIn 120ms ease-out',
                  }}
                >
                  {regulators.map((reg) => (
                    <Link
                      key={reg.id}
                      to={`/regulator/${reg.slug}`}
                      className="dropdown-item"
                      onClick={() => setRegulatorDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'var(--color-slate-800)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-slate-50)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>{reg.shortName} <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', fontWeight: 'normal' }}>({reg.name.split(' ')[0]})</span></span>
                      <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>{reg.shortName}</span>
                    </Link>
                  ))}
                  {regulators.length === 0 && (
                    <div style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
                      Loading regulators...
                    </div>
                  )}
                </div>
              )}
            </li>

            <li>
              <Link to="/blogs" className={`nav-link ${isActive('/blogs') ? 'active' : ''}`}>
                Blogs & Notes
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action buttons: Search & Admin CMS */}
        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onOpenSearch}
            title="Search regulations and interpretations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem' }}
          >
            <Search size={15} color="var(--color-slate-600)" />
            <span style={{ fontSize: '0.825rem', color: 'var(--color-slate-500)' }}>Search</span>
            <kbd style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', background: 'var(--color-slate-100)', borderRadius: '3px', color: 'var(--color-slate-500)', border: '1px solid var(--color-slate-300)' }}>⌘K</kbd>
          </button>

          <Link to="/admin" className="btn btn-outline btn-sm" title="Admin Control Panel">
            <Settings size={14} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Building2,
  Users,
  FileText,
  BookOpen,
  Layers,
  Settings,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hierarchy'); // hierarchy | regulators | intermediaries | documents | interpretations | blogs | settings | backup

  // Core Data
  const [regulators, setRegulators] = useState([]);
  const [intermediaries, setIntermediaries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [interpretations, setInterpretations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});

  // Status & Notifications
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Modals / Form States
  const [editingRegulator, setEditingRegulator] = useState(null);
  const [editingIntermediary, setEditingIntermediary] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingInterpretation, setEditingInterpretation] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form Fields for new/edited items
  const [regForm, setRegForm] = useState({ name: '', shortName: '', slug: '', tagline: '', about: '', established: '', headquarters: '', website: '', themeColor: '#0D274D' });
  const [interForm, setInterForm] = useState({ regulatorId: 'sebi', name: '', shortCode: '', slug: '', description: '', minTicket: '', minNetWorth: '', regulationsYear: '', isActive: true });
  const [docForm, setDocForm] = useState({ regulatorId: 'sebi', intermediaryId: 'sebi-pms', category: 'Regulations', title: '', date: '', version: '', summary: '', pdfUrl: '', originalRegulatorUrl: '', isPublished: true });
  const [interpForm, setInterpForm] = useState({ regulatorId: 'sebi', intermediaryId: 'sebi-pms', title: '', summary: '', intent: '', practicalExpectations: '', governanceImpact: '', downloadPdfUrl: '' });
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', type: 'regulatory_note', regulatorTag: 'SEBI', intermediaryTag: 'PMS', date: '', excerpt: '', content: '', featuredImage: '', pdfUrl: '', metaTitle: '', metaDescription: '' });

  const notify = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [regs, inters, docs, interps, blgs, sets] = await Promise.all([
        api.getRegulators(),
        api.getIntermediaries(),
        api.getDocuments(),
        api.getInterpretations(),
        api.getBlogs(),
        api.getSettings(),
      ]);
      setRegulators(regs);
      setIntermediaries(inters);
      setDocuments(docs);
      setInterpretations(interps);
      setBlogs(blgs);
      setSiteSettings(sets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      notify('error', 'Failed to fetch some admin data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // File Upload Helper
  const handleFileUpload = async (e, onUrlReceived) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const res = await api.uploadFile(file);
      if (res.fileUrl) {
        onUrlReceived(res.fileUrl);
        notify('success', `File uploaded successfully: ${file.name}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      notify('error', 'File upload failed. Ensure it is a PDF or image.');
    } finally {
      setUploadingFile(false);
    }
  };

  // ==========================================
  // HANDLERS: REGULATORS
  // ==========================================
  const handleSaveRegulator = async (e) => {
    e.preventDefault();
    try {
      if (editingRegulator) {
        await api.updateRegulator(editingRegulator.id, regForm);
        notify('success', 'Regulator updated successfully');
      } else {
        await api.createRegulator(regForm);
        notify('success', 'New Regulator created successfully');
      }
      setEditingRegulator(null);
      setRegForm({ name: '', shortName: '', slug: '', tagline: '', about: '', established: '', headquarters: '', website: '', themeColor: '#0D274D' });
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleDeleteRegulator = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" and all its intermediaries & documents?`)) return;
    try {
      await api.deleteRegulator(id);
      notify('success', `Regulator ${name} deleted.`);
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  // ==========================================
  // HANDLERS: INTERMEDIARIES
  // ==========================================
  const handleSaveIntermediary = async (e) => {
    e.preventDefault();
    try {
      if (editingIntermediary) {
        await api.updateIntermediary(editingIntermediary.id, interForm);
        notify('success', 'Intermediary updated');
      } else {
        await api.createIntermediary(interForm);
        notify('success', 'Intermediary regime created');
      }
      setEditingIntermediary(null);
      setInterForm({ regulatorId: 'sebi', name: '', shortCode: '', slug: '', description: '', minTicket: '', minNetWorth: '', regulationsYear: '', isActive: true });
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleDeleteIntermediary = async (id, name) => {
    if (!window.confirm(`Delete intermediary "${name}"?`)) return;
    try {
      await api.deleteIntermediary(id);
      notify('success', `Intermediary ${name} deleted.`);
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const toggleIntermediaryActive = async (item) => {
    try {
      await api.updateIntermediary(item.id, { isActive: !item.isActive });
      notify('success', `Intermediary "${item.name}" marked as ${!item.isActive ? 'Active' : 'Backend Ready'}`);
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  // ==========================================
  // HANDLERS: DOCUMENTS
  // ==========================================
  const handleSaveDocument = async (e) => {
    e.preventDefault();
    try {
      if (editingDoc) {
        await api.updateDocument(editingDoc.id, docForm);
        notify('success', 'Regulatory document updated');
      } else {
        await api.createDocument(docForm);
        notify('success', 'Regulatory document indexed');
      }
      setEditingDoc(null);
      setDocForm({ regulatorId: 'sebi', intermediaryId: 'sebi-pms', category: 'Regulations', title: '', date: '', version: '', summary: '', pdfUrl: '', originalRegulatorUrl: '', isPublished: true });
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleDeleteDocument = async (id, title) => {
    if (!window.confirm(`Delete document "${title}"?`)) return;
    try {
      await api.deleteDocument(id);
      notify('success', 'Document deleted.');
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  // ==========================================
  // HANDLERS: INTERPRETATIONS
  // ==========================================
  const handleSaveInterpretation = async (e) => {
    e.preventDefault();
    try {
      await api.saveInterpretation(interpForm);
      notify('success', 'Niyam Interpretation commentary updated');
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  // ==========================================
  // HANDLERS: BLOGS & NOTES
  // ==========================================
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await api.updateBlog(editingBlog.id, blogForm);
        notify('success', 'Post updated');
      } else {
        await api.createBlog(blogForm);
        notify('success', 'New article/note published');
      }
      setEditingBlog(null);
      setBlogForm({ title: '', slug: '', type: 'regulatory_note', regulatorTag: 'SEBI', intermediaryTag: 'PMS', date: '', excerpt: '', content: '', featuredImage: '', pdfUrl: '', metaTitle: '', metaDescription: '' });
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.deleteBlog(id);
      notify('success', 'Post deleted.');
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  // ==========================================
  // HANDLERS: SETTINGS & DATABASE BACKUP
  // ==========================================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(siteSettings);
      notify('success', 'Site copy & settings updated');
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleImportJson = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.importDatabase(parsed);
      notify('success', 'Database successfully imported from JSON');
      loadAllData();
    } catch (err) {
      notify('error', `Import failed: ${err.message}`);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset entire database to clean default initial regulatory seeds?')) return;
    try {
      await api.resetDatabase();
      notify('success', 'Database reset to initial regulatory data.');
      loadAllData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Admin Top Banner */}
      <div className="admin-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>
                Regulatory Content Management System
              </span>
              <h1 className="admin-header-title">Niyam Insights Admin Control Center</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={loadAllData}
              >
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>
              <Link to="/" target="_blank" className="btn btn-sm btn-primary" style={{ backgroundColor: '#FFF', color: 'var(--color-navy-dark)', border: 'none' }}>
                <Eye size={13} />
                <span>View Live Site</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-nav-tabs">
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'hierarchy' ? 'active' : ''}`}
              onClick={() => setActiveTab('hierarchy')}
            >
              <FolderTree size={16} />
              <span>Visual Tree Explorer</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'regulators' ? 'active' : ''}`}
              onClick={() => setActiveTab('regulators')}
            >
              <Building2 size={16} />
              <span>Regulators ({regulators.length})</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'intermediaries' ? 'active' : ''}`}
              onClick={() => setActiveTab('intermediaries')}
            >
              <Users size={16} />
              <span>Intermediaries ({intermediaries.length})</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText size={16} />
              <span>Regulatory Documents ({documents.length})</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'interpretations' ? 'active' : ''}`}
              onClick={() => setActiveTab('interpretations')}
            >
              <BookOpen size={16} />
              <span>Niyam Interpretations</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              <Layers size={16} />
              <span>Blogs & Notes ({blogs.length})</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} />
              <span>Home & Disclaimer Copy</span>
            </button>
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'backup' ? 'active' : ''}`}
              onClick={() => setActiveTab('backup')}
            >
              <Download size={16} />
              <span>Export / Migrate DB</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '1.5rem' }}>
        {/* Toast / Status Alert */}
        {statusMsg.text && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: statusMsg.type === 'error' ? '#FDE8E8' : '#DEF7EC',
              color: statusMsg.type === 'error' ? '#9B1C1C' : '#03543F',
              border: `1px solid ${statusMsg.type === 'error' ? '#F8B4B4' : '#BCF0DA'}`,
              animation: 'fadeIn 0.2s',
            }}
          >
            {statusMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{statusMsg.text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: VISUAL HIERARCHY TREE EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'hierarchy' && (
          <div className="admin-panel">
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy-dark)' }}>
                Deep Hierarchy Architecture Explorer
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', margin: '0.25rem 0 0' }}>
                Visualizing the multi-tier regulatory taxonomy: Regulator ➔ Intermediary ➔ Documents / Interpretations / Notes.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
              {regulators.map((reg) => {
                const regIntermediaries = intermediaries.filter((i) => i.regulatorId === reg.id);
                return (
                  <div key={reg.id} style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Building2 size={20} color="var(--color-navy)" />
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-navy)' }}>
                        {reg.name} ({reg.shortName})
                      </strong>
                      <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>Regulator</span>
                      <Link to={`/regulator/${reg.slug}`} target="_blank" style={{ fontSize: '0.775rem', color: 'var(--color-blue-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <span>Preview</span> <ExternalLink size={11} />
                      </Link>
                    </div>

                    {regIntermediaries.map((inter) => {
                      const interDocs = documents.filter((d) => d.intermediaryId === inter.id);
                      const interInterp = interpretations.find((i) => i.intermediaryId === inter.id);
                      const interBlogs = blogs.filter((b) => b.intermediaryTag?.toUpperCase() === inter.shortCode?.toUpperCase() || b.intermediaryId === inter.id);

                      return (
                        <div key={inter.id} className="tree-node">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Users size={16} color="var(--color-slate-700)" />
                            <strong style={{ fontSize: '0.975rem', color: 'var(--color-slate-800)' }}>
                              {inter.name}
                            </strong>
                            {inter.isActive ? (
                              <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Active</span>
                            ) : (
                              <span className="badge badge-inactive" style={{ fontSize: '0.65rem' }}>Backend Ready</span>
                            )}
                          </div>

                          <div className="tree-node" style={{ fontSize: '0.875rem' }}>
                            {/* Documents branch */}
                            <div style={{ marginBottom: '0.4rem', color: 'var(--color-slate-600)' }}>
                              <FileText size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                              <strong>Regulatory Documents ({interDocs.length}): </strong>
                              {interDocs.map((d) => d.title).slice(0, 3).join(', ')}
                              {interDocs.length > 3 && ` +${interDocs.length - 3} more`}
                            </div>

                            {/* Interpretation branch */}
                            <div style={{ marginBottom: '0.4rem', color: 'var(--color-slate-600)' }}>
                              <BookOpen size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                              <strong>Niyam Interpretation: </strong>
                              {interInterp ? <span style={{ color: 'var(--color-emerald)' }}>Configured ({interInterp.title})</span> : <span style={{ color: 'var(--color-slate-400)' }}>Draft Pending</span>}
                            </div>

                            {/* Blogs & Notes branch */}
                            <div style={{ color: 'var(--color-slate-600)' }}>
                              <Layers size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                              <strong>Linked Regulatory Notes & Blogs ({interBlogs.length}): </strong>
                              {interBlogs.map((b) => b.title).slice(0, 2).join(', ') || 'None yet'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REGULATORS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'regulators' && (
          <div className="admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)' }}>
                Regulators Manager (Add Unlimited Authorities)
              </h2>
            </div>

            {/* List */}
            <div style={{ marginBottom: '2.5rem' }}>
              {regulators.map((reg) => (
                <div
                  key={reg.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-navy">{reg.shortName}</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>{reg.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', marginTop: '0.25rem' }}>
                      Slug: <code>/regulator/{reg.slug}</code> • Headquarters: {reg.headquarters || 'N/A'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setEditingRegulator(reg);
                        setRegForm(reg);
                      }}
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#E02424' }}
                      onClick={() => handleDeleteRegulator(reg.id, reg.name)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add / Edit Form */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-slate-300)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                {editingRegulator ? `Edit Regulator: ${editingRegulator.name}` : 'Add New Regulator Authority'}
              </h3>
              <form onSubmit={handleSaveRegulator}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Authority Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Reserve Bank of India"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Acronym *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. RBI"
                      value={regForm.shortName}
                      onChange={(e) => setRegForm({ ...regForm, shortName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">URL Slug *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. rbi"
                      value={regForm.slug}
                      onChange={(e) => setRegForm({ ...regForm, slug: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Official Website URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={regForm.website}
                      onChange={(e) => setRegForm({ ...regForm, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline / Mission</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Short description..."
                    value={regForm.tagline}
                    onChange={(e) => setRegForm({ ...regForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">About Regulator (Overview Text)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Detailed introductory background..."
                    value={regForm.about}
                    onChange={(e) => setRegForm({ ...regForm, about: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  {editingRegulator && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingRegulator(null);
                        setRegForm({ name: '', shortName: '', slug: '', tagline: '', about: '', established: '', headquarters: '', website: '', themeColor: '#0D274D' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    <Plus size={15} />
                    <span>{editingRegulator ? 'Update Regulator' : 'Create Regulator'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INTERMEDIARIES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'intermediaries' && (
          <div className="admin-panel">
            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)', marginBottom: '1.5rem' }}>
              Intermediaries Manager (PMS, IA, RA, AIF, FME & Custom Regimes)
            </h2>

            {/* List */}
            <div style={{ marginBottom: '2.5rem' }}>
              {intermediaries.map((item) => {
                const parentReg = regulators.find((r) => r.id === item.regulatorId);
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1.25rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-navy">{parentReg?.shortName || item.regulatorId}</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)' }}>{item.name}</strong>
                        {item.isActive ? (
                          <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Active</span>
                        ) : (
                          <span className="badge badge-inactive" style={{ fontSize: '0.65rem' }}>Backend Ready</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', marginTop: '0.25rem' }}>
                        Code: <code>{item.shortCode}</code> • Min Net Worth: {item.minNetWorth || 'N/A'} • Min Ticket: {item.minTicket || 'N/A'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${item.isActive ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => toggleIntermediaryActive(item)}
                      >
                        {item.isActive ? 'Set Backend-Ready' : 'Activate Regime'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setEditingIntermediary(item);
                          setInterForm(item);
                        }}
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#E02424' }}
                        onClick={() => handleDeleteIntermediary(item.id, item.name)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-slate-300)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                {editingIntermediary ? `Edit Intermediary: ${editingIntermediary.name}` : 'Add New Intermediary Licence Regime'}
              </h3>
              <form onSubmit={handleSaveIntermediary}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Parent Regulator Authority *</label>
                    <select
                      className="form-select"
                      value={interForm.regulatorId}
                      onChange={(e) => setInterForm({ ...interForm, regulatorId: e.target.value })}
                      required
                    >
                      {regulators.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.shortName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Intermediary Regime Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Custodian of Securities"
                      value={interForm.name}
                      onChange={(e) => setInterForm({ ...interForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Short Acronym / Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CUST"
                      value={interForm.shortCode}
                      onChange={(e) => setInterForm({ ...interForm, shortCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL Slug *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. custodian"
                      value={interForm.slug}
                      onChange={(e) => setInterForm({ ...interForm, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Minimum Investment Ticket</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ₹50 Lakhs"
                      value={interForm.minTicket}
                      onChange={(e) => setInterForm({ ...interForm, minTicket: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Capital Adequacy (Net Worth)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ₹5 Crores"
                      value={interForm.minNetWorth}
                      onChange={(e) => setInterForm({ ...interForm, minNetWorth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Brief description of the intermediary mandate..."
                    value={interForm.description}
                    onChange={(e) => setInterForm({ ...interForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  {editingIntermediary && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingIntermediary(null);
                        setInterForm({ regulatorId: 'sebi', name: '', shortCode: '', slug: '', description: '', minTicket: '', minNetWorth: '', regulationsYear: '', isActive: true });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    <Plus size={15} />
                    <span>{editingIntermediary ? 'Save Changes' : 'Create Intermediary'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REGULATORY DOCUMENTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'documents' && (
          <div className="admin-panel">
            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)', marginBottom: '1.5rem' }}>
              Regulatory Documents CMS (Regulations, Master Circulars, Circulars)
            </h2>

            {/* List */}
            <div style={{ marginBottom: '2.5rem' }}>
              {documents.map((doc) => {
                const parentReg = regulators.find((r) => r.id === doc.regulatorId);
                const parentInter = intermediaries.find((i) => i.id === doc.intermediaryId);
                return (
                  <div
                    key={doc.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1.25rem',
                      marginBottom: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="badge badge-navy">{parentReg?.shortName || doc.regulatorId}</span>
                        <span className="badge badge-slate">{parentInter?.shortCode || doc.intermediaryId}</span>
                        <span className="badge badge-slate" style={{ fontWeight: 700 }}>{doc.category}</span>
                        <strong style={{ fontSize: '1rem', color: 'var(--color-navy-dark)', marginLeft: '0.25rem' }}>{doc.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-slate-500)', marginTop: '0.25rem' }}>
                        Date: {doc.date} • Version: {doc.version || 'Standard'} • PDF: {doc.pdfUrl ? 'Attached' : 'External Link Only'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setEditingDoc(doc);
                          setDocForm(doc);
                        }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#E02424' }}
                        onClick={() => handleDeleteDocument(doc.id, doc.title)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-slate-300)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                {editingDoc ? `Edit Regulatory Document: ${editingDoc.title}` : 'Index New Regulatory Document'}
              </h3>
              <form onSubmit={handleSaveDocument}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Regulator Authority *</label>
                    <select
                      className="form-select"
                      value={docForm.regulatorId}
                      onChange={(e) => setDocForm({ ...docForm, regulatorId: e.target.value })}
                      required
                    >
                      {regulators.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.shortName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Intermediary Regime *</label>
                    <select
                      className="form-select"
                      value={docForm.intermediaryId}
                      onChange={(e) => setDocForm({ ...docForm, intermediaryId: e.target.value })}
                      required
                    >
                      {intermediaries.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.shortCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={docForm.category}
                      onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                      required
                    >
                      <option value="Regulations">Regulations</option>
                      <option value="Master Circulars">Master Circulars</option>
                      <option value="Circulars">Circulars</option>
                      <option value="Guidelines">Guidelines</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issue Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={docForm.date}
                      onChange={(e) => setDocForm({ ...docForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SEBI (Portfolio Managers) Regulations, 2020"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Version / Notification Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Principal (as amended up to Dec 2023)"
                      value={docForm.version}
                      onChange={(e) => setDocForm({ ...docForm, version: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Statutory Regulator Link</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.sebi.gov.in/..."
                      value={docForm.originalRegulatorUrl}
                      onChange={(e) => setDocForm({ ...docForm, originalRegulatorUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* PDF File Upload */}
                <div className="form-group">
                  <label className="form-label">Upload Document PDF</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, (url) => setDocForm({ ...docForm, pdfUrl: url }))}
                      disabled={uploadingFile}
                    />
                    {docForm.pdfUrl && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                        PDF Attached: {docForm.pdfUrl}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Summary / Scope</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Brief explanation of statutory scope..."
                    value={docForm.summary}
                    onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  {editingDoc && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingDoc(null);
                        setDocForm({ regulatorId: 'sebi', intermediaryId: 'sebi-pms', category: 'Regulations', title: '', date: '', version: '', summary: '', pdfUrl: '', originalRegulatorUrl: '', isPublished: true });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    <Plus size={15} />
                    <span>{editingDoc ? 'Update Document' : 'Save Document'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: NIYAM INTERPRETATIONS CMS */}
        {/* ========================================================================= */}
        {activeTab === 'interpretations' && (
          <div className="admin-panel">
            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)', marginBottom: '0.5rem' }}>
              Niyam Insights Analytical Interpretation CMS
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '1.75rem' }}>
              Author structured editorial commentary explaining regulatory intent vs practical supervisory expectations.
            </p>

            <form onSubmit={handleSaveInterpretation}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Select Intermediary Regime to Edit Interpretation *</label>
                  <select
                    className="form-select"
                    value={interpForm.intermediaryId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const inter = intermediaries.find((i) => i.id === selectedId);
                      const existing = interpretations.find((i) => i.intermediaryId === selectedId);
                      if (existing) {
                        setInterpForm(existing);
                      } else {
                        setInterpForm({
                          regulatorId: inter ? inter.regulatorId : 'sebi',
                          intermediaryId: selectedId,
                          title: `Niyam Insights: Operating Framework & Supervisory Expectations for ${inter ? inter.name : ''}`,
                          summary: '',
                          intent: '',
                          practicalExpectations: '',
                          governanceImpact: '',
                          downloadPdfUrl: '',
                        });
                      }
                    }}
                    required
                  >
                    {intermediaries.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.shortCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Interpretation Editorial Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={interpForm.title}
                    onChange={(e) => setInterpForm({ ...interpForm, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Executive Analytical Summary</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="High-level synthesis..."
                  value={interpForm.summary}
                  onChange={(e) => setInterpForm({ ...interpForm, summary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">1. Regulatory Intent (Plain English / Non-Legal Explanation) *</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '160px' }}
                  placeholder="Explain why the regulator created this framework..."
                  value={interpForm.intent}
                  onChange={(e) => setInterpForm({ ...interpForm, intent: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">2. Practical Supervisory Expectations Observed in Practice *</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '160px' }}
                  placeholder="Audit focus areas, HWM calculations, fair allocation, onboarding expectations..."
                  value={interpForm.practicalExpectations}
                  onChange={(e) => setInterpForm({ ...interpForm, practicalExpectations: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">3. Operational Governance & Capital Adequacy Impact</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '120px' }}
                  placeholder="Principal officer qualification, compliance officer mandates, capital requirements..."
                  value={interpForm.governanceImpact}
                  onChange={(e) => setInterpForm({ ...interpForm, governanceImpact: e.target.value })}
                />
              </div>

              {/* Upload PDF */}
              <div className="form-group">
                <label className="form-label">Attach Downloadable Interpretation PDF (Optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, (url) => setInterpForm({ ...interpForm, downloadPdfUrl: url }))}
                />
                {interpForm.downloadPdfUrl && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald)', fontWeight: 600, display: 'block', marginTop: '0.35rem' }}>
                    Current Attachment: {interpForm.downloadPdfUrl}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  <CheckCircle size={16} />
                  <span>Save Interpretation Commentary</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BLOGS & REGULATORY NOTES CMS */}
        {/* ========================================================================= */}
        {activeTab === 'blogs' && (
          <div className="admin-panel">
            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)', marginBottom: '1.5rem' }}>
              Blogs & Regulatory Notes CMS
            </h2>

            {/* List */}
            <div style={{ marginBottom: '2.5rem' }}>
              {blogs.map((b) => (
                <div
                  key={b.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-navy">{b.regulatorTag}</span>
                      <span className="badge badge-slate">{b.intermediaryTag}</span>
                      <span className="badge badge-slate" style={{ textTransform: 'capitalize' }}>{b.type === 'regulatory_note' ? 'Regulatory Note' : 'Long-Form Blog'}</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-navy-dark)' }}>{b.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-slate-500)', marginTop: '0.25rem' }}>
                      Slug: <code>/blogs/{b.slug}</code> • Date: {b.date} • PDF: {b.pdfUrl ? 'Attached' : 'No'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/blogs/${b.slug}`} target="_blank" className="btn btn-ghost btn-sm">
                      <Eye size={13} />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setEditingBlog(b);
                        setBlogForm(b);
                      }}
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#E02424' }}
                      onClick={() => handleDeleteBlog(b.id, b.title)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-slate-300)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                {editingBlog ? `Edit Post: ${editingBlog.title}` : 'Create Article / Regulatory Note'}
              </h3>
              <form onSubmit={handleSaveBlog}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Article Section / Type *</label>
                    <select
                      className="form-select"
                      value={blogForm.type}
                      onChange={(e) => setBlogForm({ ...blogForm, type: e.target.value })}
                      required
                    >
                      <option value="regulatory_note">Section 1: Regulatory Note (Grid card with PDF Download)</option>
                      <option value="blog">Section 2: Long-Form Blog (Thought piece with featured image)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publication Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Regulator Tag (SEBI / IFSCA) *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. SEBI"
                      value={blogForm.regulatorTag}
                      onChange={(e) => setBlogForm({ ...blogForm, regulatorTag: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Intermediary Tag (PMS / IA / RA / AIF / FME) *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. PMS"
                      value={blogForm.intermediaryTag}
                      onChange={(e) => setBlogForm({ ...blogForm, intermediaryTag: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Article Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Managing Conflicts in Affiliated Brokerage Routing"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Excerpt / Short Description *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '80px' }}
                    placeholder="2-3 sentence overview..."
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Article Prose (Markdown & Headings Supported) *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '260px', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}
                    placeholder="Write article body..."
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Attach PDF Memorandum (Optional)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, (url) => setBlogForm({ ...blogForm, pdfUrl: url }))}
                    />
                    {blogForm.pdfUrl && <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', display: 'block', marginTop: '0.2rem' }}>PDF: {blogForm.pdfUrl}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Featured Image URL / Upload</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://... or upload image"
                      value={blogForm.featuredImage}
                      onChange={(e) => setBlogForm({ ...blogForm, featuredImage: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  {editingBlog && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogForm({ title: '', slug: '', type: 'regulatory_note', regulatorTag: 'SEBI', intermediaryTag: 'PMS', date: '', excerpt: '', content: '', featuredImage: '', pdfUrl: '', metaTitle: '', metaDescription: '' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    <Plus size={15} />
                    <span>{editingBlog ? 'Update Post' : 'Publish Post'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: HOME & DISCLAIMER CONTENT CMS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="admin-panel">
            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)', marginBottom: '0.5rem' }}>
              Home Page & Disclaimer Text Editor
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '1.5rem' }}>
              Update definition, pronunciation, section summaries, and institutional disclaimers without writing code.
            </p>

            <form onSubmit={handleSaveSettings}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Platform Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={siteSettings.siteName || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={siteSettings.tagline || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phonetic Pronunciation Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={siteSettings.definitionPronunciation || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, definitionPronunciation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Above-the-Fold Tight Definition Paragraph</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '90px' }}
                  value={siteSettings.definitionParagraph || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, definitionParagraph: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section 1: "Why Niyam Insights Exists" (Full Text)</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  value={siteSettings.whyItExistsFull || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, whyItExistsFull: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section 2: "What Niyam Insights Does" (Full Text)</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  value={siteSettings.whatItDoesFull || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, whatItDoesFull: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section 3: "Who This is For" (Full Text)</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  value={siteSettings.whoItIsForFull || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, whoItIsForFull: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Institutional Disclaimer Text</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  value={siteSettings.disclaimerFull || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, disclaimerFull: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  <CheckCircle size={16} />
                  <span>Save Site Copy Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: BACKUP & DATABASE MIGRATION */}
        {/* ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="admin-panel">
            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy-dark)', marginBottom: '0.5rem' }}>
              Database Portability, Migration & Backup
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '2rem' }}>
              100% vendor independence. Download complete database snapshots in standardized JSON or restore anytime.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  1. One-Click Backup Export
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem' }}>
                  Export all regulators, intermediaries, documents, interpretations, and blogs to a timestamped JSON file for migration to Laravel or Next.js.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => api.exportDatabase()}
                >
                  <Download size={15} />
                  <span>Download Complete Backup (.json)</span>
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  2. Restore / Import JSON Database
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem' }}>
                  Restore previously saved database snapshot directly into the repository.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ backgroundColor: '#FDF2F2', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #F8B4B4' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#9B1C1C', marginBottom: '0.5rem' }}>
                  3. Reset to Initial Seeds
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#771D1D', marginBottom: '1.25rem' }}>
                  Reset repository to fresh SEBI (PMS), IFSCA (FME) regulations and commentary.
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ borderColor: '#E02424', color: '#E02424' }}
                  onClick={handleResetDb}
                >
                  <RefreshCw size={14} />
                  <span>Reset to Default Regulatory Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

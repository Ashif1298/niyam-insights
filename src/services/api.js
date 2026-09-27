const API_BASE = '/api';

export const api = {
  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },
  updateSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Regulators
  getRegulators: async () => {
    const res = await fetch(`${API_BASE}/regulators`);
    if (!res.ok) throw new Error('Failed to fetch regulators');
    return res.json();
  },
  getRegulator: async (slug) => {
    const res = await fetch(`${API_BASE}/regulators/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch regulator');
    return res.json();
  },
  createRegulator: async (data) => {
    const res = await fetch(`${API_BASE}/regulators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create regulator');
    return res.json();
  },
  updateRegulator: async (id, data) => {
    const res = await fetch(`${API_BASE}/regulators/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update regulator');
    return res.json();
  },
  deleteRegulator: async (id) => {
    const res = await fetch(`${API_BASE}/regulators/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete regulator');
    return res.json();
  },

  // Intermediaries
  getIntermediaries: async (regulatorId) => {
    const url = regulatorId ? `${API_BASE}/intermediaries?regulatorId=${regulatorId}` : `${API_BASE}/intermediaries`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch intermediaries');
    return res.json();
  },
  createIntermediary: async (data) => {
    const res = await fetch(`${API_BASE}/intermediaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create intermediary');
    return res.json();
  },
  updateIntermediary: async (id, data) => {
    const res = await fetch(`${API_BASE}/intermediaries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update intermediary');
    return res.json();
  },
  deleteIntermediary: async (id) => {
    const res = await fetch(`${API_BASE}/intermediaries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete intermediary');
    return res.json();
  },

  // Regulatory Documents
  getDocuments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/documents?${query}`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },
  createDocument: async (data) => {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create document');
    return res.json();
  },
  updateDocument: async (id, data) => {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update document');
    return res.json();
  },
  deleteDocument: async (id) => {
    const res = await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },

  // Interpretations
  getInterpretations: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/interpretations?${query}`);
    if (!res.ok) throw new Error('Failed to fetch interpretations');
    return res.json();
  },
  getInterpretationForIntermediary: async (intermediaryId) => {
    const res = await fetch(`${API_BASE}/interpretations/${intermediaryId}`);
    if (!res.ok) throw new Error('Failed to fetch interpretation');
    return res.json();
  },
  saveInterpretation: async (data) => {
    const res = await fetch(`${API_BASE}/interpretations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save interpretation');
    return res.json();
  },

  // Blogs & Regulatory Notes
  getBlogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/blogs?${query}`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },
  getBlogBySlug: async (slug) => {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  },
  createBlog: async (data) => {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog post');
    return res.json();
  },
  updateBlog: async (id, data) => {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog post');
    return res.json();
  },
  deleteBlog: async (id) => {
    const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog post');
    return res.json();
  },

  // Search
  search: async (q) => {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('File upload failed');
    return res.json();
  },

  // Admin DB Backup & Restore
  exportDatabase: () => {
    window.location.href = `${API_BASE}/admin/export`;
  },
  importDatabase: async (jsonData) => {
    const res = await fetch(`${API_BASE}/admin/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData),
    });
    if (!res.ok) throw new Error('Failed to import database');
    return res.json();
  },
  resetDatabase: async () => {
    const res = await fetch(`${API_BASE}/admin/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset database');
    return res.json();
  },
};

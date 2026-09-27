import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { initialData } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Vercel serverless, use /tmp or os.tmpdir(), otherwise use local data directory
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless ? path.join(os.tmpdir(), 'niyam-data') : path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create data dir:', e.message);
}

// In-memory cache
let dbCache = null;

function readDB() {
  if (dbCache) return dbCache;

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      dbCache = JSON.parse(data);
      return dbCache;
    }
  } catch (err) {
    console.error('Error reading DB from file, falling back to initial data:', err);
  }

  // Initialize with seed data
  dbCache = JSON.parse(JSON.stringify(initialData));
  try {
    saveDB(dbCache);
  } catch (e) {}
  return dbCache;
}

function saveDB(data) {
  try {
    dbCache = data;
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error saving DB to disk (in-memory will persist for invocation):', err.message);
    dbCache = data;
    return true;
  }
}

// Initialize on load
readDB();

export const db = {
  getSettings: () => {
    const data = readDB();
    return data.siteSettings || initialData.siteSettings;
  },
  updateSettings: (settings) => {
    const data = readDB();
    data.siteSettings = { ...data.siteSettings, ...settings };
    saveDB(data);
    return data.siteSettings;
  },

  getRegulators: () => {
    const data = readDB();
    return data.regulators || [];
  },
  getRegulatorBySlug: (slug) => {
    const data = readDB();
    return (data.regulators || []).find((r) => r.slug.toLowerCase() === slug.toLowerCase());
  },
  createRegulator: (regulator) => {
    const data = readDB();
    data.regulators = data.regulators || [];
    data.regulators.push(regulator);
    saveDB(data);
    return regulator;
  },
  updateRegulator: (id, updates) => {
    const data = readDB();
    const index = (data.regulators || []).findIndex((r) => r.id === id);
    if (index === -1) return null;
    data.regulators[index] = { ...data.regulators[index], ...updates, updatedAt: new Date().toISOString() };
    saveDB(data);
    return data.regulators[index];
  },
  deleteRegulator: (id) => {
    const data = readDB();
    data.regulators = (data.regulators || []).filter((r) => r.id !== id);
    data.intermediaries = (data.intermediaries || []).filter((i) => i.regulatorId !== id);
    data.documents = (data.documents || []).filter((d) => d.regulatorId !== id);
    data.interpretations = (data.interpretations || []).filter((i) => i.regulatorId !== id);
    saveDB(data);
    return true;
  },

  getIntermediaries: (regulatorId) => {
    const data = readDB();
    let items = data.intermediaries || [];
    if (regulatorId) {
      items = items.filter((i) => i.regulatorId === regulatorId);
    }
    return items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },
  getIntermediaryBySlug: (regulatorId, slug) => {
    const data = readDB();
    return (data.intermediaries || []).find(
      (i) => i.regulatorId === regulatorId && i.slug.toLowerCase() === slug.toLowerCase()
    );
  },
  getIntermediaryById: (id) => {
    const data = readDB();
    return (data.intermediaries || []).find((i) => i.id === id);
  },
  createIntermediary: (intermediary) => {
    const data = readDB();
    data.intermediaries = data.intermediaries || [];
    data.intermediaries.push(intermediary);
    saveDB(data);
    return intermediary;
  },
  updateIntermediary: (id, updates) => {
    const data = readDB();
    const index = (data.intermediaries || []).findIndex((i) => i.id === id);
    if (index === -1) return null;
    data.intermediaries[index] = { ...data.intermediaries[index], ...updates, updatedAt: new Date().toISOString() };
    saveDB(data);
    return data.intermediaries[index];
  },
  deleteIntermediary: (id) => {
    const data = readDB();
    data.intermediaries = (data.intermediaries || []).filter((i) => i.id !== id);
    data.documents = (data.documents || []).filter((d) => d.intermediaryId !== id);
    data.interpretations = (data.interpretations || []).filter((i) => i.intermediaryId !== id);
    saveDB(data);
    return true;
  },

  getDocuments: (filter = {}) => {
    const data = readDB();
    let docs = data.documents || [];
    if (filter.regulatorId) {
      docs = docs.filter((d) => d.regulatorId === filter.regulatorId);
    }
    if (filter.intermediaryId) {
      docs = docs.filter((d) => d.intermediaryId === filter.intermediaryId);
    }
    if (filter.category) {
      docs = docs.filter((d) => d.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.isPublished !== undefined) {
      docs = docs.filter((d) => d.isPublished === filter.isPublished);
    }
    return docs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  },
  getDocumentById: (id) => {
    const data = readDB();
    return (data.documents || []).find((d) => d.id === id);
  },
  createDocument: (doc) => {
    const data = readDB();
    data.documents = data.documents || [];
    data.documents.push(doc);
    saveDB(data);
    return doc;
  },
  updateDocument: (id, updates) => {
    const data = readDB();
    const index = (data.documents || []).findIndex((d) => d.id === id);
    if (index === -1) return null;
    data.documents[index] = { ...data.documents[index], ...updates, updatedAt: new Date().toISOString() };
    saveDB(data);
    return data.documents[index];
  },
  deleteDocument: (id) => {
    const data = readDB();
    data.documents = (data.documents || []).filter((d) => d.id !== id);
    saveDB(data);
    return true;
  },

  getInterpretations: (filter = {}) => {
    const data = readDB();
    let items = data.interpretations || [];
    if (filter.regulatorId) {
      items = items.filter((i) => i.regulatorId === filter.regulatorId);
    }
    if (filter.intermediaryId) {
      items = items.filter((i) => i.intermediaryId === filter.intermediaryId);
    }
    return items;
  },
  getInterpretationForIntermediary: (intermediaryId) => {
    const data = readDB();
    return (data.interpretations || []).find((i) => i.intermediaryId === intermediaryId);
  },
  saveInterpretation: (interp) => {
    const data = readDB();
    data.interpretations = data.interpretations || [];
    const index = data.interpretations.findIndex(
      (i) => i.id === interp.id || i.intermediaryId === interp.intermediaryId
    );
    if (index !== -1) {
      data.interpretations[index] = { ...data.interpretations[index], ...interp, updatedAt: new Date().toISOString() };
      saveDB(data);
      return data.interpretations[index];
    } else {
      data.interpretations.push({ ...interp, createdAt: new Date().toISOString() });
      saveDB(data);
      return interp;
    }
  },

  getBlogs: (filter = {}) => {
    const data = readDB();
    let items = data.blogs || [];
    if (filter.type) {
      items = items.filter((b) => b.type === filter.type);
    }
    if (filter.regulatorTag) {
      items = items.filter((b) => b.regulatorTag === filter.regulatorTag || b.regulatorId === filter.regulatorTag);
    }
    if (filter.intermediaryTag) {
      items = items.filter((b) => b.intermediaryTag === filter.intermediaryTag || b.intermediaryId === filter.intermediaryTag);
    }
    if (filter.isPublished !== undefined) {
      items = items.filter((b) => b.isPublished === filter.isPublished);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
          (b.content && b.content.toLowerCase().includes(q)) ||
          (b.regulatorTag && b.regulatorTag.toLowerCase().includes(q)) ||
          (b.intermediaryTag && b.intermediaryTag.toLowerCase().includes(q))
      );
    }
    return items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  },
  getBlogBySlug: (slug) => {
    const data = readDB();
    return (data.blogs || []).find((b) => b.slug === slug || b.id === slug);
  },
  createBlog: (blog) => {
    const data = readDB();
    data.blogs = data.blogs || [];
    data.blogs.push(blog);
    saveDB(data);
    return blog;
  },
  updateBlog: (id, updates) => {
    const data = readDB();
    const index = (data.blogs || []).findIndex((b) => b.id === id);
    if (index === -1) return null;
    data.blogs[index] = { ...data.blogs[index], ...updates, updatedAt: new Date().toISOString() };
    saveDB(data);
    return data.blogs[index];
  },
  deleteBlog: (id) => {
    const data = readDB();
    data.blogs = (data.blogs || []).filter((b) => b.id !== id);
    saveDB(data);
    return true;
  },

  searchAll: (query) => {
    if (!query || !query.trim()) return { documents: [], interpretations: [], blogs: [] };
    const q = query.toLowerCase().trim();
    const data = readDB();

    const documents = (data.documents || []).filter(
      (d) =>
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.summary && d.summary.toLowerCase().includes(q)) ||
        (d.category && d.category.toLowerCase().includes(q))
    );

    const interpretations = (data.interpretations || []).filter(
      (i) =>
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.intent && i.intent.toLowerCase().includes(q)) ||
        (i.practicalExpectations && i.practicalExpectations.toLowerCase().includes(q)) ||
        (i.governanceImpact && i.governanceImpact.toLowerCase().includes(q))
    );

    const blogs = (data.blogs || []).filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q))
    );

    return { documents, interpretations, blogs };
  },

  exportDatabase: () => readDB(),
  importDatabase: (newData) => {
    if (!newData || typeof newData !== 'object') throw new Error('Invalid database format');
    saveDB(newData);
    return true;
  },
  resetToInitial: () => {
    saveDB(JSON.parse(JSON.stringify(initialData)));
    return true;
  },
};

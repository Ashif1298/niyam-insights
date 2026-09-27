import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../server/db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Setup Multer for serverless /tmp or local uploads
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const UPLOAD_DIR = isServerless ? path.join(os.tmpdir(), 'niyam-uploads') : path.join(process.cwd(), 'public/uploads');

try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBaseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    cb(null, `${safeBaseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Settings
app.get('/api/settings', (req, res) => res.json(db.getSettings()));
app.put('/api/settings', (req, res) => res.json(db.updateSettings(req.body)));

// Regulators
app.get('/api/regulators', (req, res) => res.json(db.getRegulators()));
app.get('/api/regulators/:slug', (req, res) => {
  const regulator = db.getRegulatorBySlug(req.params.slug);
  if (!regulator) return res.status(404).json({ error: 'Regulator not found' });
  const intermediaries = db.getIntermediaries(regulator.id);
  res.json({ ...regulator, intermediaries });
});
app.post('/api/regulators', (req, res) => {
  const { name, shortName, slug, tagline, about, established, headquarters, website, themeColor, badgeColor, frameworks } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });
  const newReg = {
    id: slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    name,
    shortName: shortName || name,
    slug: slug.toLowerCase(),
    tagline: tagline || '',
    about: about || '',
    established: established || '',
    headquarters: headquarters || '',
    website: website || '',
    themeColor: themeColor || '#0D274D',
    badgeColor: badgeColor || '#1E3A8A',
    isPublished: true,
    frameworks: Array.isArray(frameworks) ? frameworks : [],
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(db.createRegulator(newReg));
});
app.put('/api/regulators/:id', (req, res) => {
  const updated = db.updateRegulator(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Regulator not found' });
  res.json(updated);
});
app.delete('/api/regulators/:id', (req, res) => {
  db.deleteRegulator(req.params.id);
  res.json({ success: true });
});

// Intermediaries
app.get('/api/intermediaries', (req, res) => {
  const { regulatorId } = req.query;
  res.json(db.getIntermediaries(regulatorId));
});
app.post('/api/intermediaries', (req, res) => {
  const { regulatorId, name, shortCode, slug, description, isActive, minTicket, minNetWorth, regulationsYear } = req.body;
  if (!regulatorId || !name || !slug) return res.status(400).json({ error: 'Regulator ID, name, slug required' });
  const id = `${regulatorId}-${slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;
  const newInter = {
    id,
    regulatorId,
    name,
    shortCode: shortCode || name,
    slug: slug.toLowerCase(),
    description: description || '',
    isActive: isActive !== undefined ? isActive : false,
    minTicket: minTicket || '',
    minNetWorth: minNetWorth || '',
    regulationsYear: regulationsYear || '',
    sortOrder: (db.getIntermediaries(regulatorId).length || 0) + 1,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(db.createIntermediary(newInter));
});
app.put('/api/intermediaries/:id', (req, res) => {
  const updated = db.updateIntermediary(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Intermediary not found' });
  res.json(updated);
});
app.delete('/api/intermediaries/:id', (req, res) => {
  db.deleteIntermediary(req.params.id);
  res.json({ success: true });
});

// Documents
app.get('/api/documents', (req, res) => {
  const { regulatorId, intermediaryId, category, isPublished } = req.query;
  res.json(
    db.getDocuments({
      regulatorId,
      intermediaryId,
      category,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
    })
  );
});
app.post('/api/documents', (req, res) => {
  const { regulatorId, intermediaryId, category, title, date, version, summary, pdfUrl, originalRegulatorUrl, isPublished } = req.body;
  if (!regulatorId || !intermediaryId || !title) return res.status(400).json({ error: 'Missing required document fields' });
  const newDoc = {
    id: `doc-${uuidv4().slice(0, 8)}`,
    regulatorId,
    intermediaryId,
    category: category || 'Circulars',
    title,
    date: date || new Date().toISOString().split('T')[0],
    version: version || '',
    summary: summary || '',
    pdfUrl: pdfUrl || '',
    originalRegulatorUrl: originalRegulatorUrl || '',
    isPublished: isPublished !== undefined ? isPublished : true,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(db.createDocument(newDoc));
});
app.put('/api/documents/:id', (req, res) => {
  const updated = db.updateDocument(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Document not found' });
  res.json(updated);
});
app.delete('/api/documents/:id', (req, res) => {
  db.deleteDocument(req.params.id);
  res.json({ success: true });
});

// Interpretations
app.get('/api/interpretations', (req, res) => {
  const { regulatorId, intermediaryId } = req.query;
  res.json(db.getInterpretations({ regulatorId, intermediaryId }));
});
app.get('/api/interpretations/:intermediaryId', (req, res) => {
  const item = db.getInterpretationForIntermediary(req.params.intermediaryId);
  res.json(item || null);
});
app.post('/api/interpretations', (req, res) => {
  const { id, regulatorId, intermediaryId, title, summary, intent, practicalExpectations, governanceImpact, sections, downloadPdfUrl, isPublished } = req.body;
  if (!intermediaryId || !title) return res.status(400).json({ error: 'Intermediary ID and Title required' });
  const interp = {
    id: id || `interp-${uuidv4().slice(0, 8)}`,
    regulatorId,
    intermediaryId,
    title,
    summary: summary || '',
    intent: intent || '',
    practicalExpectations: practicalExpectations || '',
    governanceImpact: governanceImpact || '',
    sections: Array.isArray(sections) ? sections : [],
    downloadPdfUrl: downloadPdfUrl || '',
    isPublished: isPublished !== undefined ? isPublished : true,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  res.json(db.saveInterpretation(interp));
});

// Blogs
app.get('/api/blogs', (req, res) => {
  const { type, regulatorTag, intermediaryTag, search, isPublished } = req.query;
  res.json(
    db.getBlogs({
      type,
      regulatorTag,
      intermediaryTag,
      search,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
    })
  );
});
app.get('/api/blogs/:slug', (req, res) => {
  const blog = db.getBlogBySlug(req.params.slug);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});
app.post('/api/blogs', (req, res) => {
  const { title, slug, type, regulatorId, intermediaryId, regulatorTag, intermediaryTag, date, excerpt, content, featuredImage, pdfUrl, metaTitle, metaDescription } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const autoSlug = (slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const words = (content || '').split(/\s+/).length;
  const newBlog = {
    id: `post-${uuidv4().slice(0, 8)}`,
    title,
    slug: autoSlug,
    type: type || 'regulatory_note',
    regulatorId: regulatorId || null,
    intermediaryId: intermediaryId || null,
    regulatorTag: regulatorTag || (regulatorId ? regulatorId.toUpperCase() : 'SEBI'),
    intermediaryTag: intermediaryTag || 'PMS',
    date: date || new Date().toISOString().split('T')[0],
    excerpt: excerpt || '',
    content: content || '',
    featuredImage: featuredImage || '',
    pdfUrl: pdfUrl || '',
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || excerpt || '',
    readTime: `${Math.max(1, Math.ceil(words / 180))} min read`,
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(db.createBlog(newBlog));
});
app.put('/api/blogs/:id', (req, res) => {
  const updated = db.updateBlog(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Post not found' });
  res.json(updated);
});
app.delete('/api/blogs/:id', (req, res) => {
  db.deleteBlog(req.params.id);
  res.json({ success: true });
});

// Search
app.get('/api/search', (req, res) => {
  res.json(db.searchAll(req.query.q || ''));
});

// DB Backup & Reset
app.get('/api/admin/export', (req, res) => {
  const data = db.exportDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=niyam-insights-backup-${Date.now()}.json`);
  res.send(JSON.stringify(data, null, 2));
});
app.post('/api/admin/import', (req, res) => {
  try {
    db.importDatabase(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post('/api/admin/reset', (req, res) => {
  db.resetToInitial();
  res.json({ success: true });
});

export default app;

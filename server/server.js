import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

// Setup Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
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
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg', '.svg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files (.png, .jpg, .jpeg, .svg, .webp) are allowed'));
    }
  },
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

// ==========================================
// SITE SETTINGS ROUTES
// ==========================================
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// ==========================================
// REGULATORS ROUTES
// ==========================================
app.get('/api/regulators', (req, res) => {
  res.json(db.getRegulators());
});

app.get('/api/regulators/:slug', (req, res) => {
  const regulator = db.getRegulatorBySlug(req.params.slug);
  if (!regulator) {
    return res.status(404).json({ error: 'Regulator not found' });
  }
  // Include associated intermediaries
  const intermediaries = db.getIntermediaries(regulator.id);
  res.json({ ...regulator, intermediaries });
});

app.post('/api/regulators', (req, res) => {
  const { name, shortName, slug, tagline, about, established, headquarters, website, themeColor, badgeColor, frameworks } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }
  const newRegulator = {
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
  const created = db.createRegulator(newRegulator);
  res.status(201).json(created);
});

app.put('/api/regulators/:id', (req, res) => {
  const updated = db.updateRegulator(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Regulator not found' });
  }
  res.json(updated);
});

app.delete('/api/regulators/:id', (req, res) => {
  db.deleteRegulator(req.params.id);
  res.json({ success: true });
});

// ==========================================
// INTERMEDIARIES ROUTES
// ==========================================
app.get('/api/intermediaries', (req, res) => {
  const { regulatorId } = req.query;
  res.json(db.getIntermediaries(regulatorId));
});

app.post('/api/intermediaries', (req, res) => {
  const { regulatorId, name, shortCode, slug, description, isActive, minTicket, minNetWorth, regulationsYear } = req.body;
  if (!regulatorId || !name || !slug) {
    return res.status(400).json({ error: 'Regulator ID, name, and slug are required' });
  }
  const id = `${regulatorId}-${slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;
  const newIntermediary = {
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
  const created = db.createIntermediary(newIntermediary);
  res.status(201).json(created);
});

app.put('/api/intermediaries/:id', (req, res) => {
  const updated = db.updateIntermediary(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Intermediary not found' });
  }
  res.json(updated);
});

app.delete('/api/intermediaries/:id', (req, res) => {
  db.deleteIntermediary(req.params.id);
  res.json({ success: true });
});

// ==========================================
// REGULATORY DOCUMENTS ROUTES
// ==========================================
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
  if (!regulatorId || !intermediaryId || !title) {
    return res.status(400).json({ error: 'Regulator ID, Intermediary ID, and Title are required' });
  }
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
  const created = db.createDocument(newDoc);
  res.status(201).json(created);
});

app.put('/api/documents/:id', (req, res) => {
  const updated = db.updateDocument(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(updated);
});

app.delete('/api/documents/:id', (req, res) => {
  db.deleteDocument(req.params.id);
  res.json({ success: true });
});

// ==========================================
// INTERPRETATIONS ROUTES
// ==========================================
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
  if (!intermediaryId || !title) {
    return res.status(400).json({ error: 'Intermediary ID and Title are required' });
  }
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
  const saved = db.saveInterpretation(interp);
  res.json(saved);
});

// ==========================================
// BLOGS & REGULATORY NOTES ROUTES
// ==========================================
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
  if (!blog) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json(blog);
});

app.post('/api/blogs', (req, res) => {
  const { title, slug, type, regulatorId, intermediaryId, regulatorTag, intermediaryTag, date, excerpt, content, featuredImage, pdfUrl, metaTitle, metaDescription } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const autoSlug = (slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const readWords = (content || '').split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(readWords / 180))} min read`;

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
    readTime,
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
  const created = db.createBlog(newBlog);
  res.status(201).json(created);
});

app.put('/api/blogs/:id', (req, res) => {
  const updated = db.updateBlog(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(updated);
});

app.delete('/api/blogs/:id', (req, res) => {
  db.deleteBlog(req.params.id);
  res.json({ success: true });
});

// ==========================================
// SEARCH & ADMIN BACKUP ROUTES
// ==========================================
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  res.json(db.searchAll(q || ''));
});

app.get('/api/admin/export', (req, res) => {
  const data = db.exportDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=niyam-insights-backup-${Date.now()}.json`);
  res.send(JSON.stringify(data, null, 2));
});

app.post('/api/admin/import', (req, res) => {
  try {
    db.importDatabase(req.body);
    res.json({ success: true, message: 'Database imported successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/reset', (req, res) => {
  db.resetToInitial();
  res.json({ success: true, message: 'Database reset to initial state' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Niyam Insights Express Server running on port ${PORT}`);
});

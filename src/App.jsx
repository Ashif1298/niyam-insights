import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DisclaimerModal from './components/DisclaimerModal';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import RegulatorPage from './pages/RegulatorPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './services/api';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const location = useLocation();
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [disclaimerFullText, setDisclaimerFullText] = useState('');

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    api.getSettings()
      .then((settings) => {
        if (settings?.disclaimerFull) setDisclaimerFullText(settings.disclaimerFull);
      })
      .catch((err) => console.error('Error fetching settings in layout:', err));
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setDisclaimerModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar onOpenSearch={() => setSearchModalOpen(true)} />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage onOpenDisclaimer={() => setDisclaimerModalOpen(true)} />} />
          <Route path="/regulator/:slug" element={<RegulatorPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogPostPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer onOpenDisclaimer={() => setDisclaimerModalOpen(true)} />}

      {/* Global Disclaimer Modal */}
      <DisclaimerModal
        isOpen={disclaimerModalOpen}
        onClose={() => setDisclaimerModalOpen(false)}
        fullText={disclaimerFullText}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

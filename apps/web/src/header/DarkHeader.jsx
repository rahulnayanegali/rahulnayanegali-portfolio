import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const DarkHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      style={{
        background: 'rgba(13,17,23,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '18px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Identity */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#e6edf3',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'baseline',
                gap: '5px',
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: '#3b82f6', fontFamily: "'Space Mono', monospace" }}
              >
                &gt;
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace" }}>Rahul Nayanegali</span>
              <span
                aria-hidden="true"
                className="cursor"
                style={{ color: '#3b82f6', fontFamily: "'Space Mono', monospace" }}
              >
                _
              </span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#8b949e',
                marginTop: '3px',
                letterSpacing: '0.03em',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Frontend Engineer
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex"
          style={{ alignItems: 'center', gap: '24px' }}
        >
          <ArchiveLink />
          <ResumeButton />
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', padding: '4px' }}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(13,17,23,0.97)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ArchiveLink mobile />
              <div style={{ paddingTop: '4px' }}>
                <ResumeButton mobile />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/** @param {{ mobile?: boolean }} props */
const ArchiveLink = ({ mobile }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href="/archived"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '0.82rem',
        color: hovered ? '#e6edf3' : '#8b949e',
        textDecoration: 'none',
        letterSpacing: '0.02em',
        transition: 'color 0.15s',
        ...(mobile ? { display: 'block', padding: '8px 0' } : {}),
      }}
    >
      Archive
    </a>
  );
};

/** @param {{ mobile?: boolean }} props */
const ResumeButton = ({ mobile }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href="https://rahulnayanegali.dev/resume/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '0.78rem',
        fontWeight: 600,
        color: hovered ? '#3b82f6' : '#e6edf3',
        background: 'transparent',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.15)'}`,
        textDecoration: 'none',
        padding: '6px 14px',
        borderRadius: '6px',
        letterSpacing: '0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'border-color 0.15s, color 0.15s',
        ...(mobile ? { width: '100%', justifyContent: 'center' } : {}),
      }}
    >
      Resume
      <span aria-hidden="true" style={{ fontSize: '0.7rem' }}>↗</span>
    </a>
  );
};

export default DarkHeader;

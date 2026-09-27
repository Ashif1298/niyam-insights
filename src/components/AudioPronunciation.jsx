import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPronunciation({ term = 'Niyam' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if (isPlaying) return;

    // Use Web Speech Synthesis if available
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        setIsPlaying(true);

        const utterance = new SpeechSynthesisUtterance('Nee-yum');
        utterance.rate = 0.85;
        utterance.pitch = 1.05;
        utterance.lang = 'en-IN'; // Indian English cadence for authentic pronunciation

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis error:', err);
        playFallbackChime();
      }
    } else {
      playFallbackChime();
    }
  };

  // Fallback pleasant Web Audio chime if speech is blocked
  const playFallbackChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 600);
      }
    } catch (e) {
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      className={`audio-btn ${isPlaying ? 'playing' : ''}`}
      onClick={speak}
      title="Listen to pronunciation: /ˈnɪ.yəm/ (nee-yum)"
      aria-label="Listen to pronunciation of Niyam"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.5rem',
        borderRadius: '999px',
        backgroundColor: isPlaying ? 'rgba(13, 39, 77, 0.12)' : 'rgba(255, 255, 255, 0.85)',
        border: '1px solid rgba(13, 39, 77, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <Volume2
        size={16}
        color={isPlaying ? 'var(--color-navy)' : 'var(--color-slate-600)'}
        style={{
          transform: isPlaying ? 'scale(1.15)' : 'none',
          transition: 'transform 0.2s ease',
        }}
      />
      {isPlaying ? (
        <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center', height: '12px' }}>
          <span className="soundwave-bar bar-1" />
          <span className="soundwave-bar bar-2" />
          <span className="soundwave-bar bar-3" />
        </span>
      ) : (
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy)', letterSpacing: '0.02em' }}>
          Listen
        </span>
      )}
    </button>
  );
}

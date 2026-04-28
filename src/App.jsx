import { useState } from 'react';
import Analyzer from './components/Analyzer.jsx';
import Writer from './components/Writer.jsx';

export default function App() {
  const [mode, setMode] = useState('analyzer');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-mark">♪</span>
            <div>
              <h1 className="brand-name">Country Song Workshop</h1>
              <p className="brand-sub">Modern country craft — analyze, write, create</p>
            </div>
          </div>
          <nav className="mode-toggle">
            <button
              className={`toggle-btn ${mode === 'analyzer' ? 'active' : ''}`}
              onClick={() => setMode('analyzer')}
            >
              Song Analyzer
            </button>
            <button
              className={`toggle-btn ${mode === 'writer' ? 'active' : ''}`}
              onClick={() => setMode('writer')}
            >
              Song Writer
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="mode-intro">
          {mode === 'analyzer' ? (
            <>
              <h2 className="mode-title">Song Analyzer</h2>
              <p className="mode-desc">
                Enter a song title and artist, then work through the guided worksheet — structure,
                hook, word choice, rhyme scheme, pacing, storytelling, and what makes it great.
                The framework is baked in; you bring the analysis.
              </p>
            </>
          ) : (
            <>
              <h2 className="mode-title">Song Writer</h2>
              <p className="mode-desc">
                Pick a structure template, write your lyrics section by section, and annotate your
                craft decisions. The app formats everything into a clean, exportable song sheet.
                No internet needed — just you and the page.
              </p>
            </>
          )}
        </div>

        {mode === 'analyzer' ? <Analyzer /> : <Writer />}
      </main>

      <footer className="app-footer">
        <p>Built for writers who take the craft seriously</p>
      </footer>
    </div>
  );
}

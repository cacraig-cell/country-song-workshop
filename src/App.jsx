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
                Enter any song title and artist. The workshop will break down exactly what makes it work —
                structure, hooks, rhyme scheme, pacing, storytelling, and the specific craft moves
                that make it land.
              </p>
            </>
          ) : (
            <>
              <h2 className="mode-title">Song Writer</h2>
              <p className="mode-desc">
                Tell the workshop your concept and it'll write a complete, full-draft country song
                in the style of modern blue-collar artists — with a structure guide, tone map, and
                annotated craft notes on every major decision.
              </p>
            </>
          )}
        </div>

        {mode === 'analyzer' ? <Analyzer /> : <Writer />}
      </main>

      <footer className="app-footer">
        <p>Powered by Claude · Built for writers who take the craft seriously</p>
      </footer>
    </div>
  );
}

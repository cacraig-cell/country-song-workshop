import { useState } from 'react';
import { analyzeSong } from '../utils/anthropic.js';
import AnalyzerResults from './AnalyzerResults.jsx';

export default function Analyzer() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeSong({ title: title.trim(), artist: artist.trim() });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="input-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="song-title">Song Title</label>
            <input
              id="song-title"
              type="text"
              placeholder="e.g. Fast Car"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="song-artist">Artist</label>
            <input
              id="song-artist"
              type="text"
              placeholder="e.g. Luke Combs"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !title.trim() || !artist.trim()}
        >
          {loading ? <span className="btn-loading"><span className="spinner" />Analyzing…</span> : 'Analyze Song'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {loading && (
        <div className="loading-state">
          <div className="loading-pulse" />
          <p>Pulling apart the song, line by line…</p>
        </div>
      )}
      {result && <AnalyzerResults data={result} />}
    </div>
  );
}

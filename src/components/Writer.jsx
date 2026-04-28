import { useState } from 'react';
import { writeSong } from '../utils/anthropic.js';
import WriterResults from './WriterResults.jsx';

const REFERENCE_ARTISTS = [
  'Luke Combs',
  'Morgan Wallen',
  'Kameron Marlow',
  'Tucker Wetmore',
  'Hudson Westbrook',
  'Jason Aldean',
  'Scotty McCreery',
];

export default function Writer() {
  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [existingLines, setExistingLines] = useState('');
  const [referenceArtist, setReferenceArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !concept.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await writeSong({
        title: title.trim(),
        concept: concept.trim(),
        existingLines,
        referenceArtist,
      });
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
        <div className="form-group">
          <label htmlFor="w-title">Song Title</label>
          <input
            id="w-title"
            type="text"
            placeholder="e.g. Gravel Road Home"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="w-concept">
            Your Concept
            <span className="label-hint">What do you want this song to be about?</span>
          </label>
          <textarea
            id="w-concept"
            rows={4}
            placeholder="e.g. A guy who left a small town to chase something better, and realizes years later that everything he was looking for was already back home — his girl, his people, his sense of who he is."
            value={concept}
            onChange={e => setConcept(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="w-lines">
            Lines or Phrases You Already Have
            <span className="label-hint">Optional — any seeds you want baked in</span>
          </label>
          <textarea
            id="w-lines"
            rows={3}
            placeholder='e.g. "mile marker 12 on a dead-end road"'
            value={existingLines}
            onChange={e => setExistingLines(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="w-artist">
            Lean Closest To
            <span className="label-hint">Optional — which artist's style to target</span>
          </label>
          <select
            id="w-artist"
            value={referenceArtist}
            onChange={e => setReferenceArtist(e.target.value)}
            disabled={loading}
          >
            <option value="">— Any of the above —</option>
            {REFERENCE_ARTISTS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !title.trim() || !concept.trim()}
        >
          {loading
            ? <span className="btn-loading"><span className="spinner" />Writing your song…</span>
            : 'Write This Song'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {loading && (
        <div className="loading-state">
          <div className="loading-pulse" />
          <p>Your Nashville co-writer is in the room…</p>
        </div>
      )}
      {result && <WriterResults data={result} songTitle={title} />}
    </div>
  );
}

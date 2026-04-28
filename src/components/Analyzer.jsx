import { useState } from 'react';
import AnalyzerResults from './AnalyzerResults.jsx';

const SECTION_OPTIONS = [
  'Intro', 'Verse 1', 'Verse 2', 'Verse 3',
  'Pre-Chorus', 'Chorus', 'Bridge', 'Outro', 'Tag', 'Hook',
];

const DEFAULT_STRUCTURE = [
  { section: 'Verse 1', description: '' },
  { section: 'Chorus', description: '' },
  { section: 'Verse 2', description: '' },
  { section: 'Chorus', description: '' },
  { section: 'Bridge', description: '' },
  { section: 'Chorus', description: '' },
];

const DIMENSIONS = [
  {
    key: 'theme',
    label: 'Theme & Subject Matter',
    icon: '◈',
    hint: 'What is this song really about beneath the surface? What universal emotion does it tap into?',
    placeholder: 'e.g. On the surface it\'s about a breakup, but the real subject is the moment a man realizes his own stubbornness cost him the best thing he ever had…',
  },
  {
    key: 'hook_analysis',
    label: 'Hook Analysis',
    icon: '◎',
    hint: 'What is the central hook? Why is it memorable? What makes the title phrase land — sound, rhythm, imagery, double meaning?',
    placeholder: 'e.g. The hook "Fast Car" works because it\'s both literal (a car that can outrun the past) and metaphorical (the feeling of escape). Two syllables, hard consonants…',
  },
  {
    key: 'word_choice',
    label: 'Word Choice & Vocabulary',
    icon: '◇',
    hint: 'Specific vs. abstract? Regional or dialect words? Key sensory details and which senses they hit? Recurring imagery patterns?',
    placeholder: 'e.g. Heavily concrete — "checkout girl," "grocery store," "your mom\'s place." No abstractions. Every noun is touchable…',
  },
  {
    key: 'rhyme_scheme',
    label: 'Rhyme Scheme',
    icon: '◉',
    hint: 'Map the pattern section by section (AABB, ABAB, etc.). Note any slant rhymes, near-misses, or internal rhymes.',
    placeholder: 'e.g. Verse: AABB with slant rhymes ("mine/time"). Chorus: ABAB, tighter — the rhymes snap into place where the verse let them breathe…',
  },
  {
    key: 'pacing',
    label: 'Pacing & Syllable Feel',
    icon: '◌',
    hint: 'Short punchy lines or long rolling ones? Where does the song breathe? How does syllable density match the emotional content?',
    placeholder: 'e.g. Verses run long — 10-12 syllables per line, conversational. Chorus cuts to 6-8, punchy. The bridge drops to short stabs: "Just a…fast car…"',
  },
  {
    key: 'storytelling',
    label: 'Storytelling Technique',
    icon: '△',
    hint: 'Opens in a scene? Uses a twist or reveal? Is there a perspective shift? Does time move forward, backward, or stay in a moment?',
    placeholder: 'e.g. Opens mid-scene, in the car, present tense. Verse 2 flashes back. Bridge collapses time — past and present collapse into one feeling…',
  },
  {
    key: 'emotional_arc',
    label: 'Emotional Arc',
    icon: '♡',
    hint: 'Where does the listener start emotionally? What shifts? Where do they end up? What feeling is the song trying to leave you with?',
    placeholder: 'e.g. Starts with hope — the car = freedom. By the bridge, the dream has curdled. The final chorus lands with resignation wrapped in defiance…',
  },
];

export default function Analyzer() {
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [structure, setStructure] = useState(DEFAULT_STRUCTURE.map(s => ({ ...s })));
  const [dims, setDims] = useState(
    Object.fromEntries(DIMENSIONS.map(d => [d.key, '']))
  );
  const [greatness, setGreatness] = useState(['', '', '', '', '']);
  const [result, setResult] = useState(null);

  function addSection() {
    setStructure(s => [...s, { section: 'Verse', description: '' }]);
  }

  function removeSection(i) {
    setStructure(s => s.filter((_, idx) => idx !== i));
  }

  function updateSection(i, field, value) {
    setStructure(s => s.map((sec, idx) => idx === i ? { ...sec, [field]: value } : sec));
  }

  function updateDim(key, value) {
    setDims(d => ({ ...d, [key]: value }));
  }

  function updateGreatness(i, value) {
    setGreatness(g => g.map((v, idx) => idx === i ? value : v));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      song_title: songTitle.trim(),
      artist: artist.trim(),
      structure: structure.filter(s => s.section.trim()),
      ...dims,
      what_makes_it_great: greatness.filter(g => g.trim()),
    };
    setResult(data);
    setTimeout(() => {
      document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const isValid = songTitle.trim() && artist.trim();

  return (
    <div>
      <form className="worksheet" onSubmit={handleSubmit}>

        {/* ── Song Info ── */}
        <div className="ws-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="song-title">Song Title</label>
              <input
                id="song-title"
                type="text"
                placeholder="e.g. Fast Car"
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
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
              />
            </div>
          </div>
        </div>

        {/* ── Song Structure ── */}
        <div className="ws-section">
          <div className="ws-section-header">
            <h3 className="ws-heading"><span className="section-icon">⊞</span> Song Structure</h3>
            <span className="ws-hint">Map each section and describe what it's doing emotionally and narratively.</span>
          </div>
          <div className="structure-editor">
            {structure.map((sec, i) => (
              <div key={i} className="structure-editor-row">
                <select
                  value={sec.section}
                  onChange={e => updateSection(i, 'section', e.target.value)}
                  className="section-select"
                >
                  {SECTION_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="What is this section doing emotionally and narratively?"
                  value={sec.description}
                  onChange={e => updateSection(i, 'description', e.target.value)}
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeSection(i)}
                  title="Remove section"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="btn-add-section" onClick={addSection}>
              + Add Section
            </button>
          </div>
        </div>

        {/* ── Analysis Dimensions ── */}
        {DIMENSIONS.map(({ key, label, icon, hint, placeholder }) => (
          <div key={key} className="ws-section">
            <div className="ws-section-header">
              <h3 className="ws-heading"><span className="section-icon">{icon}</span> {label}</h3>
              <span className="ws-hint">{hint}</span>
            </div>
            <textarea
              rows={3}
              value={dims[key]}
              onChange={e => updateDim(key, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}

        {/* ── What Makes It Great ── */}
        <div className="ws-section">
          <div className="ws-section-header">
            <h3 className="ws-heading"><span className="section-icon">★</span> What Makes It Great</h3>
            <span className="ws-hint">Name up to 5 specific craft moves. Be precise — not "great imagery" but what the image is and exactly why it works.</span>
          </div>
          <div className="greatness-inputs">
            {greatness.map((g, i) => (
              <div key={i} className="greatness-input-row">
                <span className="greatness-input-num">{i + 1}</span>
                <input
                  type="text"
                  placeholder={`Craft move ${i + 1}…`}
                  value={g}
                  onChange={e => updateGreatness(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={!isValid}>
          Show Analysis
        </button>

      </form>

      {result && (
        <div id="analysis-results">
          <AnalyzerResults data={result} />
        </div>
      )}
    </div>
  );
}

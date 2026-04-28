import { useState } from 'react';
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

const STRUCTURE_TEMPLATES = {
  simple: {
    label: 'Simple',
    notation: 'V1 · Ch · V2 · Ch',
    sections: ['VERSE 1', 'CHORUS', 'VERSE 2', 'CHORUS'],
  },
  standard: {
    label: 'Standard',
    notation: 'V1 · Ch · V2 · Ch · Br · Ch',
    sections: ['VERSE 1', 'CHORUS', 'VERSE 2', 'CHORUS', 'BRIDGE', 'CHORUS'],
  },
  pre_chorus: {
    label: 'Pre-Chorus',
    notation: 'V1 · PC · Ch · V2 · PC · Ch · Br · Ch',
    sections: ['VERSE 1', 'PRE-CHORUS', 'CHORUS', 'VERSE 2', 'PRE-CHORUS', 'CHORUS', 'BRIDGE', 'CHORUS'],
  },
  extended: {
    label: 'Extended',
    notation: 'Intro · V1 · PC · Ch · V2 · PC · Ch · Br · Ch · Outro',
    sections: ['INTRO', 'VERSE 1', 'PRE-CHORUS', 'CHORUS', 'VERSE 2', 'PRE-CHORUS', 'CHORUS', 'BRIDGE', 'CHORUS', 'OUTRO'],
  },
};

const SECTION_LABEL_OPTIONS = [
  'INTRO', 'VERSE 1', 'VERSE 2', 'VERSE 3',
  'PRE-CHORUS', 'CHORUS', 'BRIDGE', 'OUTRO', 'TAG', 'HOOK',
];

const CRAFT_NOTE_FIELDS = [
  { key: 'opening', title: 'Opening Line', placeholder: 'Why this specific first line — what it establishes, what it promises.' },
  { key: 'hook', title: 'Hook Design', placeholder: 'How the central hook was constructed. Why this phrase and not another.' },
  { key: 'rhyme', title: 'Rhyme Scheme', placeholder: 'The scheme chosen and why it serves this song\'s emotional feel. Any deliberate slant rhymes.' },
  { key: 'image', title: 'Key Image or Detail', placeholder: 'The central image or most specific concrete detail, and why it earns its place.' },
  { key: 'structure', title: 'Structure Decision', placeholder: 'Why this structure over alternatives for this specific concept.' },
  { key: 'arc', title: 'Emotional Arc', placeholder: 'How the song builds and releases emotion across its sections.' },
];

function makeSections(templateKey) {
  return STRUCTURE_TEMPLATES[templateKey].sections.map(label => ({ label, lines: '' }));
}

export default function Writer() {
  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [referenceArtist, setReferenceArtist] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [structureRationale, setStructureRationale] = useState('');
  const [sections, setSections] = useState(makeSections('standard'));
  const [toneGuide, setToneGuide] = useState('');
  const [pacingGuide, setPacingGuide] = useState('');
  const [craftNotes, setCraftNotes] = useState(
    Object.fromEntries(CRAFT_NOTE_FIELDS.map(f => [f.key, '']))
  );
  const [result, setResult] = useState(null);

  function applyTemplate(key) {
    setSelectedTemplate(key);
    setSections(makeSections(key));
  }

  function addSection() {
    setSections(s => [...s, { label: 'VERSE', lines: '' }]);
  }

  function removeSection(i) {
    setSections(s => s.filter((_, idx) => idx !== i));
  }

  function updateLabel(i, value) {
    setSections(s => s.map((sec, idx) => idx === i ? { ...sec, label: value } : sec));
  }

  function updateLines(i, value) {
    setSections(s => s.map((sec, idx) => idx === i ? { ...sec, lines: value } : sec));
  }

  function updateCraft(key, value) {
    setCraftNotes(n => ({ ...n, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validSections = sections.filter(s => s.label.trim());
    const tpl = STRUCTURE_TEMPLATES[selectedTemplate];

    const structureRec = [
      tpl.notation,
      structureRationale.trim() ? `— ${structureRationale.trim()}` : '',
    ].filter(Boolean).join(' ');

    const craftNotesArr = CRAFT_NOTE_FIELDS
      .map(f => ({ title: f.title, note: craftNotes[f.key] }))
      .filter(n => n.note.trim());

    setResult({
      structure_recommendation: structureRec,
      tone_guide: toneGuide.trim() || (referenceArtist ? `Style target: ${referenceArtist}` : ''),
      pacing_guide: pacingGuide.trim(),
      lyricSections: validSections,
      craft_notes: craftNotesArr,
    });

    setTimeout(() => {
      document.getElementById('writer-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const isValid = title.trim() && sections.some(s => s.lines.trim());

  return (
    <div>
      <form className="worksheet" onSubmit={handleSubmit}>

        {/* ── Song Info ── */}
        <div className="ws-section">
          <div className="form-group">
            <label htmlFor="w-title">Song Title</label>
            <input
              id="w-title"
              type="text"
              placeholder="e.g. Gravel Road Home"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group ws-gap-top">
            <label htmlFor="w-concept">
              Your Concept
              <span className="label-hint">What is this song about?</span>
            </label>
            <textarea
              id="w-concept"
              rows={3}
              placeholder="e.g. A guy who drove away from everything good, realizes it too late, and has nothing left but the memory of how it felt before he blew it."
              value={concept}
              onChange={e => setConcept(e.target.value)}
            />
          </div>
          <div className="form-group ws-gap-top">
            <label htmlFor="w-artist">
              Lean Closest To
              <span className="label-hint">Optional — style target</span>
            </label>
            <select id="w-artist" value={referenceArtist} onChange={e => setReferenceArtist(e.target.value)}>
              <option value="">— Any of the above —</option>
              {REFERENCE_ARTISTS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* ── Structure Template ── */}
        <div className="ws-section">
          <div className="ws-section-header">
            <h3 className="ws-heading"><span className="section-icon">⊞</span> Song Structure</h3>
            <span className="ws-hint">Pick a template to load the sections, then edit freely below.</span>
          </div>
          <div className="template-picker">
            {Object.entries(STRUCTURE_TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                type="button"
                className={`template-btn ${selectedTemplate === key ? 'active' : ''}`}
                onClick={() => applyTemplate(key)}
              >
                <span className="template-label">{tpl.label}</span>
                <span className="template-notation">{tpl.notation}</span>
              </button>
            ))}
          </div>
          <div className="form-group ws-gap-top">
            <label htmlFor="w-rationale">
              Why This Structure Works for This Song
              <span className="label-hint">Optional</span>
            </label>
            <input
              id="w-rationale"
              type="text"
              placeholder="e.g. Skipping the pre-chorus keeps urgency high — the chorus hits harder without the wind-up."
              value={structureRationale}
              onChange={e => setStructureRationale(e.target.value)}
            />
          </div>
        </div>

        {/* ── Lyrics ── */}
        <div className="ws-section">
          <div className="ws-section-header">
            <h3 className="ws-heading"><span className="section-icon">♩</span> Lyrics</h3>
            <span className="ws-hint">Write each section one line at a time. The app handles all formatting.</span>
          </div>
          <div className="lyric-editor">
            {sections.map((sec, i) => (
              <div key={i} className="lyric-editor-block">
                <div className="lyric-editor-header">
                  <select
                    value={sec.label}
                    onChange={e => updateLabel(i, e.target.value)}
                    className="section-label-select"
                  >
                    {SECTION_LABEL_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeSection(i)}
                    title="Remove section"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder={`Write the ${sec.label.toLowerCase()} lines here…`}
                  value={sec.lines}
                  onChange={e => updateLines(i, e.target.value)}
                />
              </div>
            ))}
            <button type="button" className="btn-add-section" onClick={addSection}>
              + Add Section
            </button>
          </div>
        </div>

        {/* ── Optional Guides ── */}
        <div className="ws-section">
          <div className="ws-section-header">
            <h3 className="ws-heading">
              <span className="section-icon">◈</span> Guides
              <span className="ws-heading-optional">optional</span>
            </h3>
            <span className="ws-hint">Your personal reference for this song — tone, imagery world, pacing intentions.</span>
          </div>
          <div className="form-group">
            <label>Tone & Mood Guide</label>
            <textarea
              rows={2}
              placeholder="e.g. Late-night, pickup trucks on back roads, guilt with no redemption in sight, Jack and gravel, no porch lights on."
              value={toneGuide}
              onChange={e => setToneGuide(e.target.value)}
            />
          </div>
          <div className="form-group ws-gap-top">
            <label>Pacing Guide</label>
            <textarea
              rows={2}
              placeholder="e.g. Verse lines long and drawn out — let the regret breathe. Chorus short and blunt. Bridge should hit like a fist."
              value={pacingGuide}
              onChange={e => setPacingGuide(e.target.value)}
            />
          </div>
        </div>

        {/* ── Craft Notes ── */}
        <div className="ws-section">
          <div className="ws-section-header">
            <h3 className="ws-heading">
              <span className="section-icon">✎</span> Craft Notes
              <span className="ws-heading-optional">optional</span>
            </h3>
            <span className="ws-hint">Annotate your decisions. Why this hook, why this opening line, why this rhyme scheme.</span>
          </div>
          <div className="craft-note-inputs">
            {CRAFT_NOTE_FIELDS.map(f => (
              <div key={f.key} className="craft-note-input-row">
                <span className="craft-note-input-label">{f.title}</span>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={craftNotes[f.key]}
                  onChange={e => updateCraft(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={!isValid}>
          Build Song
        </button>

      </form>

      {result && (
        <div id="writer-results">
          <WriterResults data={result} songTitle={title} />
        </div>
      )}
    </div>
  );
}

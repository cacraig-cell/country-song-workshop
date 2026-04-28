function parseLyrics(raw) {
  if (!raw) return [];
  const sections = raw.split(/\n\n+/);
  return sections
    .map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return null;
      // Section label: all-caps line optionally ending with colon
      const labelMatch = lines[0].match(/^([A-Z][A-Z0-9\s&\-]*):\s*$/);
      if (labelMatch) {
        return { label: labelMatch[1].trim(), lines: lines.slice(1) };
      }
      // Maybe the label is on the same string before a colon
      const inlineMatch = lines[0].match(/^([A-Z][A-Z0-9\s&\-]*):\s*(.*)$/);
      if (inlineMatch) {
        const rest = [inlineMatch[2], ...lines.slice(1)].filter(Boolean);
        return { label: inlineMatch[1].trim(), lines: rest };
      }
      return { label: null, lines };
    })
    .filter(Boolean);
}

function exportLyrics(songTitle, data) {
  const lines = [
    `${songTitle.toUpperCase()}`,
    ``,
    `STRUCTURE: ${data.structure_recommendation}`,
    ``,
    `---`,
    ``,
    data.lyrics.replace(/\\n/g, '\n'),
    ``,
    `---`,
    `CRAFT NOTES`,
    ``,
    ...data.craft_notes.map(n => `${n.title.toUpperCase()}\n${n.note}\n`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${songTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function WriterResults({ data, songTitle }) {
  const sections = parseLyrics(data.lyrics);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">"{songTitle}"</h2>
        <button
          className="btn-export"
          onClick={() => exportLyrics(songTitle, data)}
        >
          Export .txt
        </button>
      </div>

      {/* Structure + Guides */}
      <div className="guides-grid">
        <section className="result-section guide-card">
          <h3 className="section-heading">
            <span className="section-icon">⊞</span>
            Recommended Structure
          </h3>
          <p className="section-body">{data.structure_recommendation}</p>
        </section>

        <section className="result-section guide-card">
          <h3 className="section-heading">
            <span className="section-icon">◈</span>
            Tone & Mood Guide
          </h3>
          <p className="section-body">{data.tone_guide}</p>
        </section>

        <section className="result-section guide-card">
          <h3 className="section-heading">
            <span className="section-icon">◌</span>
            Pacing Guide
          </h3>
          <p className="section-body">{data.pacing_guide}</p>
        </section>
      </div>

      {/* Lyrics */}
      <section className="result-section lyrics-section">
        <h3 className="section-heading">
          <span className="section-icon">♩</span>
          Full Draft Lyrics
        </h3>
        <div className="lyrics-body">
          {sections.map((sec, i) => (
            <div key={i} className="lyric-block">
              {sec.label && <div className="lyric-label">{sec.label}</div>}
              {sec.lines.map((line, j) => (
                <div key={j} className="lyric-line">{line}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Craft Notes */}
      <section className="result-section">
        <h3 className="section-heading">
          <span className="section-icon">✎</span>
          Craft Notes
        </h3>
        <div className="craft-notes-grid">
          {data.craft_notes.map((note, i) => (
            <div key={i} className="craft-note">
              <div className="craft-note-title">{note.title}</div>
              <p className="craft-note-body">{note.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

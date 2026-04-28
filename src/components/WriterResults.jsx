// lyricSections: [{label, lines}] where lines is a newline-separated string
function buildDisplaySections(lyricSections) {
  return lyricSections.map(sec => ({
    label: sec.label,
    lines: sec.lines.split('\n').map(l => l.trim()).filter(Boolean),
  }));
}

function exportLyrics(songTitle, data) {
  const lyricsText = data.lyricSections
    .filter(s => s.label.trim())
    .map(s => `${s.label}\n${s.lines.trim()}`)
    .join('\n\n');

  const parts = [
    songTitle.toUpperCase(),
    '',
  ];

  if (data.structure_recommendation) {
    parts.push(`STRUCTURE: ${data.structure_recommendation}`, '');
  }

  parts.push('---', '', lyricsText, '');

  if (data.craft_notes?.length) {
    parts.push('---', 'CRAFT NOTES', '');
    data.craft_notes.forEach(n => {
      parts.push(`${n.title.toUpperCase()}\n${n.note}`, '');
    });
  }

  const blob = new Blob([parts.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${songTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function WriterResults({ data, songTitle }) {
  const displaySections = buildDisplaySections(data.lyricSections || []);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">"{songTitle}"</h2>
        <button className="btn-export" onClick={() => exportLyrics(songTitle, data)}>
          Export .txt
        </button>
      </div>

      {/* Structure + Guides */}
      <div className="guides-grid">
        {data.structure_recommendation && (
          <section className="result-section guide-card">
            <h3 className="section-heading">
              <span className="section-icon">⊞</span>
              Structure
            </h3>
            <p className="section-body">{data.structure_recommendation}</p>
          </section>
        )}

        {data.tone_guide && (
          <section className="result-section guide-card">
            <h3 className="section-heading">
              <span className="section-icon">◈</span>
              Tone & Mood
            </h3>
            <p className="section-body">{data.tone_guide}</p>
          </section>
        )}

        {data.pacing_guide && (
          <section className="result-section guide-card">
            <h3 className="section-heading">
              <span className="section-icon">◌</span>
              Pacing
            </h3>
            <p className="section-body">{data.pacing_guide}</p>
          </section>
        )}
      </div>

      {/* Lyrics */}
      <section className="result-section lyrics-section">
        <h3 className="section-heading">
          <span className="section-icon">♩</span>
          Full Draft Lyrics
        </h3>
        <div className="lyrics-body">
          {displaySections.map((sec, i) => (
            <div key={i} className="lyric-block">
              {sec.label && <div className="lyric-label">{sec.label}</div>}
              {sec.lines.length > 0
                ? sec.lines.map((line, j) => (
                    <div key={j} className="lyric-line">{line}</div>
                  ))
                : <div className="lyric-line lyric-empty">—</div>
              }
            </div>
          ))}
        </div>
      </section>

      {/* Craft Notes */}
      {data.craft_notes?.length > 0 && (
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
      )}
    </div>
  );
}

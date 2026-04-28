const REFERENCE_ARTISTS = [
  'Luke Combs',
  'Morgan Wallen',
  'Kameron Marlow',
  'Tucker Wetmore',
  'Hudson Westbrook',
  'Jason Aldean',
  'Scotty McCreery',
];

const DIMENSION_ICONS = {
  theme: '◈',
  hook_analysis: '◎',
  word_choice: '◇',
  rhyme_scheme: '◉',
  pacing: '◌',
  storytelling: '△',
  emotional_arc: '♡',
};

const DIMENSION_LABELS = {
  theme: 'Theme & Subject Matter',
  hook_analysis: 'Hook Analysis',
  word_choice: 'Word Choice & Vocabulary',
  rhyme_scheme: 'Rhyme Scheme',
  pacing: 'Pacing & Syllable Feel',
  storytelling: 'Storytelling Technique',
  emotional_arc: 'Emotional Arc',
};

export default function AnalyzerResults({ data }) {
  const dimensions = Object.keys(DIMENSION_LABELS);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">
          "{data.song_title}"
          <span className="results-artist">by {data.artist}</span>
        </h2>
      </div>

      {/* Song Structure */}
      <section className="result-section">
        <h3 className="section-heading">
          <span className="section-icon">⊞</span>
          Song Structure
        </h3>
        <div className="structure-grid">
          {data.structure.map((block, i) => (
            <div key={i} className="structure-block">
              <div className="structure-label">{block.section}</div>
              <p className="structure-desc">{block.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis Dimensions */}
      {dimensions.map(key => (
        <section key={key} className="result-section">
          <h3 className="section-heading">
            <span className="section-icon">{DIMENSION_ICONS[key]}</span>
            {DIMENSION_LABELS[key]}
          </h3>
          <p className="section-body">{data[key]}</p>
        </section>
      ))}

      {/* What Makes It Great */}
      <section className="result-section greatness-section">
        <h3 className="section-heading">
          <span className="section-icon">★</span>
          What Makes It Great
        </h3>
        <ul className="greatness-list">
          {data.what_makes_it_great.map((point, i) => (
            <li key={i} className="greatness-item">
              <span className="greatness-num">{i + 1}</span>
              <p>{point}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import { useMemo, useState } from 'react';
import Bodygraph from '../components/Bodygraph.jsx';
import { activations, analyzeGates } from '../hd/engine.js';
import { CENTERS, GATES, PLANETS, TYPES } from '../hd/data.js';
import { COLORS } from './ChartView.jsx';

const TIPS = {
  Generator: 'Notice what your gut lights up for today, and let go of what feels like a chore.',
  'Manifesting Generator': 'Respond first, then tell the people around you before you take off.',
  Manifestor: 'Before you start something today, inform the people it will affect.',
  Projector: 'Save your energy for where you are recognized. Rest is productive for you.',
  Reflector: 'Sample the energy of the day without taking it on as yours.',
};

function dayOffset(base, days) {
  return new Date(base.getTime() + days * 86400000);
}

export default function TodayView({ profile, chart }) {
  const [offset, setOffset] = useState(0);
  const now = useMemo(() => dayOffset(new Date(), offset), [offset]);
  const transit = useMemo(() => activations(now), [now]);
  const tGates = new Set(transit.map((a) => a.gate));
  const mine = chart.gates;

  const withTransit = analyzeGates(new Set([...mine, ...tGates]));
  const newChannels = withTransit.channels.filter((c) => !chart.channels.some((x) => x.id === c.id));
  const tempCenters = withTransit.defined.filter((c) => !chart.defined.includes(c));
  const sun = transit[0];
  const moon = transit[4];
  const hits = transit.filter((a) => mine.has(a.gate));

  const label = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="view">
      <section className="hero card">
        <div className="day-nav">
          <button className="btn ghost sm" onClick={() => setOffset(offset - 1)} aria-label="Previous day">
            ‹
          </button>
          <p className="eyebrow">{offset === 0 ? 'Today' : label}</p>
          <button className="btn ghost sm" onClick={() => setOffset(offset + 1)} aria-label="Next day">
            ›
          </button>
        </div>
        <h1 className="type-title">Gate {sun.gate}</h1>
        <p className="lead">{GATES[sun.gate][0]}</p>
        <p>
          The Sun is in Gate {sun.gate}.{sun.line} — the collective theme: {GATES[sun.gate][1].toLowerCase()} The Moon moves through Gate{' '}
          {moon.gate}, {GATES[moon.gate][0]}.
        </p>
        <div className="tip">
          <span className="eyebrow">For you, {profile.name}</span>
          <p>{TIPS[chart.type]}</p>
          <small className="muted">Remember: {TYPES[chart.type].strategy.toLowerCase()}.</small>
        </div>
      </section>

      <section className="card">
        <h3>How today’s sky meets your chart</h3>
        {newChannels.length ? (
          <ul className="list">
            {newChannels.map((c) => (
              <li key={c.id}>
                <span className="tag transit">{c.id}</span>
                <div>
                  <strong>Channel of {c.name}</strong>
                  <p>Temporarily completed by the transit — you may feel this energy more than usual.</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No new channels are formed today — a steady day for your design.</p>
        )}
        {tempCenters.length > 0 && (
          <p>
            Temporarily defined: <strong>{tempCenters.map((c) => CENTERS[c].name).join(', ')}</strong>. Enjoy the borrowed consistency, but
            don’t mistake it for who you are.
          </p>
        )}
        {hits.length > 0 && (
          <p className="muted">
            Planets activating your own gates: {hits.map((a) => `${PLANETS.find((p) => p.id === a.planet).name} (${a.gate})`).join(', ')}.
          </p>
        )}
      </section>

      <section className="card graph-card">
        <h3>Your chart + transit</h3>
        <Bodygraph
          layers={[
            { gates: mine, color: COLORS.personality },
            { gates: tGates, color: COLORS.transit },
          ]}
          defined={withTransit.defined}
        />
        <p className="legend">
          <i style={{ background: COLORS.personality }} /> Your gates <i style={{ background: COLORS.transit }} /> Transit gates
        </p>
      </section>

      <section className="card">
        <h3>Planetary weather</h3>
        <div className="transit-grid">
          {transit.map((a, i) => (
            <div key={a.planet} className="transit-cell">
              <span className="glyph">{PLANETS[i].glyph}</span>
              <span>
                <strong>
                  {a.gate}.{a.line}
                </strong>{' '}
                <small className="muted">{PLANETS[i].name}</small>
                <br />
                <small>{GATES[a.gate][0]}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

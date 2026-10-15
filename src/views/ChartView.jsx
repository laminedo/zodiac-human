import { useState } from 'react';
import Bodygraph from '../components/Bodygraph.jsx';
import { AUTHORITIES, CENTERS, CENTER_INFO, CENTER_ORDER, GATES, LINES, PLANETS, TYPES } from '../hd/data.js';

export const COLORS = { personality: 'var(--personality)', design: 'var(--design)', transit: 'var(--transit)' };

function PlanetColumn({ title, acts, color, align }) {
  return (
    <div className={`planets ${align}`}>
      <h4 style={{ color }}>{title}</h4>
      {acts.map((a, i) => (
        <div key={a.planet} className="planet" title={`${PLANETS[i].name} in Gate ${a.gate} — ${GATES[a.gate][0]}`}>
          <span className="glyph">{PLANETS[i].glyph}</span>
          <span className="gl" style={{ color }}>
            {a.gate}.{a.line}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub }) {
  return (
    <div className="stat">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}

export default function ChartView({ profile, chart }) {
  const [gate, setGate] = useState(null);
  const type = TYPES[chart.type];
  const [pl, dl] = chart.profileLines;
  const pGates = new Set(chart.personality.map((a) => a.gate));
  const dGates = new Set(chart.design.map((a) => a.gate));
  const myGates = [...chart.gates].sort((a, b) => a - b);

  return (
    <div className="view">
      <section className="hero card">
        <p className="eyebrow">{profile.name}’s design</p>
        <h1 className="type-title">{chart.type}</h1>
        <p className="lead">{type.strategy}</p>
        <div className="stats">
          <Stat label="Authority" value={chart.authority} />
          <Stat label="Profile" value={chart.profile} sub={`${LINES[pl][0]} / ${LINES[dl][0]}`} />
          <Stat label="Definition" value={chart.definition} />
          <Stat label="Signature" value={type.signature} sub={`Not-self: ${type.notSelf}`} />
        </div>
        <p className="cross">
          {chart.cross.angle} Cross · {chart.cross.gates[0]}/{chart.cross.gates[1]} | {chart.cross.gates[2]}/{chart.cross.gates[3]}
        </p>
      </section>

      <section className="card graph-card">
        <div className="graph-wrap">
          <PlanetColumn title="Design" acts={chart.design} color={COLORS.design} align="left" />
          <Bodygraph
            layers={[
              { gates: dGates, color: COLORS.design },
              { gates: pGates, color: COLORS.personality },
            ]}
            defined={chart.defined}
            onGateClick={(g) => chart.gates.has(g) && setGate(g)}
          />
          <PlanetColumn title="Personality" acts={chart.personality} color={COLORS.personality} align="right" />
        </div>
        <p className="legend">
          <i style={{ background: COLORS.design }} /> Design (unconscious, body) <i style={{ background: COLORS.personality }} /> Personality
          (conscious, mind)
        </p>
        {gate && (
          <div className="gate-pop" onClick={() => setGate(null)}>
            <strong>
              Gate {gate} · {GATES[gate][0]}
            </strong>
            <span>{GATES[gate][1]}</span>
            <small>{CENTERS[Object.keys(CENTERS).find((c) => CENTERS[c].gates.includes(gate))].name} center · tap to close</small>
          </div>
        )}
      </section>

      <section className="card">
        <h3>Your type: {chart.type}</h3>
        <p>{type.summary}</p>
        <div className="pills">
          <span className="pill">Strategy · {type.strategy}</span>
          <span className="pill">Aura · {type.aura}</span>
        </div>
      </section>

      <section className="card">
        <h3>Inner authority: {chart.authority}</h3>
        <p>{AUTHORITIES[chart.authority]}</p>
      </section>

      <section className="card">
        <h3>Profile {chart.profile}</h3>
        <div className="two">
          {[pl, dl].map((l, i) => (
            <div key={i} className="mini">
              <span className="eyebrow">{i ? 'Unconscious' : 'Conscious'} line {l}</span>
              <strong>{LINES[l][0]}</strong>
              <p>{LINES[l][1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Energy centers</h3>
        <p className="muted">
          {chart.defined.length} defined · {9 - chart.defined.length} open
        </p>
        <div className="centers-list">
          {CENTER_ORDER.map((c) => {
            const on = chart.defined.includes(c);
            return (
              <div key={c} className={`center-row ${on ? 'on' : ''}`}>
                <span className={`dot c-${c}`} />
                <div>
                  <strong>
                    {CENTERS[c].name} <em>{on ? 'Defined' : 'Open'}</em>
                  </strong>
                  <p>
                    <span className="muted">{CENTER_INFO[c][0]}.</span> {on ? CENTER_INFO[c][1] : CENTER_INFO[c][2]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h3>Channels</h3>
        {chart.channels.length ? (
          <ul className="list">
            {chart.channels.map((c) => (
              <li key={c.id}>
                <span className="tag">{c.id}</span> Channel of {c.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No defined channels — every center is open.</p>
        )}
      </section>

      <section className="card">
        <h3>Gates</h3>
        <ul className="list gates-list">
          {myGates.map((g) => (
            <li key={g}>
              <span className="tag" style={{ borderColor: dGates.has(g) && pGates.has(g) ? 'var(--accent)' : dGates.has(g) ? 'var(--design)' : 'var(--personality)' }}>
                {g}
              </span>
              <div>
                <strong>{GATES[g][0]}</strong>
                <p>{GATES[g][1]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

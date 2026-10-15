import { useState } from 'react';
import Bodygraph from '../components/Bodygraph.jsx';
import { compareCharts } from '../hd/engine.js';
import { CENTERS } from '../hd/data.js';
import { chartFor } from '../store.js';

const KIND_ORDER = ['electromagnetic', 'companionship', 'compromise', 'dominance'];
const KIND_LABEL = {
  electromagnetic: 'Electromagnetic',
  companionship: 'Companionship',
  compromise: 'Compromise',
  dominance: 'Dominance',
};

export default function ConnectView({ profile, profiles, onAdd }) {
  const others = profiles.filter((p) => p.id !== profile.id);
  const [otherId, setOtherId] = useState(others[0]?.id);
  const other = others.find((p) => p.id === otherId) || others[0];

  if (!other) {
    return (
      <div className="view">
        <section className="card hero">
          <p className="eyebrow">Connections</p>
          <h1 className="type-title">Compare two designs</h1>
          <p>Add a partner, friend or family member to see how your energies meet — where you attract, share, and learn from each other.</p>
          <button className="btn primary" onClick={onAdd}>
            + Add a person
          </button>
        </section>
      </div>
    );
  }

  const a = chartFor(profile);
  const b = chartFor(other);
  const { rows, combined, kinds } = compareCharts(a, b);
  const count = combined.defined.length;
  const theme = { 9: '9-0 · Nothing to do but be together', 8: '8-1 · One shared open center to explore', 7: '7-2 · Fun with plenty of space', 6: '6-3 · Work & balance', 5: '5-4 · Lots to learn from each other' }[count] || `${count}-${9 - count} · Very open — you need others around you`;

  return (
    <div className="view">
      <section className="card hero">
        <p className="eyebrow">Connection</p>
        <div className="vs">
          <div>
            <strong>{profile.name}</strong>
            <small>{a.type}</small>
          </div>
          <span className="amp">✦</span>
          <div>
            <select value={other.id} onChange={(e) => setOtherId(e.target.value)}>
              {others.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <small>{b.type}</small>
          </div>
        </div>
        <p className="lead">{theme}</p>
        <p className="muted">
          Together you define {count} of 9 centers as a <strong>{combined.type}</strong> composite.
        </p>
      </section>

      <section className="card graph-card">
        <Bodygraph
          layers={[
            { gates: a.gates, color: 'var(--personality)' },
            { gates: b.gates, color: 'var(--partner)' },
          ]}
          defined={combined.defined}
        />
        <p className="legend">
          <i style={{ background: 'var(--personality)' }} /> {profile.name} <i style={{ background: 'var(--partner)' }} /> {other.name}
        </p>
        <p className="muted center-note">
          Open together:{' '}
          {Object.keys(CENTERS)
            .filter((c) => !combined.defined.includes(c))
            .map((c) => CENTERS[c].name)
            .join(', ') || 'none'}
        </p>
      </section>

      {KIND_ORDER.map((k) => {
        const list = rows.filter((r) => r.kind === k);
        if (!list.length) return null;
        return (
          <section key={k} className="card">
            <h3>
              {KIND_LABEL[k]} <span className="count">{list.length}</span>
            </h3>
            <p className="muted">{kinds[k]}</p>
            <ul className="list">
              {list.map((r) => (
                <li key={r.channel.id}>
                  <span className={`tag k-${k}`}>{r.channel.id}</span>
                  <div>
                    <strong>Channel of {r.channel.name}</strong>
                    {r.owner && <p>Carried by {r.owner === 'a' ? profile.name : other.name}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

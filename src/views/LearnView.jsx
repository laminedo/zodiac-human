import { useState } from 'react';
import { AUTHORITIES, CENTERS, CENTER_INFO, CENTER_ORDER, CHANNELS, GATES, GATE_CENTER, LINES, TYPES } from '../hd/data.js';

const TABS = ['Types', 'Authority', 'Profiles', 'Centers', 'Gates', 'Channels'];

export default function LearnView() {
  const [tab, setTab] = useState('Types');
  const [q, setQ] = useState('');
  const match = (s) => s.toLowerCase().includes(q.toLowerCase());

  return (
    <div className="view">
      <section className="card hero">
        <p className="eyebrow">Library</p>
        <h1 className="type-title">Learn Human Design</h1>
        <div className="seg">
          {TABS.map((t) => (
            <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </section>

      {tab === 'Types' &&
        Object.entries(TYPES).map(([name, t]) => (
          <section key={name} className="card">
            <h3>{name}</h3>
            <p>{t.summary}</p>
            <div className="pills">
              <span className="pill">Strategy · {t.strategy}</span>
              <span className="pill">Signature · {t.signature}</span>
              <span className="pill">Not-self · {t.notSelf}</span>
            </div>
          </section>
        ))}

      {tab === 'Authority' &&
        Object.entries(AUTHORITIES).map(([name, d]) => (
          <section key={name} className="card">
            <h3>{name}</h3>
            <p>{d}</p>
          </section>
        ))}

      {tab === 'Profiles' &&
        Object.entries(LINES).map(([n, [name, d]]) => (
          <section key={n} className="card">
            <h3>
              Line {n} · {name}
            </h3>
            <p>{d}</p>
          </section>
        ))}

      {tab === 'Centers' &&
        CENTER_ORDER.map((c) => (
          <section key={c} className="card">
            <h3>
              <span className={`dot c-${c}`} /> {CENTERS[c].name}
            </h3>
            <p className="muted">{CENTER_INFO[c][0]}</p>
            <p>
              <strong>Defined:</strong> {CENTER_INFO[c][1]}
            </p>
            <p>
              <strong>Open:</strong> {CENTER_INFO[c][2]}
            </p>
            <p className="muted">Gates {CENTERS[c].gates.join(', ')}</p>
          </section>
        ))}

      {(tab === 'Gates' || tab === 'Channels') && (
        <section className="card">
          <input className="search" placeholder={`Search ${tab.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} />
          <ul className="list">
            {tab === 'Gates'
              ? Object.entries(GATES)
                  .filter(([g, [n, d]]) => match(`${g} ${n} ${d}`))
                  .map(([g, [n, d]]) => (
                    <li key={g}>
                      <span className="tag">{g}</span>
                      <div>
                        <strong>{n}</strong>
                        <p>
                          {d} <span className="muted">· {CENTERS[GATE_CENTER[g]].name}</span>
                        </p>
                      </div>
                    </li>
                  ))
              : CHANNELS.filter((c) => match(`${c.id} ${c.name}`)).map((c) => (
                  <li key={c.id}>
                    <span className="tag">{c.id}</span>
                    <div>
                      <strong>Channel of {c.name}</strong>
                      <p className="muted">
                        {CENTERS[GATE_CENTER[c.gates[0]]].name} ↔ {CENTERS[GATE_CENTER[c.gates[1]]].name}
                      </p>
                    </div>
                  </li>
                ))}
          </ul>
        </section>
      )}
    </div>
  );
}

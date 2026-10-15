import { useState } from 'react';
import BirthForm from './components/BirthForm.jsx';
import ChartView from './views/ChartView.jsx';
import TodayView from './views/TodayView.jsx';
import ConnectView from './views/ConnectView.jsx';
import LearnView from './views/LearnView.jsx';
import { chartFor, useProfiles } from './store.js';

const TABS = [
  { id: 'today', label: 'Today', icon: '☀︎' },
  { id: 'chart', label: 'My Chart', icon: '✦' },
  { id: 'connect', label: 'Connect', icon: '∞' },
  { id: 'learn', label: 'Learn', icon: '☾' },
];

export default function App() {
  const [profiles, setProfiles] = useProfiles();
  const [activeId, setActiveId] = useState(profiles[0]?.id);
  const [tab, setTab] = useState('chart');
  const [editing, setEditing] = useState(null); // null | 'new' | profile

  const active = profiles.find((p) => p.id === activeId) || profiles[0];

  const save = (p) => {
    setProfiles((list) => (list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? p : x)) : [...list, p]));
    if (editing !== 'partner') setActiveId(p.id);
    setEditing(null);
  };

  const remove = (id) => {
    if (!confirm('Delete this chart?')) return;
    setProfiles((list) => list.filter((p) => p.id !== id));
    if (id === activeId) setActiveId(undefined);
  };

  if (!active || editing) {
    return (
      <div className="app">
        <Stars />
        <main className="onboard">
          {!active && (
            <div className="brand-big">
              <span className="logo">✦</span>
              <h1>Zodiac Human</h1>
              <p>Discover your energetic blueprint — type, strategy, authority and the gates that make you, you.</p>
            </div>
          )}
          <BirthForm
            key={editing?.id || editing || 'first'}
            initial={typeof editing === 'object' ? editing : null}
            title={editing === 'partner' ? 'Add a person' : typeof editing === 'object' && editing ? 'Edit chart' : 'Create your chart'}
            onSave={save}
            onCancel={active ? () => setEditing(null) : null}
          />
        </main>
      </div>
    );
  }

  const chart = chartFor(active);

  return (
    <div className="app">
      <Stars />
      <header className="top">
        <div className="brand">
          <span className="logo">✦</span> Zodiac Human
        </div>
        <div className="who">
          <select value={active.id} onChange={(e) => setActiveId(e.target.value)} aria-label="Active chart">
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="btn ghost sm" onClick={() => setEditing(active)} title="Edit birth data">
            Edit
          </button>
          <button className="btn ghost sm" onClick={() => setEditing('new')} title="Add a chart">
            +
          </button>
          <button className="btn ghost sm" onClick={() => remove(active.id)} title="Delete chart">
            ✕
          </button>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={t.id === tab ? 'on' : ''} onClick={() => (setTab(t.id), window.scrollTo(0, 0))}>
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'today' && <TodayView profile={active} chart={chart} />}
        {tab === 'chart' && <ChartView profile={active} chart={chart} />}
        {tab === 'connect' && <ConnectView profile={active} profiles={profiles} onAdd={() => setEditing('partner')} />}
        {tab === 'learn' && <LearnView />}
        <footer className="foot muted">
          Born {active.date} {active.unknownTime ? '(time unknown)' : active.time} · {active.place || active.tz}. Calculations use the tropical
          zodiac and true node. For self-reflection, not medical or financial advice.
        </footer>
      </main>
    </div>
  );
}

function Stars() {
  return <div className="stars" aria-hidden="true" />;
}

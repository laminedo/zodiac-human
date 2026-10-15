import { useEffect, useMemo, useState } from 'react';

const ZONES = (() => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return ['UTC'];
  }
})();

export default function BirthForm({ initial, onSave, onCancel, title = 'Create your chart' }) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date || '');
  const [time, setTime] = useState(initial?.time || '12:00');
  const [unknownTime, setUnknownTime] = useState(initial?.unknownTime || false);
  const [query, setQuery] = useState(initial?.place || '');
  const [place, setPlace] = useState(initial?.place ? { label: initial.place, tz: initial.tz } : null);
  const [tz, setTz] = useState(initial?.tz || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2 || place?.label === query) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&format=json&name=${encodeURIComponent(query)}`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = await res.json();
        setResults(
          (data.results || []).map((r) => ({
            label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
            tz: r.timezone,
          })),
        );
      } catch {
        if (!ctrl.signal.aborted) setResults([]);
      } finally {
        if (!ctrl.signal.aborted) setSearching(false);
      }
    }, 300);
    return () => (clearTimeout(t), ctrl.abort());
  }, [query, place]);

  const valid = name.trim() && date && (unknownTime || time) && tz;
  const pick = (r) => {
    setPlace(r);
    setQuery(r.label);
    if (r.tz) setTz(r.tz);
    setResults([]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSave({
      id: initial?.id || crypto.randomUUID(),
      name: name.trim(),
      date,
      time: unknownTime ? '12:00' : time,
      unknownTime,
      place: place?.label || query,
      tz,
    });
  };

  const zoneOptions = useMemo(() => (ZONES.includes(tz) ? ZONES : [tz, ...ZONES]), [tz]);

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{title}</h2>
      <p className="muted">Your chart is calculated from the exact moment and place you were born.</p>

      <label>
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus />
      </label>

      <div className="row2">
        <label>
          <span>Birth date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max="2100-12-31" />
        </label>
        <label>
          <span>Birth time</span>
          <input type="time" value={time} disabled={unknownTime} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>
      <label className="check">
        <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} />
        <span>I don’t know my birth time (uses 12:00 — profile and some gates may be off)</span>
      </label>

      <label className="place">
        <span>Birth place</span>
        <input
          value={query}
          onChange={(e) => (setQuery(e.target.value), setPlace(null))}
          placeholder="Start typing a city…"
          autoComplete="off"
        />
        {(results.length > 0 || searching) && (
          <ul className="suggest">
            {searching && !results.length && <li className="muted">Searching…</li>}
            {results.map((r, i) => (
              <li key={i}>
                <button type="button" onClick={() => pick(r)}>
                  {r.label} <small>{r.tz}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </label>

      <label>
        <span>Time zone</span>
        <select value={tz} onChange={(e) => setTz(e.target.value)}>
          {zoneOptions.map((z) => (
            <option key={z}>{z}</option>
          ))}
        </select>
      </label>

      <div className="actions">
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="btn primary" disabled={!valid}>
          Reveal my design ✦
        </button>
      </div>
    </form>
  );
}

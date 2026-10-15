import { useEffect, useMemo, useState } from 'react';

const ZONES = (() => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return ['UTC'];
  }
})();

// Typed birth date in MM/DD/YYYY; slashes are inserted as you type.
function formatDateDigits(value) {
  const d = value.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function toIsoDate(text) {
  const m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  const [, mm, dd, yyyy] = m.map(Number);
  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  const valid = yyyy >= 1800 && yyyy <= 2100 && d.getUTCMonth() === mm - 1 && d.getUTCDate() === dd;
  return valid ? `${m[3]}-${m[1]}-${m[2]}` : '';
}

const fromIsoDate = (iso) => (iso ? `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(0, 4)}` : '');

export default function BirthForm({ initial, onSave, onCancel, title = 'Create your chart' }) {
  const [name, setName] = useState(initial?.name || '');
  const [dateText, setDateText] = useState(fromIsoDate(initial?.date));
  const date = toIsoDate(dateText);
  const dateInvalid = dateText.length === 10 && !date;
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
          <input
            value={dateText}
            onChange={(e) => setDateText(formatDateDigits(e.target.value))}
            placeholder="MM/DD/YYYY"
            inputMode="numeric"
            autoComplete="bday"
            maxLength={10}
            aria-invalid={dateInvalid}
            className={dateInvalid ? 'invalid' : undefined}
          />
          {dateInvalid && <small className="field-error">That date doesn’t exist — check month and day.</small>}
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

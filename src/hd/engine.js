import * as Astronomy from 'astronomy-engine';
import { WHEEL, WHEEL_START, CHANNELS, GATE_CENTER, CENTER_ORDER, MOTORS, PLANETS } from './data.js';

const GATE_SPAN = 360 / 64;
const LINE_SPAN = GATE_SPAN / 6;
const norm = (d) => ((d % 360) + 360) % 360;

const BODIES = {
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

export function lonToGate(lon) {
  const offset = norm(lon - WHEEL_START);
  const idx = Math.floor(offset / GATE_SPAN);
  const within = offset - idx * GATE_SPAN;
  const line = Math.min(6, Math.floor(within / LINE_SPAN) + 1);
  return { gate: WHEEL[idx], line, lon: norm(lon) };
}

function sunLon(time) {
  return Astronomy.SunPosition(time).elon;
}

// Osculating (true) lunar node, in the true ecliptic of date.
function trueNodeLon(time) {
  const state = Astronomy.RotateState(Astronomy.Rotation_EQJ_ECT(time), Astronomy.GeoMoonState(time));
  const hx = state.y * state.vz - state.z * state.vy;
  const hy = state.z * state.vx - state.x * state.vz;
  return norm((Math.atan2(hx, -hy) * 180) / Math.PI);
}

export function planetLongitudes(date) {
  const time = Astronomy.MakeTime(date);
  const sun = sunLon(time);
  const node = trueNodeLon(time);
  const out = { sun, earth: norm(sun + 180), nnode: node, snode: norm(node + 180) };
  for (const [id, body] of Object.entries(BODIES)) {
    out[id] = Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true)).elon;
  }
  return out;
}

export function activations(date) {
  const lons = planetLongitudes(date);
  return PLANETS.map((p) => ({ planet: p.id, ...lonToGate(lons[p.id]) }));
}

// The design moment: when the Sun was 88° of arc before its birth position.
export function designDate(birthDate) {
  const target = norm(sunLon(Astronomy.MakeTime(birthDate)) - 88);
  let t = new Date(birthDate.getTime() - 89 * 86400000);
  for (let i = 0; i < 20; i++) {
    let diff = norm(target - sunLon(Astronomy.MakeTime(t)));
    if (diff > 180) diff -= 360;
    if (Math.abs(diff) < 1e-6) break;
    t = new Date(t.getTime() + (diff / 0.9856) * 86400000);
  }
  return t;
}

function components(nodes, edges) {
  const adj = Object.fromEntries(nodes.map((n) => [n, new Set()]));
  for (const [a, b] of edges) {
    adj[a].add(b);
    adj[b].add(a);
  }
  const seen = new Set();
  const groups = [];
  for (const n of nodes) {
    if (seen.has(n)) continue;
    const group = [];
    const stack = [n];
    seen.add(n);
    while (stack.length) {
      const cur = stack.pop();
      group.push(cur);
      for (const nb of adj[cur]) if (!seen.has(nb)) (seen.add(nb), stack.push(nb));
    }
    groups.push(group);
  }
  return groups;
}

// Derives centers, channels, type, authority etc. from a set of active gates.
export function analyzeGates(gateSet) {
  const channels = CHANNELS.filter((c) => gateSet.has(c.gates[0]) && gateSet.has(c.gates[1]));
  const edges = channels.map((c) => c.gates.map((g) => GATE_CENTER[g]));
  const defined = CENTER_ORDER.filter((c) => edges.some((e) => e.includes(c)));
  const groups = components(defined, edges);
  const groupOf = (c) => groups.find((g) => g.includes(c)) || [];
  const connected = (a, b) => groupOf(a).includes(b);
  const has = (c) => defined.includes(c);

  const motorToThroat = has('throat') && MOTORS.some((m) => has(m) && connected('throat', m));
  let type;
  if (!defined.length) type = 'Reflector';
  else if (has('sacral')) type = motorToThroat ? 'Manifesting Generator' : 'Generator';
  else type = motorToThroat ? 'Manifestor' : 'Projector';

  const channelDefined = (id) => channels.some((c) => c.id === id);
  let authority;
  if (type === 'Reflector') authority = 'Lunar';
  else if (has('solar')) authority = 'Emotional';
  else if (has('sacral')) authority = 'Sacral';
  else if (has('spleen')) authority = 'Splenic';
  else if (has('heart')) authority = channelDefined('21-45') ? 'Ego Manifested' : 'Ego Projected';
  else if (has('g') && connected('g', 'throat')) authority = 'Self-Projected';
  else authority = 'Mental / Environmental';

  const definition =
    ['No Definition', 'Single Definition', 'Split Definition', 'Triple Split', 'Quadruple Split'][groups.length] ||
    'Quadruple Split';

  return { channels, defined, type, authority, definition, groups };
}

export function buildChart(birthDate) {
  const dDate = designDate(birthDate);
  const personality = activations(birthDate);
  const design = activations(dDate);
  const gateSet = new Set([...personality, ...design].map((a) => a.gate));
  const analysis = analyzeGates(gateSet);

  const pSun = personality[0];
  const pEarth = personality[1];
  const dSun = design[0];
  const dEarth = design[1];
  const profile = `${pSun.line}/${dSun.line}`;
  const angle = pSun.line <= 3 || (pSun.line === 4 && dSun.line !== 1) ? 'Right Angle' : pSun.line === 4 ? 'Juxtaposition' : 'Left Angle';

  return {
    birthDate,
    designDate: dDate,
    personality,
    design,
    gates: gateSet,
    profile,
    profileLines: [pSun.line, dSun.line],
    cross: { angle, gates: [pSun.gate, pEarth.gate, dSun.gate, dEarth.gate] },
    ...analysis,
  };
}

// Converts a wall-clock time in an IANA zone into a UTC Date.
export function zonedToUtc(dateStr, timeStr, timeZone) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const offsetAt = (ms) => {
    const p = Object.fromEntries(fmt.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - ms;
  };
  let utc = wall - offsetAt(wall);
  utc = wall - offsetAt(utc);
  return new Date(utc);
}

const COMPAT_KINDS = {
  electromagnetic: 'Electromagnetic — attraction: each of you brings one half.',
  companionship: 'Companionship — you both share this channel.',
  dominance: 'Dominance — one of you carries it fully; the other learns from it.',
  compromise: 'Compromise — one has it fully, the other only half.',
};

export function compareCharts(a, b) {
  const rows = [];
  for (const c of CHANNELS) {
    const [g1, g2] = c.gates;
    const aFull = a.gates.has(g1) && a.gates.has(g2);
    const bFull = b.gates.has(g1) && b.gates.has(g2);
    const aAny = a.gates.has(g1) || a.gates.has(g2);
    const bAny = b.gates.has(g1) || b.gates.has(g2);
    let kind = null;
    if (aFull && bFull) kind = 'companionship';
    else if (aFull || bFull) kind = (aFull ? bAny : aAny) ? 'compromise' : 'dominance';
    else if ((a.gates.has(g1) && b.gates.has(g2) && !a.gates.has(g2)) || (a.gates.has(g2) && b.gates.has(g1) && !a.gates.has(g1)))
      kind = 'electromagnetic';
    if (kind) rows.push({ channel: c, kind, owner: aFull && !bFull ? 'a' : bFull && !aFull ? 'b' : null });
  }
  const combined = analyzeGates(new Set([...a.gates, ...b.gates]));
  return { rows, combined, kinds: COMPAT_KINDS };
}

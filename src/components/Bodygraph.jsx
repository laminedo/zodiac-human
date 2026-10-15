import { CENTERS, CHANNELS, GATE_CENTER } from '../hd/data.js';

const GATE_POS = {
  64: [178, 78], 61: [200, 78], 63: [222, 78],
  47: [178, 120], 24: [200, 120], 4: [222, 120], 17: [182, 140], 11: [218, 140], 43: [200, 160],
  62: [178, 217], 23: [200, 217], 56: [222, 217], 16: [172, 237], 20: [172, 258], 35: [228, 232],
  12: [228, 250], 45: [228, 268], 31: [180, 280], 8: [200, 280], 33: [220, 280],
  1: [200, 336], 7: [184, 352], 13: [216, 352], 10: [166, 370], 25: [234, 370], 15: [184, 388], 46: [216, 388], 2: [200, 404],
  21: [282, 404], 51: [264, 424], 26: [284, 426], 40: [304, 426],
  48: [45, 442], 57: [62, 455], 44: [80, 466], 50: [100, 480], 32: [80, 494], 28: [62, 505], 18: [45, 518],
  36: [355, 442], 22: [338, 455], 37: [320, 466], 6: [300, 480], 49: [320, 494], 55: [338, 505], 30: [355, 518],
  5: [178, 474], 14: [200, 474], 29: [222, 474], 34: [172, 495], 27: [172, 518], 59: [228, 518], 42: [178, 532], 3: [200, 532], 9: [222, 532],
  53: [178, 580], 60: [200, 580], 52: [222, 580], 54: [172, 598], 38: [172, 613], 58: [172, 628], 19: [228, 598], 39: [228, 613], 41: [228, 628],
};

const WAYPOINTS = { '20-34': [[138, 370]] };

const SHAPES = {
  head: { kind: 'poly', points: '200,25 152,90 248,90' },
  ajna: { kind: 'poly', points: '152,108 248,108 200,178' },
  throat: { kind: 'rect', x: 160, y: 205, w: 80, h: 87 },
  g: { kind: 'poly', points: '200,320 250,370 200,420 150,370' },
  heart: { kind: 'poly', points: '284,382 244,438 322,438' },
  spleen: { kind: 'poly', points: '32,424 32,536 116,480' },
  solar: { kind: 'poly', points: '368,424 368,536 284,480' },
  sacral: { kind: 'rect', x: 160, y: 462, w: 80, h: 82 },
  root: { kind: 'rect', x: 160, y: 568, w: 80, h: 72 },
};

const CENTER_COLORS = {
  head: '#f4cf62', ajna: '#6fd39a', throat: '#c79466', g: '#f4cf62', heart: '#ff6b78',
  sacral: '#ff6b78', solar: '#c79466', spleen: '#c79466', root: '#c79466',
};

function halfPath(points) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const len = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    segs.push(len);
    total += len;
  }
  const out = [points[0]];
  let remaining = total / 2;
  for (let i = 0; i < segs.length; i++) {
    const [a, b] = [points[i], points[i + 1]];
    if (segs[i] >= remaining) {
      const f = remaining / segs[i];
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      break;
    }
    out.push(b);
    remaining -= segs[i];
  }
  return out.map((p) => p.join(',')).join(' ');
}

function ColoredLine({ points, colors, width = 6 }) {
  if (!colors.length) return null;
  if (colors.length === 1) {
    return <polyline points={points} fill="none" stroke={colors[0]} strokeWidth={width} strokeLinecap="butt" />;
  }
  const dash = 5;
  return colors.map((c, i) => (
    <polyline
      key={c}
      points={points}
      fill="none"
      stroke={c}
      strokeWidth={width}
      strokeDasharray={`${dash} ${dash * (colors.length - 1)}`}
      strokeDashoffset={-i * dash}
    />
  ));
}

/**
 * layers: [{ gates: Set<number>, color: string, label?: string }]
 * defined: centers to fill.
 */
export default function Bodygraph({ layers, defined = [], onGateClick, highlight }) {
  const gateColors = (g) => layers.filter((l) => l.gates.has(g)).map((l) => l.color);
  const definedSet = new Set(defined);

  return (
    <svg className="bodygraph" viewBox="0 0 400 660" role="img" aria-label="Human Design bodygraph">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="channels">
        {CHANNELS.map((c) => {
          const [a, b] = c.gates;
          const pts = [GATE_POS[a], ...(WAYPOINTS[c.id] || []), GATE_POS[b]];
          const full = pts.map((p) => p.join(',')).join(' ');
          const isHi = highlight === c.id;
          return (
            <g key={c.id}>
              <polyline points={full} fill="none" stroke="var(--channel-off)" strokeWidth={isHi ? 9 : 6} />
              <ColoredLine points={halfPath(pts)} colors={gateColors(a)} />
              <ColoredLine points={halfPath([...pts].reverse())} colors={gateColors(b)} />
            </g>
          );
        })}
      </g>

      <g className="centers">
        {Object.entries(SHAPES).map(([id, s]) => {
          const on = definedSet.has(id);
          const props = {
            fill: on ? CENTER_COLORS[id] : 'var(--center-off)',
            stroke: on ? CENTER_COLORS[id] : 'var(--center-stroke)',
            strokeWidth: 1.5,
            strokeLinejoin: 'round',
            filter: on ? 'url(#glow)' : undefined,
          };
          return s.kind === 'rect' ? (
            <rect key={id} x={s.x} y={s.y} width={s.w} height={s.h} rx={8} {...props}>
              <title>{CENTERS[id].name}</title>
            </rect>
          ) : (
            <polygon key={id} points={s.points} {...props}>
              <title>{CENTERS[id].name}</title>
            </polygon>
          );
        })}
      </g>

      <g className="gates">
        {Object.entries(GATE_POS).map(([g, [x, y]]) => {
          const gate = Number(g);
          const colors = gateColors(gate);
          const onCenter = definedSet.has(GATE_CENTER[gate]);
          return (
            <g key={g} className="gate" onClick={onGateClick ? () => onGateClick(gate) : undefined}>
              <circle
                cx={x}
                cy={y}
                r={7}
                fill={colors[0] || (onCenter ? 'rgba(0,0,0,0.18)' : 'var(--gate-off)')}
                stroke={colors[1] || 'none'}
                strokeWidth={colors[1] ? 2 : 0}
              />
              <text x={x} y={y + 2.6} textAnchor="middle" className={colors.length ? 'gate-num on' : 'gate-num'}>
                {g}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

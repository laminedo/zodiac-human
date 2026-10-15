import { buildChart, zonedToUtc } from '../src/hd/engine.js';
// Ra Uru Hu — widely published as a 5/1 Emotional Manifestor.
const birth = zonedToUtc('1948-04-09', '00:14', 'America/Toronto');
const c = buildChart(birth);
console.log(birth.toISOString(), c.designDate.toISOString());
console.log(c.type, c.profile, c.authority, c.definition, c.cross);
console.log(c.channels.map((x) => x.id).join(' '), '|', c.defined.join(' '));
console.log('P', c.personality.map((a) => `${a.planet}:${a.gate}.${a.line}`).join(' '));
console.log('D', c.design.map((a) => `${a.planet}:${a.gate}.${a.line}`).join(' '));

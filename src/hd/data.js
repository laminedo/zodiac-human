// Static Human Design reference data.

// Gate order around the wheel, starting at 2° Aquarius (302° tropical).
export const WHEEL = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
];
export const WHEEL_START = 302;

export const CENTERS = {
  head: { name: 'Head', gates: [64, 61, 63] },
  ajna: { name: 'Ajna', gates: [47, 24, 4, 17, 43, 11] },
  throat: { name: 'Throat', gates: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16] },
  g: { name: 'G / Identity', gates: [7, 1, 13, 10, 25, 46, 2, 15] },
  heart: { name: 'Heart / Ego', gates: [21, 40, 26, 51] },
  sacral: { name: 'Sacral', gates: [5, 14, 29, 59, 9, 3, 42, 27, 34] },
  solar: { name: 'Solar Plexus', gates: [36, 22, 37, 6, 49, 55, 30] },
  spleen: { name: 'Spleen', gates: [48, 57, 44, 50, 32, 28, 18] },
  root: { name: 'Root', gates: [53, 60, 52, 19, 39, 41, 58, 38, 54] },
};
export const CENTER_ORDER = ['head', 'ajna', 'throat', 'g', 'heart', 'spleen', 'solar', 'sacral', 'root'];
export const MOTORS = ['sacral', 'solar', 'heart', 'root'];

export const GATE_CENTER = {};
for (const [id, c] of Object.entries(CENTERS)) for (const g of c.gates) GATE_CENTER[g] = id;

export const CHANNELS = [
  [1, 8, 'Inspiration'], [2, 14, 'The Beat'], [3, 60, 'Mutation'], [4, 63, 'Logic'],
  [5, 15, 'Rhythm'], [6, 59, 'Intimacy'], [7, 31, 'The Alpha'], [9, 52, 'Concentration'],
  [10, 20, 'Awakening'], [10, 34, 'Exploration'], [10, 57, 'Perfected Form'], [11, 56, 'Curiosity'],
  [12, 22, 'Openness'], [13, 33, 'The Prodigal'], [16, 48, 'The Wavelength'], [17, 62, 'Acceptance'],
  [18, 58, 'Judgment'], [19, 49, 'Synthesis'], [20, 34, 'Charisma'], [20, 57, 'The Brainwave'],
  [21, 45, 'Money'], [23, 43, 'Structuring'], [24, 61, 'Awareness'], [25, 51, 'Initiation'],
  [26, 44, 'Surrender'], [27, 50, 'Preservation'], [28, 38, 'Struggle'], [29, 46, 'Discovery'],
  [30, 41, 'Recognition'], [32, 54, 'Transformation'], [34, 57, 'Power'], [35, 36, 'Transitoriness'],
  [37, 40, 'Community'], [39, 55, 'Emoting'], [42, 53, 'Maturation'], [47, 64, 'Abstraction'],
].map(([a, b, name]) => ({ id: `${a}-${b}`, gates: [a, b], name }));

export const GATES = {
  1: ['Self-Expression', 'Creative drive to express your unique direction.'],
  2: ['Direction of the Self', 'Inner compass that knows where life should go.'],
  3: ['Ordering', 'Bringing new order out of initial chaos.'],
  4: ['Formulization', 'Mental answers and logical formulas.'],
  5: ['Fixed Rhythms', 'Natural timing, routines and patience.'],
  6: ['Friction', 'Emotional boundaries that regulate intimacy.'],
  7: ['The Role of the Self', 'Leadership through guiding direction.'],
  8: ['Contribution', 'Making an authentic contribution by being yourself.'],
  9: ['Focus', 'The power to concentrate on details.'],
  10: ['Behavior of the Self', 'Loving yourself and living your own way.'],
  11: ['Ideas', 'A stream of concepts and images to share.'],
  12: ['Caution', 'Articulating feelings at the right moment.'],
  13: ['The Listener', 'Holding secrets and the stories of others.'],
  14: ['Power Skills', 'Fuel for work that empowers direction.'],
  15: ['Extremes', 'Embracing the full spectrum of human rhythms.'],
  16: ['Skills', 'Enthusiasm and mastery through repetition.'],
  17: ['Opinions', 'Organizing the future into a point of view.'],
  18: ['Correction', 'Seeing what can be improved and perfected.'],
  19: ['Wanting', 'Sensitivity to needs: food, shelter, belonging.'],
  20: ['The Now', 'Present-moment awareness put into action.'],
  21: ['The Hunter / Huntress', 'The need to control resources.'],
  22: ['Openness', 'Emotional grace and social charm.'],
  23: ['Assimilation', 'Translating insight into simple words.'],
  24: ['Rationalization', 'Returning to a thought until it makes sense.'],
  25: ['Spirit of the Self', 'Universal love and innocence.'],
  26: ['The Egoist', 'Persuasion, sales and memory.'],
  27: ['Caring', 'Nurturing and protecting others.'],
  28: ['The Game Player', 'Finding what is truly worth the struggle.'],
  29: ['Perseverance', 'Commitment — the power of a correct yes.'],
  30: ['Recognition of Feelings', 'Desire and the fire of new experience.'],
  31: ['Influence', 'A voice that leads when elected.'],
  32: ['Continuity', 'Instinct for what will endure.'],
  33: ['Privacy', 'Retreat to reflect, then share wisdom.'],
  34: ['Power', 'Pure, independent life force.'],
  35: ['Change', 'Hunger for progress through experience.'],
  36: ['Crisis', 'Growth through emotional turbulence.'],
  37: ['Friendship', 'Bargains and warmth that bind community.'],
  38: ['The Fighter', 'Struggling for what gives life purpose.'],
  39: ['Provocation', 'Provoking spirit in others.'],
  40: ['Aloneness', 'Working hard, then needing rest.'],
  41: ['Contraction', 'The seed of fantasy and new experience.'],
  42: ['Growth', 'Finishing cycles and maximizing them.'],
  43: ['Insight', 'Sudden breakthroughs of knowing.'],
  44: ['Alertness', 'Instinctive memory of patterns.'],
  45: ['The Gatherer', 'Natural ruler of resources and education.'],
  46: ['Determination of the Self', 'Love of the body and serendipity.'],
  47: ['Realization', 'Making sense of past experience.'],
  48: ['Depth', 'Depth of knowledge and fear of inadequacy.'],
  49: ['Principles', 'Revolution based on principle.'],
  50: ['Values', 'Guardian of values and responsibility.'],
  51: ['Shock', 'Initiation through the unexpected.'],
  52: ['Stillness', 'Focused, inactive concentration.'],
  53: ['Beginnings', 'Pressure to start something new.'],
  54: ['Ambition', 'Drive for material and spiritual rise.'],
  55: ['Spirit', 'Abundance found within the emotional wave.'],
  56: ['Stimulation', 'Storyteller sharing experience.'],
  57: ['Intuitive Clarity', 'Acute in-the-moment intuition.'],
  58: ['Vitality', 'Joy of life and drive to improve.'],
  59: ['Sexuality', 'Breaking barriers for intimacy.'],
  60: ['Acceptance', 'Working within limitation for mutation.'],
  61: ['Mystery', 'Pressure to know the unknowable.'],
  62: ['Details', 'Naming and organizing facts.'],
  63: ['Doubt', 'Logical questioning of patterns.'],
  64: ['Confusion', 'Mental images resolving over time.'],
};

export const PLANETS = [
  { id: 'sun', name: 'Sun', glyph: '☉' },
  { id: 'earth', name: 'Earth', glyph: '⊕' },
  { id: 'nnode', name: 'North Node', glyph: '☊' },
  { id: 'snode', name: 'South Node', glyph: '☋' },
  { id: 'moon', name: 'Moon', glyph: '☽' },
  { id: 'mercury', name: 'Mercury', glyph: '☿' },
  { id: 'venus', name: 'Venus', glyph: '♀' },
  { id: 'mars', name: 'Mars', glyph: '♂' },
  { id: 'jupiter', name: 'Jupiter', glyph: '♃' },
  { id: 'saturn', name: 'Saturn', glyph: '♄' },
  { id: 'uranus', name: 'Uranus', glyph: '♅' },
  { id: 'neptune', name: 'Neptune', glyph: '♆' },
  { id: 'pluto', name: 'Pluto', glyph: '♇' },
];

export const TYPES = {
  Generator: {
    strategy: 'Wait to respond',
    signature: 'Satisfaction',
    notSelf: 'Frustration',
    aura: 'Open & enveloping',
    summary:
      'You carry the sustainable life force of the defined Sacral. Your energy is magnetic when you respond to what life brings you rather than initiating from the mind. When work lights you up, you can go on and on; when it doesn’t, frustration is the signal.',
  },
  'Manifesting Generator': {
    strategy: 'Wait to respond, then inform',
    signature: 'Satisfaction & Peace',
    notSelf: 'Frustration & Anger',
    aura: 'Open & enveloping',
    summary:
      'A fast, multi-passionate builder. Your Sacral energy is wired to the Throat, so once you respond you can move quickly and skip steps. Inform others before acting to clear resistance, and allow yourself to pivot.',
  },
  Manifestor: {
    strategy: 'Inform before acting',
    signature: 'Peace',
    notSelf: 'Anger',
    aura: 'Closed & repelling',
    summary:
      'You are here to initiate and set things in motion. Your energy comes in bursts and your aura impacts others before you speak. Informing the people affected by your actions removes resistance and brings peace.',
  },
  Projector: {
    strategy: 'Wait for the invitation',
    signature: 'Success',
    notSelf: 'Bitterness',
    aura: 'Focused & absorbing',
    summary:
      'A natural guide who sees deeply into others and systems. You are not built for constant work; your gift is directing energy. Recognition and invitations for the big things in life open the doors to success.',
  },
  Reflector: {
    strategy: 'Wait a lunar cycle (~28 days)',
    signature: 'Surprise',
    notSelf: 'Disappointment',
    aura: 'Resistant & sampling',
    summary:
      'Rare and lunar, with all centers open. You mirror the health of your environment and community. Your place matters more than anything — and big decisions deserve a full moon cycle.',
  },
};

export const AUTHORITIES = {
  Emotional: 'Ride your emotional wave. There is no truth in the now — wait for clarity before deciding.',
  Sacral: 'Trust your gut response in the moment: the “uh-huh” or “un-un” sound of your body.',
  Splenic: 'Listen to the quiet, spontaneous intuition that speaks once, in the moment, for your wellbeing.',
  'Ego Manifested': 'Speak from the heart: what do you truly want, and are you willing to commit to it?',
  'Ego Projected': 'Notice what you say you want when you are invited. Your willpower knows.',
  'Self-Projected': 'Talk it out. Hear your own voice and notice what feels true to your identity and direction.',
  'Mental / Environmental': 'Discuss decisions with trusted people in the right environment, then notice how it sounds.',
  Lunar: 'Give important decisions a full lunar cycle, sampling how they feel as the moon moves.',
};

export const LINES = {
  1: ['Investigator', 'Needs a solid foundation; researches before feeling secure.'],
  2: ['Hermit', 'Natural talent that needs alone time and is called out by others.'],
  3: ['Martyr', 'Learns through trial and error; discovers what works by what doesn’t.'],
  4: ['Opportunist', 'Builds life through networks of friendship and influence.'],
  5: ['Heretic', 'Projected upon as a savior; offers practical universal solutions.'],
  6: ['Role Model', 'Three phases of life, maturing into objective wisdom.'],
};

export const CENTER_INFO = {
  head: ['Inspiration & mental pressure', 'Consistent way of being inspired and questioning.', 'Open to many inspirations; don’t chase every question.'],
  ajna: ['Conceptualizing & processing', 'Fixed, reliable way of thinking.', 'Flexible mind; you don’t need to be certain.'],
  throat: ['Communication & manifestation', 'Consistent voice and way of expressing.', 'Varied expression; wait for the right moment to speak.'],
  g: ['Identity, love & direction', 'Fixed sense of self and direction.', 'Fluid identity; the right places bring the right people.'],
  heart: ['Willpower & self-worth', 'Reliable willpower; you can make and keep promises.', 'Nothing to prove; avoid over-committing.'],
  sacral: ['Life force & work energy', 'Sustainable energy for what lights you up.', 'Know when enough is enough; rest before exhaustion.'],
  solar: ['Emotions & desire', 'You have an emotional wave; clarity comes over time.', 'Empathic; you feel others’ emotions amplified.'],
  spleen: ['Intuition, health & instinct', 'Consistent immune response and in-the-moment intuition.', 'Sensitive to wellbeing; don’t hold on to what’s unhealthy.'],
  root: ['Pressure & adrenaline', 'Consistent way of handling pressure.', 'You don’t need to rush to relieve pressure.'],
};

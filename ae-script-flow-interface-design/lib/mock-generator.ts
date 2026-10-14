import type { Expression } from '@/lib/presets'

const BOUNCE: Expression = {
  property: 'Scale',
  summary: 'Elastic overshoot that decays after the layer appears.',
  code: `// Apply to: Scale
var amp = 0.08;    // bounce strength (0.05 - 0.2)
var freq = 2.5;    // oscillations per second
var decay = 5.0;   // how fast the bounce settles

var t = time - inPoint;
if (t > 0) {
  var bounce = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);
  value + value * bounce;
} else {
  value;
}`,
}

const WIGGLE: Expression = {
  property: 'Position',
  summary: 'Smooth, organic random drift layered on top of the existing position.',
  code: `// Apply to: Position
var freq = 2;      // wiggles per second
var amp = 25;      // max distance in pixels
var octaves = 1;   // detail layers (1 = smoothest)
var ampMult = 0.5; // strength of each extra octave

// Fixed seed keeps the motion consistent between renders
seedRandom(index, true);
wiggle(freq, amp, octaves, ampMult);`,
}

const LOOP: Expression = {
  property: 'Any Keyframed Property',
  summary: 'Repeats your existing keyframes forever. Needs at least two keyframes.',
  code: `// Apply to: Any Keyframed Property
// Loop types: "cycle" (repeat), "pingpong" (back & forth),
// "offset" (continue progression), "continue" (keep velocity)
var loopType = "cycle";
var numKeyframes = 0; // 0 = loop all keyframes

loopOut(loopType, numKeyframes);`,
}

const COUNTER: Expression = {
  property: 'Source Text',
  summary: 'Eased number counter with thousands separators for text layers.',
  code: `// Apply to: Source Text
var startVal = 0;      // starting number
var endVal = 1000;     // final number
var duration = 3;      // seconds to count
var decimals = 0;      // decimal places
var useCommas = true;  // add thousands separators

var t = time - inPoint;
var num = easeOut(t, 0, duration, startVal, endVal);
var str = num.toFixed(decimals);

if (useCommas) {
  var parts = str.split(".");
  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
  str = parts.join(".");
}
str;`,
}

const SMOOTH_MOVE: Expression = {
  property: 'Position',
  summary: 'Versatile eased slide-in from an offset when the layer appears.',
  code: `// Apply to: Position
var offsetX = -300;  // start distance on X (px)
var offsetY = 0;     // start distance on Y (px)
var delay = 0;       // seconds after in point
var duration = 0.8;  // length of the move in seconds

var t = time - inPoint - delay;
var startPos = value + [offsetX, offsetY];
ease(t, 0, duration, startPos, value);`,
}

const RULES: { keywords: string[]; expression: Expression }[] = [
  { keywords: ['bounce', 'elastic'], expression: BOUNCE },
  { keywords: ['wiggle', 'shake'], expression: WIGGLE },
  { keywords: ['loop'], expression: LOOP },
  { keywords: ['counter', 'number', 'count'], expression: COUNTER },
]

export function generateMockExpression(prompt: string): Expression {
  const text = prompt.toLowerCase()
  const match = RULES.find((rule) => rule.keywords.some((word) => text.includes(word)))
  return match?.expression ?? SMOOTH_MOVE
}

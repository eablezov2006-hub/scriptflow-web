import type { Expression } from '@/lib/presets'

function parseNumber(raw: string): number {
  return Number(raw.replace(/,/g, ''))
}

function extractDuration(prompt: string, fallback: number): number {
  const match = prompt.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)\b/i)
  return match ? Number(match[1]) : fallback
}

function buildElasticBounce(prompt: string): Expression {
  const duration = extractDuration(prompt, 0.35)
  const ampMatch = prompt.match(/amp(?:litude)?\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i)
  const freqMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:oscillations|bounces|hz)/i)
  const amp = ampMatch ? Number(ampMatch[1]) : 0.12
  const freq = freqMatch ? Number(freqMatch[1]) : 3.0

  return {
    property: 'Scale',
    summary: 'Pops the layer in from 0% to 100% with an elastic bounce on appearance.',
    code: `// Apply to: Scale (No keyframes required)
var popDuration = ${duration}; // scale-up time in seconds
var amp = ${amp};         // bounce overshoot strength
var freq = ${freq};        // oscillations per second
var decay = 6.0;       // how fast the bounce settles

var t = time - inPoint;
if (t <= 0) {
  [0, 0];
} else if (t < popDuration) {
  easeOut(t, 0, popDuration, [0, 0], value);
} else {
  var dt = t - popDuration;
  var bounce = amp * Math.sin(freq * dt * 2 * Math.PI) / Math.exp(decay * dt);
  value + value * bounce;
}`,
  }
}

function buildWiggle(prompt: string): Expression {
  const freqMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:times?\s*(?:per|a)\s*sec(?:ond)?|hz|wiggles?)/i)
  const ampMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:px|pixels?|units?)/i)

  const freq = freqMatch ? Number(freqMatch[1]) : 2
  const amp = ampMatch ? Number(ampMatch[1]) : 25

  return {
    property: 'Position',
    summary: 'Smooth, organic random drift layered on top of the existing position.',
    code: `// Apply to: Position
var freq = ${freq};      // wiggles per second
var amp = ${amp};      // max distance in pixels
var octaves = 1;   // detail layers (1 = smoothest)
var ampMult = 0.5; // strength of each extra octave

// Fixed seed keeps the motion consistent between renders
seedRandom(index, true);
wiggle(freq, amp, octaves, ampMult);`,
  }
}

function buildLoop(prompt: string): Expression {
  const text = prompt.toLowerCase()
  let loopType = 'pingpong'
  if (text.includes('offset')) loopType = 'offset'
  else if (text.includes('continue')) loopType = 'continue'
  else if (text.includes('cycle') && !text.includes('ping')) loopType = 'cycle'

  const kfMatch = prompt.match(/(\d+)\s*keyframes?/i)
  const numKeyframes = kfMatch ? Number(kfMatch[1]) : 0

  return {
    property: 'Any Keyframed Property',
    summary: 'Repeats your existing keyframes forever. Needs at least two keyframes.',
    code: `// Apply to: Any Keyframed Property
// Loop types: "cycle" (repeat), "pingpong" (back & forth),
// "offset" (continue progression), "continue" (keep velocity)
var loopType = "${loopType}";
var numKeyframes = ${numKeyframes}; // 0 = loop all keyframes

loopOut(loopType, numKeyframes);`,
  }
}

function buildCounter(prompt: string): Expression {
  let startVal = 0
  let endVal = 1000
  const duration = extractDuration(prompt, 3)
  let decimals = 0

  const textWithoutDuration = prompt.replace(/(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)\b/gi, '')

  const rangeMatch = textWithoutDuration.match(
    /(?:from\s+)?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(?:to|-|–|->)\s*(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/i
  )

  if (rangeMatch) {
    startVal = parseNumber(rangeMatch[1])
    endVal = parseNumber(rangeMatch[2])
    const decPart = rangeMatch[2].split('.')[1]
    if (decPart) decimals = decPart.length
  } else {
    const singleMatch = textWithoutDuration.match(/(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/)
    if (singleMatch) {
      endVal = parseNumber(singleMatch[1])
      const decPart = singleMatch[1].split('.')[1]
      if (decPart) decimals = decPart.length
    }
  }

  return {
    property: 'Source Text',
    summary: 'Eased number counter with thousands separators for text layers.',
    code: `// Apply to: Source Text
var startVal = ${startVal};      // starting number
var endVal = ${endVal};     // final number
var duration = ${duration};      // seconds to count
var decimals = ${decimals};      // decimal places
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
}

function buildAutoFade(prompt: string): Expression {
  const fadeTime = extractDuration(prompt, 0.5)

  return {
    property: 'Opacity',
    summary: 'Automatically fades opacity in at layer start and out at layer end.',
    code: `// Apply to: Opacity (No keyframes required)
var fadeInTime = ${fadeTime};  // fade-in duration in seconds
var fadeOutTime = ${fadeTime}; // fade-out duration in seconds

var fadeInVal = linear(time, inPoint, inPoint + fadeInTime, 0, value);
var fadeOutVal = linear(time, outPoint - fadeOutTime, outPoint, value, 0);

Math.min(fadeInVal, fadeOutVal);`,
  }
}

function buildTypewriter(prompt: string): Expression {
  const text = prompt.toLowerCase()
  const showCursor = !text.includes('no cursor') && !text.includes('without cursor') && !text.includes('without a cursor')
  const durationMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)\b/i)
  const speedMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:chars?|characters?)\s*(?:per|\/)\s*sec/i)

  const duration = durationMatch ? Number(durationMatch[1]) : 0
  const charsPerSec = speedMatch ? Number(speedMatch[1]) : 18

  return {
    property: 'Source Text',
    summary: 'Reveals text character by character with an optional blinking cursor.',
    code: `// Apply to: Source Text
var charsPerSec = ${charsPerSec};     // typing speed (if duration is 0)
var totalDuration = ${duration};    // set > 0 to fit exact seconds
var showCursor = ${showCursor};    // blinking "|" cursor
var cursorChar = "|";

var fullText = value;
var t = Math.max(0, time - inPoint);
var count = totalDuration > 0
  ? Math.floor(linear(t, 0, totalDuration, 0, fullText.length))
  : Math.floor(t * charsPerSec);

count = Math.min(count, fullText.length);
var blink = showCursor && (Math.floor(time * 2) % 2 === 0) ? cursorChar : "";
fullText.substr(0, count) + blink;`,
  }
}

function buildInertialOvershoot(prompt: string): Expression {
  const ampMatch = prompt.match(/amp(?:litude)?\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i)
  const amp = ampMatch ? Number(ampMatch[1]) : 0.05

  return {
    property: 'Any Keyframed Property',
    summary: 'Adds physical momentum and smooth overshoot after your last keyframe.',
    code: `// Apply to: Position, Scale, or Rotation (Requires 2+ keyframes)
var amp = ${amp};   // overshoot strength (0.03 - 0.1)
var freq = 2.0;   // oscillations per second
var decay = 5.5;  // damping speed

var n = 0;
if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) n--;
}

if (n > 0) {
  var t = time - key(n).time;
  var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);
  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);
} else {
  value;
}`,
  }
}

function buildConstantRotation(prompt: string): Expression {
  const degMatch = prompt.match(/(-?\d+(?:\.\d+)?)\s*(?:deg|degrees?|°)/i)
  let speed = degMatch ? Number(degMatch[1]) : 90
  if (/counter[\s-]?clockwise|ccw|reverse/i.test(prompt) && speed > 0) {
    speed = -speed
  }

  return {
    property: 'Rotation',
    summary: 'Continuously rotates the layer at a constant speed without keyframes.',
    code: `// Apply to: Rotation (No keyframes required)
var degreesPerSecond = ${speed}; // positive = clockwise, negative = CCW

value + (time - inPoint) * degreesPerSecond;`,
  }
}

function buildMarkerTrigger(prompt: string): Expression {
  const duration = extractDuration(prompt, 0.5)
  const scaleMatch = prompt.match(/(\d+(?:\.\d+)?)\s*%/i)
  const popAmount = scaleMatch ? Number(scaleMatch[1]) : 20

  return {
    property: 'Scale',
    summary: 'Triggers a smooth scale pulse every time the playhead hits a layer marker.',
    code: `// Apply to: Scale (Add markers to layer with "*" key)
var animDuration = ${duration}; // pulse duration in seconds
var popAmount = ${popAmount};     // scale boost in % (e.g. 20 = 120%)

var scaleBoost = 0;
if (marker.numKeys > 0) {
  var n = marker.nearestKey(time).index;
  if (marker.key(n).time > time) n--;
  if (n > 0) {
    var t = time - marker.key(n).time;
    if (t >= 0 && t < animDuration) {
      var half = animDuration / 2;
      scaleBoost = t < half
        ? easeOut(t, 0, half, 0, popAmount)
        : easeIn(t, half, animDuration, popAmount, 0);
    }
  }
}

value + [scaleBoost, scaleBoost];`,
  }
}

function buildSmoothMove(prompt: string): Expression {
  const duration = extractDuration(prompt, 0.8)
  const pxMatch = prompt.match(/(-?\d+(?:\.\d+)?)\s*(?:px|pixels?)/i)
  const offsetX = pxMatch ? Number(pxMatch[1]) : -300

  return {
    property: 'Position',
    summary: 'Versatile eased slide-in from an offset when the layer appears.',
    code: `// Apply to: Position
var offsetX = ${offsetX};  // start distance on X (px)
var offsetY = 0;     // start distance on Y (px)
var delay = 0;       // seconds after in point
var duration = ${duration};  // length of the move in seconds

var t = time - inPoint - delay;
var startPos = value + [offsetX, offsetY];
ease(t, 0, duration, startPos, value);`,
  }
}

const RULES: { keywords: string[]; build: (prompt: string) => Expression }[] = [
  { keywords: ['inertial', 'overshoot'], build: buildInertialOvershoot },
  { keywords: ['bounce', 'elastic', 'pop-in', 'pop in'], build: buildElasticBounce },
  { keywords: ['wiggle', 'shake'], build: buildWiggle },
  { keywords: ['loop', 'ping-pong', 'pingpong'], build: buildLoop },
  { keywords: ['counter', 'number', 'count'], build: buildCounter },
  { keywords: ['fade', 'opacity'], build: buildAutoFade },
  { keywords: ['typewriter', 'character by character', 'typing', 'cursor'], build: buildTypewriter },
  { keywords: ['rotat', 'spin', 'degrees'], build: buildConstantRotation },
  { keywords: ['marker', 'trigger'], build: buildMarkerTrigger },
]

export function generateMockExpression(prompt: string): Expression {
  const text = prompt.toLowerCase()
  const match = RULES.find((rule) => rule.keywords.some((word) => text.includes(word)))
  return match ? match.build(prompt) : buildSmoothMove(prompt)
}

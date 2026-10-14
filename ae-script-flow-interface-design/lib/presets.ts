export type Expression = {
  property: string
  code: string
  summary: string
}

export const PRESETS = [
  {
    label: 'Elastic Bounce',
    prompt: 'Make the layer scale up with an elastic bounce when it appears, overshooting and settling with decay.',
  },
  {
    label: 'Wiggle Effect',
    prompt: 'Add a smooth random wiggle to the position, 2 times per second with 25 pixels of movement.',
  },
  {
    label: 'Smooth Loop',
    prompt: 'Loop the existing keyframes forever with a seamless ping-pong cycle.',
  },
  {
    label: 'Number Counter',
    prompt: 'Count up a text layer from 0 to 1,000 over 3 seconds with ease out and comma separators.',
  },
  {
    label: 'Auto Fade',
    prompt: 'Automatically fade the layer in over 0.5 seconds at its in point and fade out before its out point.',
  },
] as const

export const SAMPLE_EXPRESSION: Expression = {
  property: 'Scale',
  summary: 'Elastic overshoot that decays after the layer appears.',
  code: `// Elastic bounce on layer entry
var amp = 0.06;    // bounce strength
var freq = 2.5;    // oscillations per second
var decay = 5.0;   // how fast it settles

var t = time - inPoint;
if (t > 0) {
  var bounce = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);
  value + value * bounce;
} else {
  value;
}`,
}

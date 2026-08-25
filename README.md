# Bitsnakes

A single-page Three.js (WebGL) visualization that runs in a browser.
It teaches information theory and distributed systems concepts through a
voxel snake simulation.
There is no backend and no multiplayer mode.

## What it does

The playfield is a 3D lattice of voxel bits, viewed from a fixed isometric
angle. Each snake is one agent's state vector over time — a chain of cubes
that moves one cell per tick, axis-aligned only, classic snake-game style.
Every voxel a snake passes through is a flipped bit: the field lights up
behind each snake and decays.

The simulation compares two coordination encodings:

| Mode | Analogy | Wire format | Failure mode |
|------|---------|-------------|--------------|
| **Naive** | JSON-like | ~14 B per feature + framing, grows with schema | Link congestion → dropped updates → retransmit stalls |
| **Optimized** | Bitmask protocol | Fixed 24 B/agent (192-bit mask) | None until features exceed mask capacity |

## The model (what's real vs. illustrative)

The numbers are chosen so the demo teaches the right lesson:

- **Wire sizes are real estimates.** JSON text costs ~14 B/feature
  (`"f042":0.7351,`); the bitmask is 3× uint64 = 192 bits = 24 B, fixed.
- **Every agent carries an actual 64-bit state vector**, and *Avg Hamming*
  is a true popcount of pairwise XORs — random pairs average 32 of 64 bits,
  correlated zone-mates far fewer. Zone-mates share a template vector with
  per-bit noise ∝ (1 − correlation) and re-converge via anti-entropy drift.
- **Congestion is modeled, not faked.** Offered load = N × bytes/agent ×
  10 updates/s against an ~8 MB/s link. Naive saturates near N ≈ 400 at 55%
  schema density; the bitmask uses ~3% of the link at N = 1000.
- **Naive "collisions" are write contention.** JSON is self-describing, so
  keys don't collide — the failure is packet loss under congestion
  (loss probability rises with link utilization), shown as
  `UPDATE LOST · WRITE CONTENTION` with both writers stalling (backoff).
- **Bitmask collisions are encoding failures, not spatial ones.** With
  F features ≤ 192 bits the mapping is injective: zero collisions, and
  agents sharing a voxel merge losslessly (bitwise OR). Past 75% schema
  density, F > 192 and an injective mapping is impossible (pigeonhole);
  colliding feature pairs scale as F·(F−1)/2B (birthday paradox), shown as
  `BIT COLLISION · FEATURE OVERWRITTEN` events that actually corrupt the
  agent's state vector.
- **Illustrative, not literal:** the spatial metaphor itself (position ≠
  network topology), the zone tiling as a stand-in for feature locality,
  and a synthetic CPU burn loop that stands in for real JSON serialization
  cost at scale (the shape is right, the numbers are theatrical).

## How to run

```sh
npm run dev
# then open http://localhost:8000
```

`npm run dev` starts a zero-dependency static server (`server.js`,
auto-increments the port if 8000 is taken). Any static server works too,
e.g. `python3 -m http.server 8000`. ES modules can't load over `file://`.

Three.js (pinned r180) is vendored under `vendor/three/` — no build step,
no npm install, and the demo works fully offline.

## Controls

- **Agent Count**: Set from 10 to 1000.
- **Schema Density**: 10% to 100% of a 256-feature schema. Drives JSON size in naive mode and bitmask overflow in optimized mode (overflow past 75% = 192 bits).
- **Feature Correlation**: 0% to 100%. How similar zone-mates' state vectors are — watch Avg Hamming respond.
- **Speed**: Set from 0.25x to 3x.
- **Mode toggle**: Switch between Naive (JSON) and Optimized (Bitmask).
- **Saturation Demo**: Automatically sweep from 10 to 1000 agents.
- **Camera**: Scroll to zoom. Drag to pan once zoomed in. Fixed isometric angle, no orbiting.

## How to see the difference

Set Agent Count to 1000. Press Saturation Demo. Toggle between modes.
Naive mode saturates the link (watch the link % on the bandwidth metric).
Optimized mode stays at 24 B/agent and ~3% link utilization.
Then push Schema Density past 75% in Optimized mode to watch even a
bitmask fail when features outnumber bits.

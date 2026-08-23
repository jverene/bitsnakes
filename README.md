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

When two snakes enter the same voxel, that is a **bit collision**: the bit
flashes red and both agents stall — one feature overwriting another.

The simulation compares two coordination encodings:

| Mode | Analogy | Body | Motion | Cost |
|------|---------|------|--------|------|
| **Naive** | JSON-like | Long (20-40 cells), colorful, erratic | Random turns, roams the whole field | High bandwidth, fails at scale |
| **Optimized** | Bitmask protocol | Short (3-8 cells), muted, clustered | Greedy paths inside feature-zone tiles | Fixed 24 bytes per agent, scales |

The field grows sub-linearly with agent count, so NAIVE mode spatially
saturates — snakes run out of bits and collisions spike — while OPTIMIZED
agents stay packed into their zones at a fixed cost.

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
- **Schema Density**: Set from 10% to 100%. This drives bit-collision probability.
- **Feature Correlation**: Set from 0% to 100%. This controls how tightly the optimized clusters form.
- **Speed**: Set from 0.25x to 3x.
- **Mode toggle**: Switch between Naive (JSON) and Optimized (Bitmask).
- **Saturation Demo**: Automatically sweep from 10 to 1000 agents.
- **Camera**: Scroll to zoom. Drag to pan once zoomed in. Fixed isometric angle, no orbiting.

## How to see the difference

Set Agent Count to 1000. Press Saturation Demo. Toggle between modes.
The Naive mode shows a saturation warning.
The Optimized mode stays smooth at a fixed bandwidth.
This shows why protocol optimization matters at scale.

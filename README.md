# Bitsnakes

This is a single-file canvas visualization that runs in a browser.
It teaches information theory and distributed systems concepts through a snake simulation.
There is no backend and no multiplayer mode.

## What it does

Each snake represents one agent state vector over time.
The simulation compares two coordination encodings:

| Mode | Analogy | Tail | Motion | Cost |
|------|---------|------|--------|------|
| **Naive** | JSON-like | Long (20-40), colorful, erratic | Random target each frame | High bandwidth, fails at scale |
| **Optimized** | Bitmask protocol | Short (3-8), muted, clustered | Bounded to feature zones | Fixed 24 bytes per agent, scales |

## How to run

Open `index.html` in any browser.
No build step and no dependencies.

## Controls

- **Agent Count**: Set from 10 to 1000.
- **Schema Density**: Set from 10% to 100%. This drives bit-collision probability.
- **Feature Correlation**: Set from 0% to 100%. This controls how tightly the optimized clusters form.
- **Speed**: Set from 0.25x to 3x.
- **Mode toggle**: Switch between Naive (JSON) and Optimized (Bitmask).
- **Saturation Demo**: Automatically sweep from 10 to 1000 agents.

## How to see the difference

Set Agent Count to 1000. Press Saturation Demo. Toggle between modes.
The Naive mode shows a saturation warning.
The Optimized mode stays smooth at a fixed bandwidth.
This shows why protocol optimization matters at scale.

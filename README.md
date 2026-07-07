# bitsnakes — Snake Protocol

An interactive single-file canvas visualization that teaches **information theory** and
**distributed systems** concepts through a snake simulation. No backend. No multiplayer.
Just a browser.

Each snake represents **one agent's state vector over time**. The simulation compares two
coordination encodings:

| Mode | Analogy | Tail | Motion | Cost |
|------|---------|------|--------|------|
| **Naive** | JSON-like | long (20–40), colorful, erratic | random target each frame | high bandwidth, chokes at scale |
| **Optimized** | Bitmask protocol | short (3–8), muted, clustered | bounded to feature zones | fixed 24 B/agent, scales |

## Run

Open `index.html` in any browser. No build step, no dependencies.

## Controls

- **Agent Count** (10–1000)
- **Schema Density** (10–100%) — drives bit-collision probability
- **Feature Correlation** (0–100%) — tightens or scatters optimized clusters
- **Speed** (0.25×–3×)
- **Mode toggle** — Naive (JSON) vs Optimized (Bitmask)
- **Saturation Demo** — auto-sweeps 10→1000 agents to dramatize the divergence

## The "aha" moment

Push **Agent Count** toward 1000 (or hit **Saturation Demo**) and toggle modes:
Naive turns into spaghetti and trips the `SATURATION POINT REACHED — JSON CHOKING`
banner; Optimized stays smooth at fixed bandwidth. That's why protocol optimization
matters at scale — and why JSON is fine for small N.

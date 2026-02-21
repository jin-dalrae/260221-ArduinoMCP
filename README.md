# ArduinoMCP

**AI infrastructure for hardware development.**

> From text prompt to verified circuit, firmware, and shopping cart — in one conversation.

---

## The Problem

Hardware prototyping is broken. The workflow hasn't changed in 20 years.

| Pain point | Impact |
|---|---|
| Scattered datasheets across 50+ vendor sites | 70% of dev time lost to search |
| Manual wiring = missed resistors, fried boards | $2.4B/yr in prototype waste (hobbyist + edu) |
| No code generation for embedded | Every project starts from zero |
| BOM management is spreadsheet hell | Orders delayed by days, not minutes |

**$48B global electronics prototyping market. Zero AI-native tools.**

---

## The Solution

ArduinoMCP is an MCP server that turns any LLM into a hardware engineer. One natural-language prompt produces:

1. **Validated circuit schema** with safety checks
2. **Firmware code** (`.ino`) with syntax highlighting
3. **Interactive schematic** rendered in-chat
4. **Priced BOM** with one-click vendor links
5. **3D enclosure** (OpenSCAD) sized to the build

All delivered as a rich widget inside ChatGPT — not a link, not a PDF, a live workspace.

---

## How It Works

```
User: "Build me a temperature monitor with an LCD display"
                        |
              ArduinoMCP (MCP Server)
                        |
        +-------+-------+-------+-------+
        |       |       |       |       |
   generate  validate  write   search  order
   _circuit  _circuit  _code   _parts  _parts
        |       |       |       |       |
        +-------+-------+-------+-------+
                        |
              Widget renders in ChatGPT
              (code + schematic + BOM)
```

**11 tools. 1 unified circuit schema. Fully composable.**

---

## Market

| Segment | Size |
|---|---|
| **TAM** — Global electronics prototyping & EDA tools | $48B |
| **SAM** — Hobbyist, education, & indie hardware | $3.2B |
| **SOM** — AI-assisted Arduino/ESP32 prototyping (Year 1) | $120M |

### Who builds hardware today
- 45M+ Arduino boards sold (cumulative)
- 2.1M monthly active users on Arduino forums
- 300K+ new STEM lab setups annually (US + EU)
- Fastest-growing segment: AI + IoT edge devices

---

## Product

### Core: AI Circuit Builder Widget

A ChatGPT-native workspace that appears inline — no context switching, no tab hopping.

| Feature | Status |
|---|---|
| Natural-language circuit generation | Shipped |
| Rule-based safety validation (voltage, shorts, floating nets) | Shipped |
| Syntax-highlighted `.ino` code generation | Shipped |
| Interactive SVG schematic with VCC/GND rails | Shipped |
| Component search (11 parts, filterable by category/price) | Shipped |
| Instant datasheet lookup with key specs | Shipped |
| BOM export with Adafruit/DigiKey/Mouser links | Shipped |
| 3D enclosure generation (OpenSCAD) | Shipped |
| Photo-to-schema circuit analysis | Shipped |
| Project export (ZIP/PDF/GitHub) | Shipped |
| Improvement suggestions (power, components, code) | Shipped |

### Architecture

```
mcp-use (MCP Server Framework)
    |
    +-- 11 tools (TypeScript, Zod-validated I/O)
    +-- 2 widgets (React 19, Tailwind CSS 4)
    +-- 1 shared CircuitSchema (parts, nets, pin_map, constraints, power)
```

Every tool reads and writes the same normalized schema. Tools compose — `generate_circuit` feeds `validate_circuit` feeds `write_arduino_code` feeds `order_parts`.

---

## Competitive Landscape

| | ArduinoMCP | Fritzing | Tinkercad | Arduino IDE | Wokwi |
|---|---|---|---|---|---|
| AI-native (works inside LLM) | Yes | No | No | No | No |
| Natural language input | Yes | No | No | No | No |
| Code + schematic + BOM in one view | Yes | Partial | Partial | No | Partial |
| Safety validation | Yes | No | No | No | No |
| Vendor links & pricing | Yes | No | No | No | No |
| Zero install | Yes | No | Yes | No | Yes |

**Moat: First MCP server for hardware. Network effects compound as community contributes component libraries and circuit templates.**

---

## Business Model

| Revenue stream | Model |
|---|---|
| **Free tier** | 10 generations/month, community components |
| **Pro** ($19/mo) | Unlimited generations, live vendor APIs, priority support |
| **Team** ($49/seat/mo) | Shared projects, BOM approvals, org component library |
| **Enterprise** | Custom integrations, private component DBs, SLA |

### Expansion vectors
- Live supply chain APIs (DigiKey, Mouser, Farnell) — real-time stock & checkout
- Multi-target: ESP32, Raspberry Pi Pico, custom PCBs
- CAD/CAM automation: PCB layout, Gerber export
- Compile & upload validation

---

## Traction & Milestones

| Milestone | Status |
|---|---|
| 11 MCP tools built and functional | Done |
| 2 custom React widgets (circuit builder + product search) | Done |
| Schema-driven architecture (single source of truth) | Done |
| Safety validation engine (4 rule categories) | Done |
| Hackathon MVP — full generate-validate-code-order pipeline | Done |

### Next 90 days
- [ ] Connect live vendor APIs (DigiKey, Mouser)
- [ ] Launch on ChatGPT Plugin/MCP marketplace
- [ ] 500 beta users from Arduino/maker communities
- [ ] Add ESP32 + Raspberry Pi Pico targets

---

## Technology

| Layer | Stack |
|---|---|
| Runtime | mcp-use (MCP server framework with HMR) |
| Language | TypeScript (strict mode) |
| Validation | Zod (schema-first, runtime-safe) |
| UI | React 19 + Tailwind CSS 4 |
| Widgets | ChatGPT-native via MCP Apps protocol |
| Deploy | Manufact Cloud / Vercel |

### What makes it hard to replicate
- **CircuitSchema**: Normalized data model shared across all 11 tools — every tool composes cleanly
- **Widget protocol**: Custom React components rendered inside ChatGPT, not external links
- **Domain rules**: Electrical safety validation (voltage domains, current limiting, floating nets) encoded in the tool layer

---

## Team

Built at the Manufact Hackathon, Feb 2026.

We are builders who ship fast, think in schemas, and believe hardware development deserves the same AI revolution that software got.

---

## The Ask

Seed round to take ArduinoMCP from hackathon prototype to production MCP server on the ChatGPT marketplace.

**Use of funds:**
- Live vendor API integrations (DigiKey, Mouser, Farnell)
- Multi-target support (ESP32, RPi Pico, custom PCB)
- Community & marketplace launch
- Hire: 1 embedded systems engineer, 1 full-stack

---

## Get Started

```bash
cd ArduinoMCP
npm install
npm run dev
```

Open [localhost:3000/inspector](http://localhost:3000/inspector) to see the widget in action.

```bash
npm run deploy   # Ship to production
```

---

**ArduinoMCP — Build hardware at the speed of thought.**

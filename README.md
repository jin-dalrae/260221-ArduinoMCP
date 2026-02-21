# ArduinoMCP: The Future of Hardware Prototyping 🚀

> **ArduinoMCP is the world’s first AI co-pilot for the physical world.** We bridge the gap between imagination and hardware reality, removing the friction from Arduino development through the power of MCP (Model Context Protocol).

**Current status:** Functional MCP prototype with schema-driven workflow and mock integrations.

---

## ⚡️ The Problem
Hardware development is currently stuck in the 2000s. Developers spend **70% of their time** searching for datasheets, debugging missing resistors, and fighting boilerplate code instead of building. 

**Prototyping is slow, error-prone, and documentation is scattered.**

## 💎 The Solution: ArduinoMCP
ArduinoMCP brings **Generative AI to the Breadboard**. We automate the entire hardware lifecycle—from a simple text description to a verified circuit, functional firmware, and a curated shopping cart.

### 🎥 [Watch the Interactive Demo](http://localhost:3000/inspector)
*(Run locally inside an MCP client like ChatGPT to see our custom React widgets in action)*

---

## 🛠 Product Showcase (Prototype Implemented)

### 1. **AI Circuit Builder (Dynamic UI)**
Our signature **`arduino-circuit-builder`** widget is an all-in-one compact workspace designed for ChatGPT interactions.
*   **Generative Firmware**: Generates starter `.ino` code scaffolds based on requirements and normalized circuit schema.
*   **Visual Schematics**: Dynamic SVG previews of your wiring.
*   **Automated BOM**: Instant parts list with Adafruit/Digikey links.

### 2. **Intelligent Component Discovery**
*   **Metadata-Rich Search (Mock Data)**: Supports query/filter flow (price, stock) with structured component outputs.
*   **Datasheet Lookup (Mock Data)**: Returns datasheet links and key electrical specs in normalized format.

### 3. **Synthesis & Validation**
*   **Natural Language Synthesis**: Translates requests into a normalized `CircuitSchema` (parts, nets, pin map, constraints).
*   **Safety Auditing (Rule-based Prototype)**: Checks common issues such as missing LED resistors, floating nets, voltage mismatch, and pin short risks.

### 4. **Vision-Assisted Analysis**
*   **Photo-Assisted Drafting (Prototype)**: Accepts image references and returns inferred components/dimensions plus a draft circuit schema.

---

## 📈 Roadmap: Scaling to the Physical Edge

- [x] **Phase 1: Foundation (Hackathon)** – Core toolset, modular engine, shared data model (`CircuitSchema`), and React widgets.
- [ ] **Phase 2: Live Supply APIs** – Direct API integration with DigiKey, Mouser, and Farnell for real-time stock and checkout.
- [ ] **Phase 3: True 3D Artifact Pipeline** – Upgrade from OpenSCAD/STL references to generated downloadable artifacts.
- [ ] **Phase 4: Compile/Upload Validation** – Add board/FQBN-aware compile checks and upload instruction validation.
- [ ] **Phase 5: Project Packaging** – Produce downloadable ZIP bundles including sketch + schema + BOM + enclosure assets.

---

## 🏗 Built on Modern Infrastructure
ArduinoMCP is built to move fast. No legacy bloat.
- **Engine**: [mcp-use](https://github.com/mcp-use/mcp-use) (HMR-enabled MCP server framework)
- **Frontend**: React 19 + Tailwind CSS 4 (Vibrant, Responsive, Clean for Chatbot UI)
- **Validation**: Zod (schema-based tool input/output)
- **Deployment**: Manufact Cloud / Vercel

---

## 🚀 Getting Started (LP/Investor Demo)

1. **Install Dependencies**:
   ```bash
   cd ArduinoMCP
   npm install
   ```

2. **Start the Engine**:
   ```bash
   npm run dev
   ```

3. **Explore the Workspace**:
   Navigate to [http://localhost:3000/inspector](http://localhost:3000/inspector) to interact with the future of hardware.

---

### **Join the ArduinoMCP Team**
We are currently in the prototyping phase, building the tools that will power the next generation of hardware innovators. 

**ArduinoMCP: Build at the speed of thought.** ⚡️

# Product Requirements Document (PRD): Antigravity Arduino MCP

**Current status:** Functional MCP prototype with schema-driven workflow and mock integrations.

## 1. Vision & Purpose
Antigravity is an AI-powered co-pilot for Arduino development. It bridges the gap between high-level project ideas and the final physical prototype by automating circuit design, firmware generation, and hardware selection within the MCP (Model Context Protocol) ecosystem.

---

## 2. Target Audience
- **Hardware Hackers & Makers**: Quickly prototype ideas without memorizing pinouts or boilerplate code.
- **STEM Educators**: Assist students in debugging circuits and understanding components through interactive visuals.
- **Product Designers**: Rapidly validate electronic feasibility and generate 3D case enclosure drafts.

---

## 3. Core Product Features (Prototype Implemented)

### 3.1. Interactive Circuit Workspace (`write_arduino_code`)
- **Firmware Generation**: Generates starter `.ino` code scaffolds based on requirements and normalized circuit schema.
- **Visual Builder Widget**: A custom React-based UI (`arduino-circuit-builder`) that displays:
    - Side-by-side code editor with syntax highlighting.
    - Dynamic SVG circuit preview.
    - Component BOM (Bill of Materials) with purchase links.
    - Wiring and safety notes.

### 3.2. Intelligent Component Discovery (`search_components` & `get_datasheet`)
- **Metadata-Rich Search (Mock Data)**: Supports query/filter flow (price, stock) with structured component outputs.
- **Datasheet Lookup (Mock Data)**: Returns datasheet links and key electrical specs in normalized format.

### 3.3. Synthesis & Validation (`generate_circuit` & `validate_circuit`)
- **Natural Language Synthesis**: Translates requests into a normalized `CircuitSchema` (parts, nets, pin map, constraints).
- **Safety Auditing (Rule-based Prototype)**: Checks common issues such as missing LED resistors, floating nets, voltage mismatch, and pin short risks.

### 3.4. Vision-Assisted Analysis (`analyze_photo`)
- **Photo-Assisted Drafting (Prototype)**: Accepts image references and returns inferred components/dimensions plus a draft circuit schema.

---

## 4. Technical Stack
- **Framework**: [mcp-use](https://github.com/mcp-use/mcp-use) (HMR-enabled MCP server framework)
- **Language**: TypeScript / Node.js
- **UI Architecture**: React 19 + Tailwind CSS 4
- **Safety & Validation**: Zod (schema-based tool input/output)
- **Shared Data Model**: `CircuitSchema` used across generate/validate/code/3D/export/order/improvement tools

---

## 5. Roadmap & Future Scope
- **Live Supply APIs**: Connect `search_components` and `order_parts` to live DigiKey/Mouser APIs.
- **True 3D Artifact Pipeline**: Upgrade `generate_3d_case` from OpenSCAD/STL references to generated downloadable artifacts.
- **Project Packaging**: Produce downloadable ZIP bundles from `export_project` including sketch + schema + BOM + enclosure assets.
- **Vision Upgrade**: Replace heuristic photo inference with production-grade vision parsing.
- **Compile/Upload Validation**: Add board/FQBN-aware compile checks and upload instruction validation.

---

## 6. Design Principles
- **Aesthetics First**: Every tool response should feel clean, minimal, and professional.
- **Proactive Safety**: Never output circuit/code guidance without grounding and current-limiting checks.
- **Schema Consistency**: Prefer one normalized circuit model (`CircuitSchema`) across all tools.

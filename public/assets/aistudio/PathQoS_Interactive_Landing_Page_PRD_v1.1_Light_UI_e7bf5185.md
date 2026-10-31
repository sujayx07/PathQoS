# Pathqos

# Interactive Landing Page
Product Requirements Document

Version 1.1 · Light visual direction · For review before implementation

Product premise: PathQoS is an intent-aware, privacy-first adaptive QoS concept that observes traffic metadata, proposes bounded policies, and verifies impact. The website must demonstrate this through an honest browser simulation, not pretend to control the visitor’s network.


# 1. Executive summary

Build a polished, responsive, interactive product landing page for PathQoS, a proposed home-broadband Quality of Service engine. It should communicate technical credibility to hackathon judges, network engineers and potential collaborators. The interactive QoS lab is the centerpiece: visitors can test traffic scenarios, compare unmanaged/deterministic/PathQoS modes, see metrics change, inspect policy explanations and explore rollback behavior.

Unless a real router/agent API is integrated, every browser metric and policy action is simulated. Label it clearly. Do not imply the page inspects the visitor’s network, configures their router or measures real QoE.

# 2. Goals and non-goals

## Goals

Explain the product within 10 seconds: observe → decide → enforce → verify.

Make core strengths tangible: privacy-safe metadata classification, live capacity estimation, temporary intent leases, fairness safeguards, WAN/Wi-Fi diagnosis and safe rollback.

Let visitors explore the three case scenarios: ISO download + call; WAN drop from 100 to 20 Mbps; three TVs + gaming.

Show baseline comparisons and a reproducible test methodology without inventing results.

Deliver accessible, responsive UI with restrained animation and working controls.

## Non-goals for v1

No real packet capture, router configuration, traffic shaping or remote control from the browser.

No user accounts, billing, telemetry collection or cloud control plane.

No fabricated latency/MOS/accuracy/adaptation results presented as measured.

No full router operations console; only a guided marketing demo.

# 3. Audience, positioning and copy

| Audience | Need | Page evidence |
| --- | --- | --- |
| Hackathon evaluator | Understand problem, architecture and evaluation fit. | Scenario comparison, module map, metrics and reproducibility. |
| Network engineer | See a technically plausible design and honest limits. | Linux tc, CAKE/FQ-CoDel, IFB, DSCP/EDCA, rollback and module failure paths. |
| Potential collaborator | Understand benefit and safe testing. | Intent playground, explanations, fairness and scope disclosures. |


## Positioning

Headline: “Your network should protect the experience, not just prioritize packets.”

Supporting copy: “PathQoS observes traffic metadata, adapts to changing link capacity, and keeps a policy only when measured results justify it.”

Tagline: “Others apply QoS. PathQoS proves what changed—and why.”

# 4. Information architecture

| Section | Purpose | Required content |
| --- | --- | --- |
| Sticky navigation | Fast orientation. | Logo, How it works, Interactive lab, Architecture, Evidence, CTA; mobile menu. |
| Hero | Instant product value. | Headline, short description, primary CTA to lab, secondary CTA to architecture, animated network visual. |
| Problem visualizer | Explain the pain. | WAN queue congestion vs Wi-Fi/AP contention; no unsupported absolute competitor claims. |
| Interactive QoS lab | Make the concept tangible. | Scenario/mode selectors, workload toggles, capacity slider, run/reset, metrics and explanation. |
| Workflow | Explain control loop. | Observe → Decide → Enforce → Verify, each step expandable. |
| Architecture explorer | Show engineering depth. | Six modules, inputs/outputs, state transitions, failure behavior, data/control paths. |
| Core strengths | Summarize differentiators. | Metadata-only design, confidence-aware fallback, intent leases, fairness, rollback, path diagnosis. |
| Validation | Show how claims will be proven. | Three required scenarios, baseline methodology, metrics and reproducibility. |
| Scope and limitations | Build trust. | AP telemetry dependencies, simulation vs hardware testing, current vs future features. |
| Footer / CTA | Next step. | Technical brief/repository/contact placeholders only if real links exist. |


# 5. Interactive feature requirements

## 5.1 Interactive QoS lab — centerpiece

Use a deterministic, seeded client-side simulation. Identical inputs must produce repeatable outputs. The lab must visibly say “Illustrative simulation” until actual test-harness measurements are connected.

| Feature | Expected behavior | Acceptance test |
| --- | --- | --- |
| Scenario selector | Choose ISO download + call; 100→20 Mbps WAN drop; 3 TVs + gaming. | Switching scenario updates workloads, metrics and explanation. |
| Workload toggles | Enable/disable call, gaming, streaming and bulk download. | Output changes when workload mix changes. |
| Capacity control | Slider plus quick 100→20 Mbps action. | Visible capacity event and recalculated policy state. |
| Mode comparison | Unmanaged, deterministic baseline, PathQoS concept. | Same scenario seed/traffic inputs across modes. |
| Run / reset | Animate observe-decide-enforce-verify sequence. | Progress, completion and reset states work. |
| Metrics | p95 latency, jitter, loss, throughput, queue delay, fairness and CPU estimate. | Units and definitions are visible; values marked simulated/estimated. |
| Policy explanation | Plain-language reason tied to the current scenario. | No static explanation that contradicts selected inputs. |
| Fairness view | Per-class/device share and Jain index when meaningful. | Explain that simulation does not guarantee all real-world outcomes. |
| Disclosure | “How this simulation works” expandable note. | Assumptions and limitations are accessible. |


## 5.2 Intent lease playground

Goal presets: protect a work call, reduce gaming latency, keep streaming stable, or custom.

Duration options such as 15, 30 and 45 minutes; optional device/class scope.

Lease card shows scope, expiry, rationale and simulated state: Meeting goal / Constrained / Expired.

Allow create, cancel and simulated expiry. Conflicting requests must show a visible explanation.

Do not claim Nash bargaining or any named optimization algorithm unless actually implemented and tested.

## 5.3 Policy verification timeline

Show Snapshot → Apply → Read back → Verify → Commit or Roll back. Each event opens details: policy diff, metric checked and reason. Commit/rollback must follow a documented, unit-tested simulation rule. Label the whole flow as simulated until connected to a real enforcement agent.

## 5.4 Architecture explorer

M1 Metadata capture; M2 classifier/confidence; M3 capacity estimator; M4 policy engine; M5 enforcement; M6 verifier/watchdog.

Selecting a module reveals inputs, outputs, state, failure behavior and associated tests.

Separate control plane from data plane. The browser UI is a presentation layer, not the packet-processing engine.

Show WAN enforcement and optional AP/Wi-Fi telemetry paths. Mark AP-specific controls hardware/driver-dependent.

# 6. Visual direction and motion

## Visual system

Use a light-first visual system: warm near-white canvas, crisp white cards, dark ink typography, confident cobalt actions, teal success/healthy states, and restrained amber/coral warnings. The page should feel like a polished developer tool and network observability product, not a generic AI template. Use fine borders, soft shadows, generous whitespace, clear section rhythm and selective color to guide attention. Keep the interactive QoS lab visually rich without making the rest of the page feel like a dashboard. Avoid dark-first styling, excessive glassmorphism, oversized gradients, dense walls of text and decoration that competes with the demo.

Use a modern sans-serif such as Geist or Inter, with a clear type scale and comfortable line length. Keep body copy readable on mobile, use short section introductions, and separate technical detail into expandable panels where appropriate. The hero should have one clear headline, one supporting paragraph, one primary CTA and one secondary CTA.

### Typography and layout

Use a consistent 150–220ms transition range for small interactions, with reduced-motion alternatives. Reserve larger movement for the hero network and QoS lab state changes. Charts should prioritize legibility over animation; always keep axes and legends stable.

Cards use a 1px border, modest 12–16px radius and subtle shadow only where elevation helps explain hierarchy. Hover may raise a card by 1–2px and strengthen its border; focus must be more visible than hover. Avoid putting every section in a rounded card.

### Interaction styling

Apply colors semantically, not decoratively. Cobalt identifies primary actions and the selected PathQoS concept mode; teal means healthy/verified; amber means constrained/pending; coral means error/rollback; slate means neutral or unmanaged. Never communicate a state through color alone—pair it with a label or icon. Verify WCAG contrast ratios before shipping.

Primary action / PathQoS concept: cobalt #315CE8. Secondary data-flow / healthy state: teal #0F9D8A. Capacity warning / pending state: amber #B86B00 with a pale amber background #FFF4D6. Error / rollback state: coral #D94F45 with a pale coral background #FFF0EE. Neutral / unmanaged mode: slate #64748B. Focus ring: #244ED8.

Canvas: #F7F9FC (warm, cool-tinted near-white). Primary surfaces: #FFFFFF. Soft section surface: #EEF3F9. Main text: #17233B. Secondary text: #52627A. Borders/dividers: #D9E2EE.

### Color palette

## Micro-interactions

Hero topology: on a pale canvas, show a small network map with animated packet paths. Congestion makes a queue visibly grow; a simulated policy change reorganizes the flow. Keep motion slow, purposeful and easy to understand.

Use short section reveals, subtle card lift, color transitions and a restrained animated line/packet motif. No scroll-jacking.

Buttons have hover, focus, pressed, loading and disabled states. Primary buttons use cobalt; secondary buttons use white surfaces with clear borders; destructive/rollback actions use coral only when the action warrants it.

Metric cards animate only after a completed run, not continuously. Use large readable values, small labels, units and a compact trend indicator; distinguish simulated values from real measurements at the point of display.

Architecture nodes highlight connected edges on hover/focus and open a detail panel. Use a clear selected state with a cobalt outline and teal data-flow accents.

Intent lease shows expiry progress and cancel action. Use teal for active/healthy, amber for constrained/near expiry and muted grey for expired; never rely on color alone.

Verification events appear in sequence with status icons, short explanations and text equivalents. Use teal for verified/committed, amber for pending and coral for rollback/failure.

Charts transition smoothly but keep stable, understandable axes. Use a consistent palette: cobalt for the selected PathQoS concept mode, slate grey for unmanaged traffic, teal for deterministic baseline or healthy states, amber for capacity warnings and coral for loss/rollback events. Add legends, units, contrast-safe lines and a concise text summary.

## Motion/accessibility guardrails

Respect prefers-reduced-motion and provide a static equivalent. The light palette and all status states must remain legible without animation.

No autoplay audio, flashing or high-frequency movement.

Every control works with keyboard; visible focus and accessible names are mandatory.

Use semantic headings, adequate contrast, chart summaries and status announcements.

# 7. Recommended stack and libraries

| Layer | Recommendation | Rationale |
| --- | --- | --- |
| Framework | Next.js App Router + React + TypeScript strict mode | SEO, reusable components, metadata and maintainable architecture. |
| Styling/components | Tailwind CSS + shadcn/ui | Consistent styling with customizable accessible primitives. |
| Motion | Motion for React (formerly Framer Motion) | UI transitions, layout animation and reduced-motion support. |
| Icons | Lucide React | Consistent lightweight icon set. |
| Charts | Recharts; custom SVG for network topology | Readable responsive metrics; full control over hero illustration. |
| Architecture graph | Custom SVG first; React Flow only if node interaction truly needs it | Avoid unnecessary dependency and bundle weight. |
| Testing | Vitest + React Testing Library + Playwright | Pure simulation tests and critical browser flows. |
| Quality | ESLint + Prettier + TypeScript checks | Consistent, reviewable code. |
| Deployment | Vercel or equivalent Next.js host | Preview builds and straightforward deployment. |


Template/component references to evaluate: shadcn/ui blocks for layout, Magic UI for restrained motion patterns, Aceternity UI for selected visual motifs, and Motion examples for transitions. Use components selectively; verify current licenses, accessibility, dependencies and bundle impact. Do not combine several full template systems.

# 8. Suggested code architecture

app/(marketing)/page.tsx — page composition and metadata.

components/nav/ — responsive navigation and mobile menu.

components/hero/ — headline, CTA and animated topology.

components/qos-lab/ — scenarios, controls, mode comparison, charts and explanations.

components/intent-playground/ — lease form, status, expiry and conflict handling.

components/verification/ — policy event timeline and commit/rollback details.

components/architecture/ — module explorer and data/control paths.

components/sections/ — problem, workflow, strengths, validation, limitations and footer.

lib/simulation/ — pure deterministic simulation functions and seeded fixtures.

lib/metrics/ — metric calculations, units and formatting.

lib/types/ — Scenario, Workload, PolicyMode, MetricSnapshot, IntentLease, PolicyEvent.

tests/ — simulation unit tests and Playwright flows.

Keep simulation logic out of React components. Typed controls feed pure functions; the returned model feeds UI. This allows tests now and a future real backend adapter later.

# 9. Simulation and data honesty

Do not invent benchmark numbers. Use a declared illustrative model or repeatable measurements imported from a real test harness.

Use fixed seeded fixtures so each mode receives identical offered traffic.

Metric units and assumptions must be discoverable; heuristic outputs must say “estimated.”

Do not claim actual MOS from a browser simulation. Use a defined late-frame measure or explicitly labelled illustrative QoE proxy only when the model supports it.

Show “AP telemetry unavailable” if Wi-Fi airtime cannot be observed; do not imply WAN shaping solves radio contention.

ML is justified only if it improves measurable outcomes over a deterministic baseline; otherwise the deterministic path remains the default.

# 10. Functional requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| FR-01 | Navigation | Anchors, mobile menu, focus states and CTAs work. |
| FR-02 | Scenario switching | Three presets update all dependent controls/results. |
| FR-03 | Mode comparison | Unmanaged, deterministic and PathQoS modes use same inputs/seed. |
| FR-04 | Simulation lifecycle | Run, progress, completion, safe error and reset states work. |
| FR-05 | Explainability | Every policy action has a reason and intended metric. |
| FR-06 | Intent leases | Create, inspect, cancel and expire; conflicts are explained. |
| FR-07 | Verification | Commit/rollback follows a documented rule and shows event history. |
| FR-08 | Architecture explorer | Every module shows inputs, outputs and failure handling. |
| FR-09 | Scope disclosure | Demo data, hardware dependencies and unimplemented capabilities are explicit. |
| FR-10 | Accessibility | Keyboard support, labels, focus, reduced motion and chart summaries. |
| FR-11 | Persistence | Optional localStorage for UI preferences only; no network-sensitive data. |
| FR-12 | Resilience | Invalid/missing inputs show a safe fallback; no dead controls. |
| FR-13 | SEO | Title, description, Open Graph metadata, favicon and sitemap/robots as appropriate. |


# 11. Non-functional requirements

Performance targets to measure: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on representative mobile devices.

Target WCAG 2.2 AA; test keyboard navigation, contrast, status announcements and reduced motion. Check actual contrast ratios for text, borders, charts, focus rings and all interactive states; do not use pale accent colors for small text.

Primary demo must run without API keys and work after initial assets load even if external services are unavailable.

No collection of packet data, router credentials, device identifiers or other sensitive network information.

Responsive checks at 360 px mobile, tablet and 1440 px desktop.

Production build, lint, typecheck, unit tests and key Playwright flows must pass.

# 12. Acceptance checklist

Visitor can explain the product after the hero and problem section.

Primary CTA reaches the lab; all nav anchors work.

All three scenarios and all three modes produce consistent, testable output.

The 100→20 Mbps event visibly triggers a new decision path.

Policy explanation matches selected scenario and mode.

Intent lease create/cancel/expiry and conflict states work.

Verification timeline commits or rolls back according to a testable rule.

All metrics show units and simulated/estimated status.

Wi-Fi/AP controls are conditional when telemetry is unavailable.

Reduced-motion and keyboard-only flows remain usable.

No unsupported competitor claims or fabricated performance figures remain.

Build, lint, unit tests and core end-to-end tests pass.

# 13. Implementation phases

| Phase | Deliverable | Exit gate |
| --- | --- | --- |
| 0 Review | Approve message, visual direction, scope and metrics. | No blocking product decisions remain. |
| 1 Foundation | Project setup, tokens, navigation, responsive section shell. | Typecheck/lint/build pass. |
| 2 Story | Hero, problem, workflow, strengths, scope and footer. | Responsive/accessibility pass. |
| 3 QoS lab | Pure simulation model, seeded scenarios, mode comparison and metrics. | Simulation unit tests pass. |
| 4 Intent/verification | Lease playground, event timeline, commit/rollback behavior. | State-transition tests pass. |
| 5 Architecture/polish | Module explorer, motion, reduced-motion and responsive refinements. | Keyboard and reduced-motion audit passes. |
| 6 Release | SEO, deployment preview, Playwright smoke tests. | No critical console errors; reviewer approves preview. |


# 14. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Impressive UI but fake demo | Label simulation, document assumptions and avoid empirical claims. |
| Too much content | Keep narrative concise; use expandable technical details. |
| Motion harms speed/accessibility | Use Motion sparingly; test mobile and reduced motion. |
| Wi-Fi claims exceed hardware capabilities | Separate WAN controls from AP-specific telemetry/control. |
| ML used as decoration | Compare against deterministic baseline; keep ML only if it wins measurable outcomes. |
| Template components create inconsistency | Use selective components, review licenses and consolidate design tokens. |


# 15. Copy and claim guardrails

Say “designed to reduce queue delay” until real measurements support stronger language.

Label generated browser metrics “illustrative simulation.”

Say “metadata-only design” until implementation and tests prove payload exclusion.

Say “AP-aware where compatible telemetry/control exists,” not universal Wi-Fi airtime control.

Do not state that OpenWrt, UniFi, eero or TP-Link categorically lack a capability without a sourced feature comparison.

Never present projected metrics as observed results.

# 16. Implementation prompt for the coding agent

Paste the following prompt after approving this PRD. The agent must inspect the repository first, build in phases and report tests honestly.

Visual system requirement: light-first only for v1. Use canvas #F7F9FC, white surfaces #FFFFFF, soft surface #EEF3F9, primary text #17233B, secondary text #52627A, borders #D9E2EE, cobalt #315CE8 for primary actions/PathQoS concept, teal #0F9D8A for healthy/verified states, amber #B86B00 for warnings, coral #D94F45 for errors/rollback, and slate #64748B for neutral/unmanaged states. Check contrast for all text and chart elements. Do not rely on color alone for status.

You are a senior frontend engineer and product-minded UI architect. Build the PathQoS interactive landing page according to the approved PRD. Use Next.js App Router, React, strict TypeScript, Tailwind CSS, shadcn/ui, Motion for React, Lucide React, and Recharts only where appropriate. Keep the design premium, technical, calm, responsive and accessible. Do not add unnecessary 3D/WebGL or multiple animation libraries.


Product truth: PathQoS is a proposed adaptive home QoS engine. Unless a real backend is supplied, all browser metrics and policy actions are a deterministic client-side simulation. Label them “Illustrative simulation.” Never claim to inspect/control the visitor’s network. Do not invent measured outcomes or make unsupported competitor claims.


Build: responsive navigation; hero with animated network visual and working CTAs; problem/root-cause section; interactive QoS lab; mode comparison (Unmanaged, Deterministic baseline, PathQoS concept); workflow; architecture explorer; core strengths; validation methodology; limitations; footer.


The QoS lab must include the three required scenarios, workload toggles, a WAN capacity slider and 100→20 Mbps action, run/reset controls, simulation lifecycle, labelled metrics, fairness display and a plain-language explanation for every policy action. Compare modes on identical seeded inputs. Put pure typed simulation functions in lib/simulation, not inside React components. Test scenario consistency, mode differences, policy verification and reset.


Implement an intent lease playground with goal, scope, duration, create/cancel/expiry states and visible conflict handling. Implement Snapshot → Apply → Read back → Verify → Commit/Roll back with a documented, unit-tested rule. Every feature must work locally without an API key.


Architecture explorer modules: metadata capture, classifier/confidence, capacity estimator, policy engine, enforcement, verifier/watchdog. Each module reveals inputs, outputs and failure behavior. Distinguish WAN shaping from optional AP/Wi-Fi telemetry and mark hardware dependencies.


Use semantic HTML, strong hierarchy, responsive layout at 360px/tablet/desktop, keyboard controls, visible focus, accessible labels, chart text summaries and reduced-motion support. No scroll-jacking, dead links or decorative controls that do nothing.


Implementation process:

1. Inspect the repository and conventions before editing. If no app exists, scaffold the minimum required project.

2. Report a concise plan and file tree.

3. Build foundation and static sections first; run typecheck, lint and build.

4. Implement and test the simulation model before wiring controls.

5. Add intent leases, verification timeline and architecture explorer.

6. Add motion and polish only after core behavior works.

7. Run Playwright flows for navigation, each scenario, mode comparison, capacity drop, intent create/cancel/expiry, rollback, reset, mobile menu and reduced motion.

8. Report exactly what works, what is simulated, what remains unimplemented and which commands/tests actually passed. Never claim a test passed unless it was run.


Do not stop at a static mockup. Every visible control must have meaningful behavior. If something cannot be implemented honestly in this environment, show a clear conditional/disabled state and document why instead of faking it.

# 17. Decisions for review before coding

Approve product name and hero message.

Approve the light-first palette and decide whether a dark-mode toggle is needed. Default recommendation: light-first only for v1, with no theme toggle unless implementation time permits.

Approve simulation metrics and disclosure language.

Provide actual repository/demo/contact URLs or remove those CTAs.

Confirm whether analytics are allowed; default is no analytics.

Approve phased build and acceptance checklist.

End of PRD — implementation starts after review approval.

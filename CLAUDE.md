# Agent Creator — Project Documentation

## What this project is

This workspace contains reference materials, example blueprints, and framework documentation for the `/agent-creator` Claude Code slash command. The command itself lives at `C:\Users\naksh\.claude\commands\agent-creator.md`.

This folder is the knowledge base that makes the skill better over time: past blueprints are stored here, tool research is documented here, and the framework is revised here. Every blueprint produced by the skill is a WAT-compatible spec (see WAT Architecture below).

---

## The WAT Architecture (Output Standard)

Every blueprint this skill produces must be compatible with the WAT framework:

- **Layer 1 — Workflows**: Markdown SOPs in `workflows/` defining objective, inputs, tools to run, expected output, edge cases
- **Layer 2 — Agents**: Claude's orchestration role — read the workflow SOP, run tools in sequence, handle failures, ask questions
- **Layer 3 — Tools**: Python scripts in `tools/` for deterministic execution (API calls, data transforms, file ops). Credentials in `.env`.

A blueprint is only WAT-complete when it specifies: the `workflows/[name].md` SOP content, the `tools/` scripts to build or reuse, and the agent's decision logic between them.

---

## The 4-Phase Framework (Canonical Reference)

**Phase 1 — Problem Analysis**
Purpose: Understand before designing. Avoid building the wrong thing.
Outputs: 3 core problems, 3 clarifying questions, 3 stated requirements/constraints.
Rule: Hard gate — do not proceed to Phase 2 until user answers the questions.

**Phase 2 — Basic Solutions**
Purpose: Ground the conversation in fundamentals. Avoid jumping to complexity.
Outputs: 3 solutions in plain language, from simplest to most scalable.
Analogy principle: "If you're hungry → eat food" before "optimize protein/carb ratio for your training goal."

**Phase 3 — Problem-Specific Solutions + Tools**
Purpose: Apply fundamentals to the user's exact context. Name real tools.
Outputs: 3 contextualized solutions with named tools, costs, effort levels, and fit criteria.
Rule: Every tool named must be real, currently available, and correctly described.

**Phase 4 — Personalized Agent Blueprint**
Purpose: Produce a handoff-ready, WAT-compatible, plain-English specification.
Outputs: Named agent, step-by-step workflow, WAT file structure spec, tool table, honest limits, plain summary, single next action.
Rules: Deterministic steps (no ambiguity), realistic efficiency (no hallucinated features), non-technical language.

---

## Blueprint Naming Convention

Blueprints saved in this folder follow this pattern:
```
blueprints/[context]-[agent-name]-[YYYY-MM].md
```

Examples:
- `blueprints/salon-booking-reminder-agent-2026-04.md`
- `blueprints/ecommerce-lead-nurture-agent-2026-05.md`
- `blueprints/consulting-weekly-report-bot-2026-04.md`

---

## Tool Reference System

When a new tool is researched or used in a blueprint, add it to `tools/tool-reference.md` with:

| Field | What to fill in |
|-------|----------------|
| Tool name | Exact product name |
| Category | trigger / action / AI / storage / communication / scheduling |
| Free tier | What's included for free, or "No free tier" |
| Complexity | Low / Medium / High setup |
| Best for | One-line description of ideal use case |

---

## Framework Revision Log

Any changes to the 4-phase framework must be documented here with the date and rationale. This prevents silent drift where the command file diverges from the documented framework.

Format:
```
[YYYY-MM-DD] — [What changed] — [Why]
```

---

## Blueprint Quality Checklist

A blueprint is complete only when it passes all of these:

- [ ] Agent has a real name (not "the automation" or "the workflow")
- [ ] Every step names a specific tool and a specific action within that tool
- [ ] WAT file structure section is present (`workflows/`, `tools/`, `.tmp/`, `.env`)
- [ ] "What This Won't Do" section has at least 2 honest, specific limits
- [ ] Plain-English Summary is written for a non-technical reader
- [ ] "Your Next Step" is a single, concrete action (not a list)
- [ ] Setup time is given in hours or days (never "quick," "easy," or "simple")
- [ ] No tool is recommended that requires a developer unless explicitly flagged

---

## Relationship to Other Skills

- `/tiusday` — newsletter skill; uses the same structured execution pattern (header → invocation triggers → execution rules → phase-by-phase instructions)
- Future skills in this workspace should follow the same convention: header summary, what-it-does section, how-to-invoke section, execution rules, phase-by-phase instructions

---

## Self-Improvement Loop (for this skill)

When a blueprint fails in production or a tool recommendation turns out to be wrong:
1. Document what broke in `blueprints/[name]-postmortem.md`
2. Update the tool reference if the tool was incorrectly described
3. Revise the framework if the phase structure caused the failure
4. Log the change in the Framework Revision Log above

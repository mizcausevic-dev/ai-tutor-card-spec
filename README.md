# AI Tutor Cards

A draft specification for **AI Tutor Cards** — declarative documents that disclose what an AI tutor is for, how it teaches, and what safety and privacy protections it carries.

Tutors are a specialized class of AI agent with stakes a general-purpose agent doesn't carry: the audience can be a minor, the buyer is often a school district or parent, and the regulatory surface includes FERPA, COPPA, and state-level student-data laws. A Tutor Card is the document that makes those properties machine-readable for procurement reviewers, accreditation bodies, parents, and the LMS itself.

This spec is the EdTech-flavored sibling of [Agent Cards](https://github.com/mizcausevic-dev/agent-cards-spec) — it shares the same disclosure philosophy but adds the fields a school board needs and an agent-only context does not.

## The three pillars

| Pillar | What it does |
|---|---|
| **Audience** | Declare who the tutor is for: age range, grade range, supported languages, subject scope (topics included AND excluded) |
| **Pedagogy** | Declare how the tutor teaches: instructional approach, homework policy, assessment policy, scaffolding behavior |
| **Safety & Privacy** | Declare protections: content filters, mandated-reporter protocol, FERPA / COPPA / GDPR posture, data-sharing rules, retention |

## Why a separate spec from Agent Cards?

An Agent Card describes capabilities and refusals for any AI agent. A Tutor Card adds the **pedagogical, demographic, and student-data-regulatory** fields that Agent Cards deliberately don't define. The two are complementary: a Tutor Card SHOULD reference its underlying Agent Card (`agent_card_uri`) so a reviewer can chain from "what this tutor does in classroom terms" to "what this agent does in capability terms" in one click.

## Why not just a vendor brochure?

Three reasons.

1. **Machine-readable procurement.** District procurement teams reviewing AI tutors today read PDFs and run their own pilots. A Tutor Card lets a procurement reviewer diff two tutors side by side mechanically: which one has stricter content filters, which one has a stricter homework policy, which one is FERPA-attested.
2. **LMS visibility.** A school's LMS (Canvas, Schoology, Google Classroom) can read a Tutor Card on integration day and surface "what this tutor will and won't do" to teachers without anyone reading a 40-page vendor whitepaper.
3. **Parent visibility.** A parent (or a parent-facing portal) can read a Tutor Card without an account at the vendor. Discoverable, signed, auditable.

## Quickstart

1. Pick a `tutor.id` (kebab-case, unique within your org).
2. Author a Tutor Card conforming to [`tutor-card.schema.json`](tutor-card.schema.json). Start from one of the [examples](examples/).
3. Validate with any JSON Schema 2020-12 validator (e.g. `ajv`, `jsonschema`).
4. Serve at `https://<your-product>/.well-known/tutors/<tutor-id>.json` with `Content-Type: application/json`.
5. Optionally reference your tutor's [Agent Card](https://github.com/mizcausevic-dev/agent-cards-spec) via the `agent_card_uri` field so reviewers can chain through.

## Files in this repo

- [`SPEC.md`](SPEC.md) — full v0.1 specification
- [`tutor-card.schema.json`](tutor-card.schema.json) — JSON Schema (draft 2020-12)
- [`examples/`](examples/) — reference Tutor Cards for a K-12 math tutor, a high-school reading tutor, and a college-level computer-science assistant

## Status

**v0.1 draft.** Issues and pull requests welcome.

## License

AGPL-3.0. Specification text is freely implementable; schema and examples are AGPL-3.0.

## Kinetic Gain Protocol Suite

A family of open specifications for the answer-engine and agent era:

| Spec | What it does |
|---|---|
| [AEO Protocol](https://github.com/mizcausevic-dev/aeo-protocol-spec) | Entity declaration at `/.well-known/aeo.json` |
| [Prompt Provenance](https://github.com/mizcausevic-dev/prompt-provenance-spec) | Versioned, lineaged, reviewable LLM prompt records |
| [Agent Cards](https://github.com/mizcausevic-dev/agent-cards-spec) | Declarative agent capability + refusal disclosure |
| [AI Evidence Format](https://github.com/mizcausevic-dev/ai-evidence-format-spec) | Structured citations for LLM-generated claims |
| [MCP Tool Cards](https://github.com/mizcausevic-dev/mcp-tool-card-spec) | Per-tool disclosure for Model Context Protocol servers |
| **AI Tutor Cards** (this) | EdTech-specialized agent disclosure (vendor-side) |
| [Student AI Disclosure](https://github.com/mizcausevic-dev/student-ai-disclosure-spec) | Student-side disclosure attached to submitted work |

---

**Connect:** [LinkedIn](https://www.linkedin.com/in/mirzacausevic/) · [Kinetic Gain](https://kineticgain.com) · [Medium](https://medium.com/@mizcausevic/) · [Skills](https://mizcausevic.com/skills/)

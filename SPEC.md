# AI Tutor Cards v0.1 — Specification

**Status:** Draft
**Version:** 0.1.0
**Editor:** Miz Causevic
**License:** AGPL-3.0 (this document, schema, and examples). Implementations are unrestricted.

RFC 2119 keywords (**MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, **MAY**) apply throughout.

---

## 1. Scope

This specification defines a JSON document format for **AI Tutor Cards** — disclosure documents for AI agents in an educational role, consumed by:

- District / university procurement reviewers comparing tutors
- LMS administrators surfacing tutor behavior to teachers
- Parents and guardians reading what an AI tutor will and won't do
- Accreditation bodies and compliance offices auditing EdTech vendor inventories
- The agents themselves (via the [Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev?q=spec))

A Tutor Card is **not** an Agent Card. It is the EdTech-specialized sibling: it discloses pedagogical approach, age and subject scope, content filtering, mandated-reporter protocol, and student-data privacy posture (FERPA / COPPA / GDPR / state-specific laws).

A Tutor Card **SHOULD** reference its underlying Agent Card via `agent_card_uri` so a reviewer can chain through to the general capability surface.

## 2. Terminology

- **Tutor** — an AI agent operating in an educational role with a learner audience.
- **Audience** — the population the tutor is designed for: age, grade, language.
- **Subject scope** — the topical domain the tutor covers, plus topics it deliberately excludes.
- **Pedagogy** — the tutor's teaching behavior: approach, homework policy, assessment policy.
- **Mandated reporter protocol** — escalation flow when a learner discloses abuse, self-harm, or another reportable concern.
- **FERPA** — Family Educational Rights and Privacy Act (US, K-12 + Higher Ed)
- **COPPA** — Children's Online Privacy Protection Act (US, under 13)

## 3. The three pillars

### 3.1 Audience

Every Tutor Card **MUST** declare:

- An **age range** (`audience.age_range_min` / `age_range_max`) — used for COPPA gating
- A **grade range** (`audience.grade_range_min` / `grade_range_max`) — strings, e.g. `"K"`, `"5"`, `"12"`, `"undergrad"`, `"grad"`, `"adult"`
- A **language list** (`audience.language_codes`) — BCP-47 codes

A Tutor Card **SHOULD** declare:

- **Subject scope** (`subject_scope.primary_subjects`, `subject_scope.topics_included`, `subject_scope.topics_excluded`)

The `topics_excluded` array exists deliberately: it forces vendors to enumerate what the tutor will *not* cover. A math tutor that excludes "calculus" is more honest than one that claims it covers "all math."

### 3.2 Pedagogy

Every Tutor Card **MUST** declare:

- **Instructional approach** (`pedagogy.approach`): one of `socratic`, `direct_instruction`, `scaffolded`, `personalized`, `mixed`
- **Homework policy** (`pedagogy.homework_policy`): one of:
  | Value | Meaning |
  |---|---|
  | `complete` | The tutor will produce a finished homework answer on request |
  | `guide_only` | The tutor will walk the learner through but will not produce a finished answer |
  | `refuse` | The tutor will refuse to engage with homework-completion prompts |
- **Assessment policy** (`pedagogy.assessment_policy`): same value set as homework policy, but applied to formal assessment items (test questions, exam prompts)

A Tutor Card **SHOULD** declare:

- **Behavioral features** (`pedagogy.supports_visual_explanations`, `pedagogy.supports_step_by_step_breakdown`, `pedagogy.supports_alternative_explanations`) — booleans
- **Curriculum alignment** (`curriculum_alignment[]`) — array of `{ framework, version, coverage_uri }` triples documenting which curricular standards the tutor's content maps to

### 3.3 Safety & Privacy

Every Tutor Card **MUST** declare:

- **Content filter strength** (`safety.content_filter_strength`): `strict` / `moderate` / `light`
- **Mandated reporter protocol** (`safety.mandated_reporter_protocol`): boolean
- **Human-in-loop categories** (`safety.human_in_loop_required[]`): topics that escalate to a human counselor (mental health, abuse, self-harm, etc.)
- **Privacy posture** (`data_privacy`):
  - `ferpa_compliant`, `coppa_compliant`, `gdpr_compliant` (booleans)
  - `retention_days` (integer)
  - `data_sharing_with_parents` (`full_transcript` / `summaries_only` / `none`)
  - `data_sharing_with_school` (`full_transcript` / `summaries_only` / `none`)
  - `third_party_data_sharing` (boolean)

If the tutor is targeted at any audience under age 13 (`audience.age_range_min < 13`), `data_privacy.coppa_compliant` **MUST** be `true`.

If the tutor is sold to US K-12 schools, `data_privacy.ferpa_compliant` **MUST** be `true`.

## 4. Document structure

### 4.1 `tutor_card_version` (required)

A semver string. **MUST** be `"0.1"` for documents conforming to this draft.

### 4.2 `tutor` (required)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Kebab-case identifier, unique within the vendor. |
| `name` | string | yes | Display name. |
| `version` | string | yes | Semver. |
| `provider` | string | yes | Vendor name. |
| `homepage` | URI | no | Marketing or docs page. |
| `description` | string | yes | One-paragraph description. |

### 4.3 `audience` (required)

| Field | Type | Required | Description |
|---|---|---|---|
| `age_range_min` | integer | yes | Minimum age (years) the tutor is approved for. |
| `age_range_max` | integer | yes | Maximum age. |
| `grade_range_min` | string | yes | e.g. `"K"`, `"3"`, `"undergrad"`. |
| `grade_range_max` | string | yes | e.g. `"5"`, `"12"`, `"adult"`. |
| `language_codes` | array of string | yes | BCP-47 codes, e.g. `["en", "es"]`. |

### 4.4 `subject_scope` (required)

| Field | Type | Required | Description |
|---|---|---|---|
| `primary_subjects` | array of string | yes | E.g. `["Math"]`, `["English Language Arts"]`. |
| `topics_included` | array of string | no | Sub-topics covered. |
| `topics_excluded` | array of string | no | Sub-topics deliberately excluded. |

### 4.5 `pedagogy` (required)

| Field | Type | Required | Description |
|---|---|---|---|
| `approach` | enum | yes | `socratic` / `direct_instruction` / `scaffolded` / `personalized` / `mixed` |
| `homework_policy` | enum | yes | `complete` / `guide_only` / `refuse` |
| `assessment_policy` | enum | yes | `complete` / `guide_only` / `refuse` |
| `supports_visual_explanations` | boolean | no | |
| `supports_step_by_step_breakdown` | boolean | no | |
| `supports_alternative_explanations` | boolean | no | |

### 4.6 `curriculum_alignment` (optional)

An array of frameworks the tutor's content maps to. Each entry:

| Field | Type | Required | Description |
|---|---|---|---|
| `framework` | string | yes | E.g. `"Common Core State Standards (Math)"`. |
| `version` | string | no | Year or version identifier. |
| `coverage_uri` | URI | no | Document showing claim-level mapping. |

### 4.7 `safety` (required)

| Field | Type | Required | Description |
|---|---|---|---|
| `content_filter_strength` | enum | yes | `strict` / `moderate` / `light` |
| `mandated_reporter_protocol` | boolean | yes | Whether the tutor escalates reportable disclosures. |
| `human_in_loop_required` | array of string | yes | Categories that escalate to a human. May be empty. |
| `blocks_explicit_content` | boolean | no | |
| `blocks_drug_alcohol_content` | boolean | no | |
| `blocks_violence_content` | boolean | no | |
| `blocks_political_advocacy` | boolean | no | |

### 4.8 `data_privacy` (required)

| Field | Type | Required | Description |
|---|---|---|---|
| `ferpa_compliant` | boolean | yes | |
| `coppa_compliant` | boolean | yes | |
| `gdpr_compliant` | boolean | yes | |
| `retention_days` | integer | yes | How long student data is retained. |
| `data_sharing_with_parents` | enum | yes | `full_transcript` / `summaries_only` / `none` |
| `data_sharing_with_school` | enum | yes | `full_transcript` / `summaries_only` / `none` |
| `third_party_data_sharing` | boolean | yes | Whether student data leaves the vendor for ad / analytics / model-training purposes. |
| `model_training_consent_required` | boolean | no | |

### 4.9 `agent_card_uri` (optional but recommended)

URI of the tutor's underlying Agent Card document conforming to [agent-cards-spec](https://github.com/mizcausevic-dev/agent-cards-spec). Reviewers can chain through to inspect general capabilities and refusals.

### 4.10 `evaluations` (optional)

An array of eval results from independent assessments (academic accuracy, safety, age-appropriateness). Each:

| Field | Type | Required | Description |
|---|---|---|---|
| `suite` | string | yes | E.g. `"k12-math-accuracy-v3"`, `"minor-safety-v2"`. |
| `result_uri` | URI | yes | Detailed results. |
| `metrics` | object | no | Free-form metrics object. |
| `ran_at` | datetime | yes | ISO 8601 UTC. |

### 4.11 `audit` (optional but recommended)

| Field | Type | Required | Description |
|---|---|---|---|
| `audit_log_uri` | URI | no | Where conversation logs are accessible to admins. |
| `incident_response_uri` | URI | no | Where parents / students can report misbehavior. |
| `disclosure_uri` | URI | no | Public changelog of tutor behavior changes. |

## 5. Discovery convention

A Tutor Card **MUST** be served at:

```
https://<vendor-origin>/.well-known/tutors/<tutor-id>.json
```

The response **MUST** be valid JSON. The response **SHOULD** be served over HTTPS. The response **SHOULD** include a `Cache-Control` header consistent with the tutor's expected update cadence.

## 6. Conformance levels

| Level | Requirements |
|---|---|
| **Level 1 — Disclose** | Schema-valid document with all required fields. |
| **Level 2 — Verify** | Level 1, plus the Tutor Card is signed (detached JWS) or cross-attested by a recognized accreditation body. |
| **Level 3 — Audit** | Level 2, plus a working `audit.incident_response_uri` returning HTTP 2xx for valid incident reports, AND at least one independent eval entry with `ran_at` within the last 12 months. |

## 7. Security and privacy considerations

- **Truthful disclosure.** A Tutor Card is a publisher's representation. Consumers **MUST NOT** treat the card as ground truth for runtime safety; it is a disclosure document, not an enforcement mechanism. Procurement reviewers **SHOULD** independently spot-check claims, especially `mandated_reporter_protocol` and `data_sharing_with_parents`.
- **Audience age accuracy.** A vendor that markets a tutor to under-13 audiences and declares `coppa_compliant: false` is making a self-incriminating statement. Reviewers **SHOULD** treat the conjunction (age < 13) AND (NOT `coppa_compliant`) as a procurement-blocking signal.
- **Field drift over time.** Tutors change. Vendors **MUST** bump `tutor.version` when any field changes that affects educator or parent expectations (homework policy, assessment policy, content filter strength, data sharing).
- **Re-validation cadence.** Schools **SHOULD** re-fetch Tutor Cards on a quarterly cadence at minimum to catch silent drift.

## 8. Relationship to existing work

| Standard / framework | Relationship to Tutor Cards |
|---|---|
| **Agent Cards** ([agent-cards-spec](https://github.com/mizcausevic-dev/agent-cards-spec)) | Sibling. A Tutor Card describes the educational specialization; the underlying Agent Card describes general capabilities. Linked via `agent_card_uri`. |
| **HuggingFace Model Cards** | Foundational; Model Card describes a model. Tutor Card describes an educational *agent built on top of* one or more models. |
| **Common Sense Privacy** | Compatible. Common Sense Privacy ratings can be referenced via `evaluations[]`. |
| **NIST AI RMF** | Compatible. The risk-management context Tutor Cards disclose maps to the GOVERN / MAP functions. |
| **MCP Tool Cards** ([mcp-tool-card-spec](https://github.com/mizcausevic-dev/mcp-tool-card-spec)) | A tutor that exposes tools via MCP **SHOULD** publish Tool Cards for each tool alongside its Tutor Card. |

## 9. Open questions

- **State-specific privacy laws.** California (SOPIPA), Colorado, Illinois, and others have student-data laws that exceed FERPA. Should the spec carry an explicit `state_specific_compliance[]` array, or fold into a generic `additional_certifications` field?
- **Special education accommodations.** Should the spec declare IEP / 504 accommodation handling explicitly?
- **Multimodal tutors.** Audio, video, and vision-capable tutors have additional disclosure surface (voice cloning policy, image-of-student handling). Defer to v0.2.
- **Tutor-of-tutors / orchestrators.** When one tutor routes to specialist sub-tutors, does the parent emit one card or many?
- **Quality signal aggregation.** Should the spec define a single "trust score" computed from the conformance level + eval set, or stay disclosure-only?

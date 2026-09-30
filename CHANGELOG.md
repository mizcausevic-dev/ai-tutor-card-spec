# Changelog

This file summarizes changes visible in this repository. A schema version, source commit, or package.json version does not by itself establish a deployed tutor, npm publication, or tagged release.

## Unreleased review changes

- Align the specification's license statement with the MIT LICENSE and clarify HTTPS discovery and the `0.1` version identifier.
- Mark examples as fictional and move their vendor and evaluation URLs to reserved `example.org` domains. Consumers that copied example IDs or URLs will need to update those fixtures.
- Keep the Tutor Card wire format at `0.1`; no required JSON fields were added or removed. The schema now accepts one-character tutor IDs and uses explicit object types in its conditional rule.
- Add a private, first-party AJV check against this repository's schema, including a known-invalid control; retain the cross-suite action pinned to its reviewed v0.1.0 commit.

## Observed source milestones

- 2026-05-12: initial AI Tutor Cards v0.1 draft and cross-links to related specifications.
- 2026-05-13: MIT relicense and example-validation workflow.
- 2026-06-11: CI action runtime update.

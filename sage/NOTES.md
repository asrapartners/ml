# Notes

- Workspace created 2026-08-23, separate from `/mnt/d/ml` (dad's STOR 323 workspace) — same course, same Lecture 3 deck, deliberately different learner and framing. Do not merge the two.
- Sage: college student, high-school math baseline, taking STOR 323. Visual, likes logic, drawn to zen and Hindu philosophy, existing interest in probability. Goal is conceptual depth ("challenge her to think on the big concepts"), not just procedural fluency.
- Philosophical integration is meant to be load-bearing, not decorative — per MISSION.md, cut any parallel that doesn't hold up rigorously on both sides rather than force it. Flagged this explicitly to Sage in lesson 0001's closing note so she pushes back if one feels weak.
- Lesson 0001 throughlines used: samskara (Yoga Sutras) ↔ fitted model f̂_D; finger-pointing-at-the-moon (Śūraṅgama Sūtra) ↔ f vs. f̂; Nishkama Karma (Gita 2.47) seeded but not fully developed — earmarked for the lesson that covers thresholds/policy (δ), matching dad's-workspace lesson 3 content.
- Reused generic widgets (linefit.js, quiz.js) from the dad workspace as-is since they're content-neutral tools; built a distinct stylesheet (vermillion/saffron, rice-paper palette) rather than sharing dad's CSS, since this is explicitly "not a generic lesson."
- No glossary/notation-decoder built yet for this workspace — start small, add lazily as later lessons need them (same pattern as the other workspace, just not needed yet after one lesson).
- 2026-08-23: completed all four lessons in one pass (user asked directly: "why don't you complete all the lessons"). Full throughline used across the deck:
  - L1: samskara ↔ fitted model; finger/moon (Śūraṅgama Sūtra) ↔ f vs. f̂.
  - L2: upāya (skillful means, Lotus Sūtra) ↔ output-space-first; jñāna/anubhava ↔ parametric/nonparametric; dependent origination (Saṃyutta Nikāya) ↔ softmax normalization; satsaṅga ↔ kNN.
  - L3: Nishkama Karma (Gītā 2.47) ↔ choosing a threshold; sākṣī bhāva (witness consciousness) ↔ ROC/AUC; adhikāra-bheda ↔ group fairness gap (flagged in-lesson as a structural, not mechanistic, parallel — worth checking with Sage whether it landed).
  - L4: capstone exercise (reused pathgame.js/CSS from the dad workspace) — every wrong-turn fallacy tag is a callback to a specific L1-L3 concept (e.g. "attachment to the fruit" = cherry-picking a threshold, "ignoring adhikāra-bheda" = the equal-rule fallacy), rather than generic logic-fallacy names.
  - Ported softmax.js/knn.js/threshold.js/pathgame.js and their CSS from the dad workspace (content-neutral tools) into Sage's assets; added a `--warn`/`--warn-soft` token pair to her palette (terracotta) since the original palette only had accent/saffron/good.
  - Each lesson's closing note explicitly invites Sage to say if a parallel felt forced — per MISSION.md's "cut it rather than force it" rule. Worth checking on her actual reaction once she's read through, especially adhikāra-bheda (self-flagged as the shakiest fit).

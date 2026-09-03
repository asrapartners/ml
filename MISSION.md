# Mission: ML Pipeline (STOR 323)

## Why
You're taking STOR 323 at UNC Chapel Hill (Fall 2026) and working through the lecture deck sequence (Lecture 3: "ML pipeline — from data to decisions"). The goal is durable, exam- and problem-set-ready understanding of how data becomes a fitted model, and how a fitted model becomes a real-world decision — not just passive slide recall.

**Background (confirmed):** No formal ML or stats background. You already have good intuition for what AI/ML *is* ("a probabilistic machine with weights tuned on data") but the mathematical notation itself — hats, subscripts, set-builder notation, etc. — is the actual barrier, not the underlying concepts. Treat every symbol as needing an explicit first-use definition.

**Teaching style (confirmed):** Visual, not code. Explain with real-world analogies (baking, weather forecasting, receipts) and diagrams/interactive widgets pitched at a smart high-schooler, not pseudocode or programming-language analogies. Every explanation should land in a concrete worked example — not just a restated description of the symbol.

## Success looks like
- Can explain the training/deployment split (D →A→ f̂_D, then x → f̂_D → s → δ → a) from memory, including which objects are fixed vs. data-dependent.
- Can compare model families (linear regression, softmax regression, kNN) by what they store as "fitted state" and what structural choices they require.
- Can pick the right evaluation metric (MSE / ROC·AUC / confusion matrix) for a given kind of model output, and explain what each metric misses.
- Can articulate why "equal rule ≠ equal burden" with a concrete threshold/group example.
- Comfortable working problem sets and exam questions from STOR 323 lectures as they're released.

## Constraints
- Learning happens lecture-by-lecture, keyed to the PDF slide decks as they're provided.
- Sessions are likely short and spaced across the semester (not a cram).

## Out of scope
- Implementation-heavy coding exercises, unless STOR 323 assignments require them — this course reads as theory/stats-first (see the LaTeX-heavy, proof-adjacent slide style).
- Producing an assignment's actual answers for graded work (e.g. Homework 1). Lessons teach technique on analogous data; the user applies it themselves to the graded numbers — see NOTES.md.

## Note (2026-09-03): neural-network internals are now in scope
The "out of scope" line above originally excluded deep learning entirely — since superseded. Lessons 0005–0010 cover perceptrons, MLPs, backpropagation, and transformers, and Homework 1's lessons (0011–0016) extend that with ReLU composition. Treat neural-network internals as in scope going forward.

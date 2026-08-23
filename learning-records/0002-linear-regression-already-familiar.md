---
name: linear-regression-already-familiar
description: User already understands linear regression; softmax regression and kNN were new
metadata:
  type: project
---

The user was already comfortable with linear regression going into lesson 0002 — no need to re-teach it. The genuinely new material was softmax regression (multi-class scoring + normalization) and kNN (nonparametric, vote-based prediction), and the organizing idea that ties them together is **parametric vs. nonparametric** (does the model compress the data away, or keep it?).

**Implication:** future model-family lessons can assume linear regression as a fixed reference point ("like linear regression, but...") rather than re-deriving it. The parametric/nonparametric split is now established vocabulary — reuse it rather than re-explaining, e.g. when later lectures introduce more model families.

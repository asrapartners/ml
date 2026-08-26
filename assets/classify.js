// "Sort the cases" exercise (Head First-style): click a verdict on each
// scenario card, get immediate feedback with the correct answer highlighted
// and an explanation — proves a rule by working examples, not by restating it.
// Usage: initClassify("container-id", {
//   yesLabel, noLabel,  // e.g. "Add to D", "Reject"
//   items: [{ scenario, correct: true|false, explain, category }]
//   // category (optional): when correct is false, what this item actually IS
//   // (e.g. "Fitted model") — replaces the generic noLabel on that card's
//   // button once answered, so "something else" doesn't stay vague forever.
// })
function initClassify(containerId, opts) {
  const el = document.getElementById(containerId);
  el.innerHTML = opts.items.map((item, i) => `
    <div class="classify-card" data-i="${i}">
      <p class="classify-scenario">${item.scenario}</p>
      <div class="classify-buttons">
        <button data-verdict="true">${opts.yesLabel}</button>
        <button data-verdict="false" class="classify-no-btn">${opts.noLabel}</button>
      </div>
      <div class="classify-feedback"></div>
    </div>
  `).join("");

  el.querySelectorAll(".classify-card").forEach((card, i) => {
    const item = opts.items[i];
    const buttons = card.querySelectorAll(".classify-buttons button");
    const feedback = card.querySelector(".classify-feedback");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (card.classList.contains("answered")) return;
        card.classList.add("answered");
        const picked = btn.dataset.verdict === "true";
        const isCorrect = picked === item.correct;

        if (!item.correct && item.category) {
          card.querySelector(".classify-no-btn").textContent = "✗ " + item.category;
        }

        buttons.forEach(b => {
          const bVerdict = b.dataset.verdict === "true";
          if (bVerdict === item.correct) b.classList.add("correct-choice");
          else b.classList.add("dim-choice");
        });

        feedback.className = "classify-feedback " + (isCorrect ? "right" : "wrong");
        feedback.innerHTML = (isCorrect ? "✓ Right. " : "✗ Not quite. ") + item.explain;
      });
    });
  });
}

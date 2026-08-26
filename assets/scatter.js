// "Can one straight line split this?" exercise: an actual SVG scatterplot per
// scenario (not a prose description) plus a classify-style yes/no verdict.
// Usage: initScatter("container-id", {
//   yesLabel, noLabel,
//   scenarios: [{ points: [{x,y,label:'a'|'b'}], correct: true|false, explain }]
// })
function initScatter(containerId, opts) {
  const el = document.getElementById(containerId);
  const W = 220, H = 160;

  el.innerHTML = opts.scenarios.map((s, i) => `
    <div class="scatter-card" data-i="${i}">
      <svg viewBox="0 0 ${W} ${H}" class="scatter-svg">
        <rect x="0" y="0" width="${W}" height="${H}" class="scatter-bg"/>
        ${s.points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" class="scatter-pt ${p.label}"/>`).join("")}
      </svg>
      <div class="scatter-buttons">
        <button data-verdict="true">${opts.yesLabel}</button>
        <button data-verdict="false">${opts.noLabel}</button>
      </div>
      <div class="scatter-feedback"></div>
    </div>
  `).join("");

  el.querySelectorAll(".scatter-card").forEach((card, i) => {
    const item = opts.scenarios[i];
    const buttons = card.querySelectorAll(".scatter-buttons button");
    const feedback = card.querySelector(".scatter-feedback");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (card.classList.contains("answered")) return;
        card.classList.add("answered");
        const picked = btn.dataset.verdict === "true";
        const isCorrect = picked === item.correct;

        buttons.forEach(b => {
          const bVerdict = b.dataset.verdict === "true";
          if (bVerdict === item.correct) b.classList.add("correct-choice");
          else b.classList.add("dim-choice");
        });

        feedback.className = "scatter-feedback " + (isCorrect ? "right" : "wrong");
        feedback.innerHTML = (isCorrect ? "✓ Right. " : "✗ Not quite. ") + item.explain;
      });
    });
  });
}

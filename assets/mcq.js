// Single multiple-choice question: click an option, get immediate feedback
// with the correct one highlighted and an explanation shown.
// Usage: initMCQ("container-id", {
//   question, options: [{ label, correct: true|false, explain }]
// })
function initMCQ(containerId, opts) {
  const el = document.getElementById(containerId);
  el.innerHTML = `
    <div class="mcq-question">${opts.question}</div>
    <div class="mcq-options">
      ${opts.options.map((o, i) => `<button data-i="${i}">${o.label}</button>`).join("")}
    </div>
    <div class="mcq-feedback"></div>
  `;

  const buttons = el.querySelectorAll(".mcq-options button");
  const feedback = el.querySelector(".mcq-feedback");
  let answered = false;

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const opt = opts.options[i];

      buttons.forEach((b, j) => {
        if (opts.options[j].correct) b.classList.add("correct-choice");
        else b.classList.add("dim-choice");
      });

      feedback.className = "mcq-feedback " + (opt.correct ? "right" : "wrong");
      feedback.innerHTML = (opt.correct ? "✓ Right. " : "✗ Not quite. ") + opts.options.find(o => o.correct).explain;
    });
  });
}

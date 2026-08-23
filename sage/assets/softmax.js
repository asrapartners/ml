// "Talent show" softmax demo: sliders set raw scores per category,
// live bar chart shows normalized probabilities (always summing to 100%).
// Usage: initSoftmax("container-id", { categories: [{label, init, min, max}, ...] })
function initSoftmax(containerId, opts) {
  const el = document.getElementById(containerId);
  const cats = opts.categories;

  el.innerHTML = `
    <div class="softmax-sliders">
      ${cats.map((c, i) => `
        <label>
          ${c.label}
          <input type="range" class="raw" data-i="${i}" min="${c.min}" max="${c.max}" step="0.1" value="${c.init}">
          <span class="raw-val" data-i="${i}"></span>
        </label>
      `).join("")}
    </div>
    <div class="barchart softmax-chart">
      ${cats.map((c, i) => `
        <div class="bar" data-i="${i}"><span class="bar-val" data-i="${i}"></span></div>
      `).join("")}
    </div>
    <div class="barchart-labels">
      ${cats.map(c => `<span>${c.label}</span>`).join("")}
    </div>
    <div class="linefit-error softmax-sum">Probabilities always sum to: <strong class="sum-val"></strong></div>
  `;

  const raws = el.querySelectorAll("input.raw");
  const rawVals = el.querySelectorAll(".raw-val");
  const bars = el.querySelectorAll(".bar");
  const barVals = el.querySelectorAll(".bar-val");
  const sumVal = el.querySelector(".sum-val");

  function update() {
    const z = Array.from(raws).map(r => parseFloat(r.value));
    raws.forEach((r, i) => (rawVals[i].textContent = z[i].toFixed(1)));

    const exps = z.map(v => Math.exp(v));
    const total = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map(e => e / total);
    const maxIdx = probs.indexOf(Math.max(...probs));

    bars.forEach((bar, i) => {
      bar.style.height = Math.max(4, probs[i] * 100) + "%";
      bar.classList.toggle("winner", i === maxIdx);
      barVals[i].textContent = (probs[i] * 100).toFixed(0) + "%";
    });

    sumVal.textContent = (probs.reduce((a, b) => a + b, 0) * 100).toFixed(0) + "%";
  }

  raws.forEach(r => r.addEventListener("input", update));
  update();
}

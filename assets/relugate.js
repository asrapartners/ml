// "V-shaped gate" demo for h1 = ReLU(x), h2 = ReLU(-x), s = h1 + h2 = |x|.
// One slider for x, live values for h1/h2/s, and a highlighted point on the V-shaped s(x) curve.
// Usage: initReluGate("container-id", { xRange: [min,max], xInit, threshold })
function initReluGate(containerId, opts) {
  const el = document.getElementById(containerId);
  const [xMin, xMax] = opts.xRange;
  const threshold = opts.threshold ?? 2;
  const W = 420, H = 240, PAD = 40;
  const sMax = Math.max(Math.abs(xMin), Math.abs(xMax));

  function sx(x) { return PAD + (x - xMin) / (xMax - xMin) * (W - PAD - 16); }
  function sy(s) { return H - PAD - (s / sMax) * (H - PAD - 16); }
  const relu = x => Math.max(0, x);

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="linefit-svg relugate-svg">
      <line x1="${PAD}" y1="${H - PAD}" x2="${W - 16}" y2="${H - PAD}" class="axis"/>
      <line x1="${PAD}" y1="${H - PAD}" x2="${PAD}" y2="16" class="axis"/>
      <line x1="${PAD}" y1="${sy(threshold)}" x2="${W - 16}" y2="${sy(threshold)}" class="gdstep-half"/>
      <text x="${W / 2}" y="${H - 8}" class="axis-label">x</text>
      <text x="14" y="${H / 2}" class="axis-label" transform="rotate(-90 14 ${H / 2})">s(x) = |x|</text>
      <path class="fit-line" d="M${sx(xMin)},${sy(-xMin)} L${sx(0)},${sy(0)} L${sx(xMax)},${sy(xMax)}"/>
      <circle class="relugate-pt" r="6" cx="0" cy="0"/>
    </svg>
    <div class="linefit-controls">
      <label>x
        <input type="range" class="x-slider" min="${xMin}" max="${xMax}" step="0.1" value="${opts.xInit ?? 0}">
        <span class="x-val"></span>
      </label>
      <div class="linefit-error relugate-readout"></div>
    </div>
  `;

  const pt = el.querySelector(".relugate-pt");
  const slider = el.querySelector(".x-slider");
  const xVal = el.querySelector(".x-val");
  const readout = el.querySelector(".relugate-readout");

  function render() {
    const x = parseFloat(slider.value);
    xVal.textContent = x.toFixed(1);
    const h1 = relu(x), h2 = relu(-x), s = h1 + h2;
    pt.setAttribute("cx", sx(x));
    pt.setAttribute("cy", sy(s));
    const action = s >= threshold ? "action taken" : "no action";
    readout.innerHTML = `h₁ = ReLU(x) = <strong>${h1.toFixed(1)}</strong> &nbsp; h₂ = ReLU(−x) = <strong>${h2.toFixed(1)}</strong> &nbsp; s = <strong>${s.toFixed(1)}</strong> &nbsp; (s ≥ ${threshold}? <strong>${action}</strong>)`;
  }

  slider.addEventListener("input", render);
  render();
}

// "Take one gradient step" widget for one-parameter logistic regression (no intercept).
// Renders a sigmoid curve p(x) = σ(βx), the training points, live per-point probabilities
// and average log loss, a β slider, and a button that performs one GD update
// β_new = β - η·L'(β) and animates the slider to it.
// Usage: initGDStep("container-id", { points: [[x,y], ...], xRange: [min,max],
//                                       betaMax, betaInit, eta })
function initGDStep(containerId, opts) {
  const el = document.getElementById(containerId);
  const points = opts.points;
  const [xMin, xMax] = opts.xRange;
  const betaMax = opts.betaMax ?? 3;
  const eta = opts.eta ?? 1;
  const W = 480, H = 260, PAD = 40;

  function sx(x) { return PAD + (x - xMin) / (xMax - xMin) * (W - PAD - 16); }
  function sy(p) { return H - PAD - p * (H - PAD - 16); }
  function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

  function curvePath(beta) {
    const steps = 60;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const p = sigmoid(beta * x);
      d += (i === 0 ? "M" : "L") + sx(x).toFixed(1) + "," + sy(p).toFixed(1) + " ";
    }
    return d;
  }

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="linefit-svg gdstep-svg">
      <line x1="${PAD}" y1="${H - PAD}" x2="${W - 16}" y2="${H - PAD}" class="axis"/>
      <line x1="${PAD}" y1="${H - PAD}" x2="${PAD}" y2="16" class="axis"/>
      <line x1="${PAD}" y1="${sy(0.5)}" x2="${W - 16}" y2="${sy(0.5)}" class="gdstep-half"/>
      <text x="${W / 2}" y="${H - 8}" class="axis-label">x</text>
      <text x="14" y="${H / 2}" class="axis-label" transform="rotate(-90 14 ${H / 2})">p(x) = σ(βx)</text>
      <path class="fit-line gdstep-curve" d=""/>
      <g class="gdstep-pts">
        ${points.map(([x, y]) => `<circle cx="${sx(x)}" cy="${sy(y)}" r="5" class="gdstep-pt ${y ? "pos" : "neg"}"/>`).join("")}
      </g>
    </svg>
    <div class="linefit-controls">
      <label>β
        <input type="range" class="beta-slider" min="${-betaMax}" max="${betaMax}" step="0.05" value="${opts.betaInit ?? 0}">
        <span class="beta-val"></span>
      </label>
      <div class="linefit-error">Average log loss L(β): <strong class="loss-val"></strong></div>
      <button type="button" class="gdstep-step-btn">Take one GD step (η = ${eta})</button>
      <div class="gdstep-step-note"></div>
    </div>
  `;

  const curve = el.querySelector(".gdstep-curve");
  const slider = el.querySelector(".beta-slider");
  const betaVal = el.querySelector(".beta-val");
  const lossVal = el.querySelector(".loss-val");
  const stepBtn = el.querySelector(".gdstep-step-btn");
  const stepNote = el.querySelector(".gdstep-step-note");

  function lossAndGrad(beta) {
    let loss = 0, grad = 0;
    for (const [x, y] of points) {
      const p = sigmoid(beta * x);
      loss += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
      grad += (p - y) * x;
    }
    return { loss: loss / points.length, grad: grad / points.length };
  }

  function render() {
    const beta = parseFloat(slider.value);
    betaVal.textContent = beta.toFixed(2);
    curve.setAttribute("d", curvePath(beta));
    const { loss } = lossAndGrad(beta);
    lossVal.textContent = loss.toFixed(3);
  }

  slider.addEventListener("input", () => { stepNote.textContent = ""; render(); });

  stepBtn.addEventListener("click", () => {
    const beta0 = parseFloat(slider.value);
    const { grad } = lossAndGrad(beta0);
    let beta1 = beta0 - eta * grad;
    beta1 = Math.max(-betaMax, Math.min(betaMax, beta1));
    slider.value = beta1;
    render();
    stepNote.textContent = `L'(β) = ${grad.toFixed(3)} → β: ${beta0.toFixed(2)} − ${eta}×(${grad.toFixed(3)}) = ${beta1.toFixed(2)}`;
  });

  render();
}

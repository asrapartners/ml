// Reusable "you are the machine" line-fitting widget.
// Renders an SVG scatterplot + two sliders (intercept, slope) into a container,
// live-drawing the resulting line and the total squared error.
// Usage: initLineFit("container-id", { points: [[x,y], ...], xRange: [min,max], yRange: [min,max],
//                                       xLabel: "...", yLabel: "...", unit: "$" })
function initLineFit(containerId, opts) {
  const el = document.getElementById(containerId);
  const points = opts.points;
  const [xMin, xMax] = opts.xRange;
  const [yMin, yMax] = opts.yRange;
  const W = 480, H = 300, PAD = 44;

  function sx(x) { return PAD + (x - xMin) / (xMax - xMin) * (W - PAD - 16); }
  function sy(y) { return H - PAD - (y - yMin) / (yMax - yMin) * (H - PAD - 16); }

  const b0Init = opts.b0Init ?? (yMin + yMax) / 2 - 0.15 * (xMin + xMax) / 2;
  const b1Init = opts.b1Init ?? 0.15;
  const b0Max = opts.b0Max ?? yMax;
  const b1Max = opts.b1Max ?? (yMax - yMin) / (xMax - xMin) * 2;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="linefit-svg">
      <line x1="${PAD}" y1="${H - PAD}" x2="${W - 16}" y2="${H - PAD}" class="axis"/>
      <line x1="${PAD}" y1="${H - PAD}" x2="${PAD}" y2="16" class="axis"/>
      <text x="${W / 2}" y="${H - 8}" class="axis-label">${opts.xLabel}</text>
      <text x="14" y="${H / 2}" class="axis-label" transform="rotate(-90 14 ${H / 2})">${opts.yLabel}</text>
      <g class="dots">
        ${points.map(([x, y]) => `<circle cx="${sx(x)}" cy="${sy(y)}" r="5"/>`).join("")}
      </g>
      <line class="fit-line" x1="${sx(xMin)}" y1="0" x2="${sx(xMax)}" y2="0"/>
    </svg>
    <div class="linefit-controls">
      <label>Starting value (intercept)
        <input type="range" class="b0" min="0" max="${b0Max}" step="1" value="${b0Init}">
        <span class="b0-val"></span>
      </label>
      <label>Rate of increase (slope)
        <input type="range" class="b1" min="0" max="${b1Max}" step="${b1Max / 200}" value="${b1Init}">
        <span class="b1-val"></span>
      </label>
      <div class="linefit-error">Total error: <strong class="err-val"></strong></div>
    </div>
  `;

  const line = el.querySelector(".fit-line");
  const b0Input = el.querySelector(".b0");
  const b1Input = el.querySelector(".b1");
  const b0Val = el.querySelector(".b0-val");
  const b1Val = el.querySelector(".b1-val");
  const errVal = el.querySelector(".err-val");

  function update() {
    const b0 = parseFloat(b0Input.value);
    const b1 = parseFloat(b1Input.value);
    b0Val.textContent = opts.unit + b0.toFixed(0);
    b1Val.textContent = b1.toFixed(3);

    const yAtMin = b0 + b1 * xMin;
    const yAtMax = b0 + b1 * xMax;
    line.setAttribute("y1", sy(yAtMin));
    line.setAttribute("y2", sy(yAtMax));

    let sse = 0;
    for (const [x, y] of points) {
      const pred = b0 + b1 * x;
      sse += (y - pred) * (y - pred);
    }
    errVal.textContent = Math.round(sse).toLocaleString();
  }

  b0Input.addEventListener("input", update);
  b1Input.addEventListener("input", update);
  update();
}

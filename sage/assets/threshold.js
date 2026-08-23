// "Drag the threshold" demo: two rows of scored people (actually-positive / actually-negative),
// a draggable threshold line, live confusion-matrix counts, and a mini ROC curve that
// accumulates a trail of (FPR, TPR) points as the threshold sweeps.
// Usage: initThreshold("container-id", { positives: [scores...], negatives: [scores...],
//                                         posName, negName, flagName })
function initThreshold(containerId, opts) {
  const el = document.getElementById(containerId);
  const positives = opts.positives;
  const negatives = opts.negatives;
  const stripW = 460, stripH = 60, margin = 20;
  const rocSize = 140, rocMargin = 22;

  function sx(score) { return margin + score * (stripW - 2 * margin); }

  function dotsSvg(scores, cls) {
    return scores.map((s, i) =>
      `<circle class="th-dot ${cls}" data-score="${s}" cx="${sx(s)}" cy="30" r="7"></circle>`
    ).join("");
  }

  el.innerHTML = `
    <div class="threshold-main">
      <div class="threshold-row-label">Actually ${opts.posName}</div>
      <svg viewBox="0 0 ${stripW} ${stripH}" class="threshold-strip">
        ${dotsSvg(positives, "pos")}
        <line class="th-line pos-line" x1="0" y1="4" x2="0" y2="${stripH - 4}"/>
      </svg>
      <div class="threshold-row-label">Actually ${opts.negName}</div>
      <svg viewBox="0 0 ${stripW} ${stripH}" class="threshold-strip">
        ${dotsSvg(negatives, "neg")}
        <line class="th-line neg-line" x1="0" y1="4" x2="0" y2="${stripH - 4}"/>
      </svg>
      <div class="threshold-axis-label">Model score — low means "probably not", high means "probably" &rarr;</div>
    </div>
    <div class="threshold-side">
      <label>Threshold t = <span class="t-val"></span>
        <input type="range" class="t-slider" min="0" max="1" step="0.01" value="${opts.tInit ?? 0.3}">
      </label>
      <div class="threshold-counts">
        <div><span>True positive</span><strong class="c-tp"></strong></div>
        <div><span>False negative</span><strong class="c-fn"></strong></div>
        <div><span>False positive</span><strong class="c-fp"></strong></div>
        <div><span>True negative</span><strong class="c-tn"></strong></div>
      </div>
      <div class="threshold-rates">
        <div>TPR = <strong class="r-tpr"></strong></div>
        <div>FPR = <strong class="r-fpr"></strong></div>
      </div>
      <svg viewBox="0 0 ${rocSize} ${rocSize}" class="roc-mini">
        <line x1="${rocMargin}" y1="${rocSize - rocMargin}" x2="${rocSize - rocMargin}" y2="${rocMargin}" class="roc-diag"/>
        <line x1="${rocMargin}" y1="${rocSize - rocMargin}" x2="${rocSize - rocMargin}" y2="${rocSize - rocMargin}" class="roc-axis"/>
        <line x1="${rocMargin}" y1="${rocSize - rocMargin}" x2="${rocMargin}" y2="${rocMargin}" class="roc-axis"/>
        <g class="roc-trail"></g>
        <circle class="roc-current" cx="0" cy="0" r="4"/>
      </svg>
      <div class="roc-caption">Each drag plots one (FPR, TPR) point — sweep the whole slider and you trace the ROC curve. AUC is the area under that trail.</div>
    </div>
  `;

  const posDots = el.querySelectorAll(".th-dot.pos");
  const negDots = el.querySelectorAll(".th-dot.neg");
  const posLine = el.querySelector(".pos-line");
  const negLine = el.querySelector(".neg-line");
  const slider = el.querySelector(".t-slider");
  const tVal = el.querySelector(".t-val");
  const cTp = el.querySelector(".c-tp"), cFn = el.querySelector(".c-fn");
  const cFp = el.querySelector(".c-fp"), cTn = el.querySelector(".c-tn");
  const rTpr = el.querySelector(".r-tpr"), rFpr = el.querySelector(".r-fpr");
  const rocTrail = el.querySelector(".roc-trail");
  const rocCurrent = el.querySelector(".roc-current");

  function rocXY(fpr, tpr) {
    return {
      x: rocMargin + fpr * (rocSize - 2 * rocMargin),
      y: (rocSize - rocMargin) - tpr * (rocSize - 2 * rocMargin)
    };
  }

  function update() {
    const t = parseFloat(slider.value);
    tVal.textContent = t.toFixed(2);
    const lineX = sx(t);
    posLine.setAttribute("x1", lineX); posLine.setAttribute("x2", lineX);
    negLine.setAttribute("x1", lineX); negLine.setAttribute("x2", lineX);

    let tp = 0, fn = 0, fp = 0, tn = 0;
    posDots.forEach(d => {
      const flagged = parseFloat(d.dataset.score) >= t;
      d.classList.toggle("flagged", flagged);
      flagged ? tp++ : fn++;
    });
    negDots.forEach(d => {
      const flagged = parseFloat(d.dataset.score) >= t;
      d.classList.toggle("flagged", flagged);
      flagged ? fp++ : tn++;
    });

    cTp.textContent = tp; cFn.textContent = fn; cFp.textContent = fp; cTn.textContent = tn;
    const tpr = tp / (tp + fn);
    const fpr = fp / (fp + tn);
    rTpr.textContent = tpr.toFixed(2);
    rFpr.textContent = fpr.toFixed(2);

    const p = rocXY(fpr, tpr);
    rocCurrent.setAttribute("cx", p.x);
    rocCurrent.setAttribute("cy", p.y);

    const trailDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    trailDot.setAttribute("cx", p.x);
    trailDot.setAttribute("cy", p.y);
    trailDot.setAttribute("r", 2);
    trailDot.setAttribute("class", "roc-trail-dot");
    rocTrail.appendChild(trailDot);
  }

  slider.addEventListener("input", update);
  update();
}

// "Drag the threshold" demo: two rows of scored people (actually-positive / actually-negative),
// a draggable threshold line, live confusion-matrix counts, and a mini ROC curve that
// accumulates a trail of (FPR, TPR) points as the threshold sweeps.
// Usage: initThreshold("container-id", { positives: [scores...], negatives: [scores...],
//                                         posName, negName, flagName })
function initThreshold(containerId, opts) {
  const el = document.getElementById(containerId);
  const positives = opts.positives;
  const negatives = opts.negatives;
  const stripW = 480, stripH = 90, margin = 22;
  const rocSize = 140, rocMargin = 22;
  const dotY = 48;

  function sx(score) { return margin + score * (stripW - 2 * margin); }

  // sort scores so labels can alternate above/below in score order — that's what
  // actually keeps adjacent, closely-spaced labels from colliding, not the original array order
  function dotsSvg(scores, cls) {
    const order = scores.map((s, i) => ({ s, i })).sort((a, b) => a.s - b.s);
    const rank = new Map(order.map((o, r) => [o.i, r]));
    return scores.map((s, i) => {
      const cx = sx(s);
      const above = rank.get(i) % 2 === 0;
      const labelY = above ? dotY - 18 : dotY + 26;
      return `<g class="th-dot-group">
        <circle class="th-dot ${cls}" data-score="${s}" cx="${cx}" cy="${dotY}" r="9">
          <title>score: ${s.toFixed(2)}</title>
        </circle>
        <line class="th-dot-tick" x1="${cx}" y1="${above ? dotY - 10 : dotY + 10}" x2="${cx}" y2="${above ? labelY + 3 : labelY - 7}"/>
        <text class="th-dot-label" x="${cx}" y="${labelY}">${s.toFixed(2)}</text>
      </g>`;
    }).join("");
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
    <div class="cm-wrap">
      <table class="cm-table">
        <tr>
          <td class="cm-corner"></td>
          <th class="cm-col">Flagged<br><span class="cm-sub">score ≥ t</span></th>
          <th class="cm-col">Not flagged<br><span class="cm-sub">score &lt; t</span></th>
        </tr>
        <tr>
          <th class="cm-row">Actually<br>${opts.posName}</th>
          <td class="cm-cell correct"><span class="cm-num c-tp"></span><span class="cm-label">true positive</span></td>
          <td class="cm-cell wrong"><span class="cm-num c-fn"></span><span class="cm-label">false negative</span></td>
        </tr>
        <tr>
          <th class="cm-row">Actually<br>${opts.negName}</th>
          <td class="cm-cell wrong"><span class="cm-num c-fp"></span><span class="cm-label">false positive</span></td>
          <td class="cm-cell correct"><span class="cm-num c-tn"></span><span class="cm-label">true negative</span></td>
        </tr>
      </table>
      <p class="cm-rule">
        Each cell = dots matching <em>both</em> its row and column. <strong>True positive</strong>: actually ${opts.posName}, flagged. <strong>False negative</strong>: actually ${opts.posName}, missed. <strong>False positive</strong>: actually ${opts.negName}, flagged by mistake. <strong>True negative</strong>: actually ${opts.negName}, correctly left alone.
      </p>
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

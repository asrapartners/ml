// "Ask your neighbors" kNN demo: click to place a query point, drag the K slider,
// see the K nearest points highlighted and the majority-vote result.
// Usage: initKNN("container-id", { points: [{x,y,label:'a'|'b'}, ...], colorA, colorB, nameA, nameB, kMax })
function initKNN(containerId, opts) {
  const el = document.getElementById(containerId);
  const points = opts.points;
  const W = 400, H = 300;
  const kMax = opts.kMax ?? 7;
  let query = opts.queryInit ?? { x: 170, y: 165 };

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="knn-svg">
      <rect x="0" y="0" width="${W}" height="${H}" class="knn-bg"/>
      <circle class="knn-radius" cx="0" cy="0" r="0"/>
      <g class="knn-points">
        ${points.map((p, i) => `<circle data-i="${i}" cx="${p.x}" cy="${p.y}" r="6" class="knn-pt ${p.label}"/>`).join("")}
      </g>
      <circle class="knn-query" cx="${query.x}" cy="${query.y}" r="7"/>
    </svg>
    <div class="knn-controls">
      <label>K = <span class="k-val"></span>
        <input type="range" class="k-slider" min="1" max="${kMax}" step="1" value="3">
      </label>
      <p class="knn-hint">Click anywhere on the map to move the query point.</p>
      <div class="knn-result"></div>
    </div>
  `;

  const svg = el.querySelector("svg");
  const kSlider = el.querySelector(".k-slider");
  const kVal = el.querySelector(".k-val");
  const queryDot = el.querySelector(".knn-query");
  const radiusCircle = el.querySelector(".knn-radius");
  const result = el.querySelector(".knn-result");
  const ptEls = el.querySelectorAll(".knn-pt");

  function svgPoint(evt) {
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width, scaleY = H / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  function update() {
    const k = parseInt(kSlider.value, 10);
    kVal.textContent = k;

    const withDist = points.map((p, i) => ({
      i, label: p.label,
      d: Math.hypot(p.x - query.x, p.y - query.y)
    })).sort((a, b) => a.d - b.d);

    const neighbors = withDist.slice(0, k);
    const countA = neighbors.filter(n => n.label === "a").length;
    const countB = neighbors.filter(n => n.label === "b").length;
    const winner = countA === countB ? "tie" : (countA > countB ? "a" : "b");

    ptEls.forEach((el, i) => el.classList.remove("knn-selected"));
    neighbors.forEach(n => ptEls[n.i].classList.add("knn-selected"));

    const maxD = neighbors[neighbors.length - 1].d;
    radiusCircle.setAttribute("cx", query.x);
    radiusCircle.setAttribute("cy", query.y);
    radiusCircle.setAttribute("r", maxD);

    queryDot.setAttribute("cx", query.x);
    queryDot.setAttribute("cy", query.y);
    queryDot.setAttribute("class", "knn-query " + (winner === "tie" ? "" : "predict-" + winner));

    const winnerName = winner === "tie" ? "tie — no majority" : (winner === "a" ? opts.nameA : opts.nameB);
    result.innerHTML = `${countA} ${opts.nameA} · ${countB} ${opts.nameB} &rarr; predicted: <strong>${winnerName}</strong>`;
  }

  svg.addEventListener("click", (evt) => {
    query = svgPoint(evt);
    update();
  });
  kSlider.addEventListener("input", update);
  update();
}

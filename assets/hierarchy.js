// "Build the hierarchy" exercise: click terms in order, broadest to narrowest,
// to nest a box one level deeper each time. A named "fitted instance" (e.g. GPT)
// unlocks only once the narrowest family box is placed, and renders as a tag
// inside that box rather than a level of its own — the family-vs-fitted-model
// distinction made visual, not just stated.
// Usage: initHierarchy("container-id", {
//   levels: [{ key, label, blurb }, ...],   // broadest first
//   fitted: { key, label, blurb }            // unlocks after the last level
// })
function initHierarchy(containerId, opts) {
  const el = document.getElementById(containerId);
  const levels = opts.levels;
  const fitted = opts.fitted;
  const order = levels.map(l => l.key);
  const shuffled = [...order].sort(() => 0.5 - Math.random());
  shuffled.splice(Math.floor(Math.random() * (shuffled.length + 1)), 0, fitted.key);

  el.innerHTML = `
    <div class="hierarchy-bank"></div>
    <div class="hierarchy-hint"></div>
    <div class="hierarchy-nest"></div>
  `;
  const bank = el.querySelector(".hierarchy-bank");
  const hint = el.querySelector(".hierarchy-hint");
  const nest = el.querySelector(".hierarchy-nest");

  let placedCount = 0;
  let fittedPlaced = false;

  function labelFor(key) {
    return key === fitted.key ? fitted.label : levels[order.indexOf(key)].label;
  }

  function render() {
    bank.innerHTML = "";
    shuffled.forEach(key => {
      const isFitted = key === fitted.key;
      const already = isFitted ? fittedPlaced : order.indexOf(key) < placedCount;
      if (already) return;
      const btn = document.createElement("button");
      btn.className = "hierarchy-chip";
      btn.textContent = labelFor(key);
      if (isFitted && placedCount < order.length) btn.disabled = true;
      btn.addEventListener("click", () => handleClick(key, btn));
      bank.appendChild(btn);
    });

    nest.innerHTML = "";
    let parent = nest;
    for (let i = 0; i < placedCount; i++) {
      const lvl = levels[i];
      const box = document.createElement("div");
      box.className = "hierarchy-box";
      box.innerHTML = `<div class="hierarchy-box-label">${lvl.label}</div><div class="hierarchy-box-blurb">${lvl.blurb}</div>`;
      if (i === placedCount - 1 && fittedPlaced) {
        box.innerHTML += `<div class="hierarchy-fitted-tag"><strong>${fitted.label}</strong> — ${fitted.blurb}</div>`;
      }
      parent.appendChild(box);
      parent = box;
    }
  }

  function handleClick(key, btn) {
    if (key === fitted.key) {
      if (placedCount < order.length) return;
      fittedPlaced = true;
      hint.textContent = "";
      render();
      return;
    }
    const expected = order[placedCount];
    if (key === expected) {
      placedCount++;
      hint.textContent = "";
      render();
    } else {
      btn.classList.remove("wrong-shake");
      void btn.offsetWidth;
      btn.classList.add("wrong-shake");
      hint.textContent = `Not yet — ${levels[placedCount].label} has to come first. What holds ${labelFor(key)}?`;
    }
  }

  render();
}

// Reusable "path game" exercise widget — a Duolingo-style vertical trail of
// locked/current/done stop circles, with all real content (scenario, question,
// neutral options, and post-choice feedback) living in one card for the current stop.
// Nothing on the trail itself reveals which upcoming choice is correct.
//
// Usage: initPathGame("container-id", {
//   forks: [{ id, icon, scenario, ask, options: [{label, correct, tag, title, body, note}] }],
//   winTitle, winBody, winLinks: [{label, href}]
// })
function initPathGame(containerId, opts) {
  const el = document.getElementById(containerId);
  const FORKS = opts.forks;
  const ORDER = FORKS.map(f => f.id);
  const STOPS = ['start', ...ORDER, 'win'];
  const ICONS = { start: '🚩', win: '🏆' };

  el.innerHTML = `
    <div class="pathgame-layout">
      <div class="pathgame-trail-wrap">
        <svg viewBox="0 0 220 780" class="pathgame-trail-svg" id="${containerId}-trail"></svg>
      </div>
      <div class="pathgame-card" id="${containerId}-card"></div>
    </div>
  `;

  const trailSvg = document.getElementById(`${containerId}-trail`);
  const card = document.getElementById(`${containerId}-card`);

  let current = ORDER[0];
  let done = new Set();
  let pendingFeedback = null;
  let showingCorrect = null;

  function forkById(id) { return FORKS.find(f => f.id === id); }
  function nextId(id) {
    const i = ORDER.indexOf(id);
    return i === ORDER.length - 1 ? 'win' : ORDER[i + 1];
  }
  function stopStatus(id) {
    if (done.has(id)) return 'done';
    if (id === current) return 'current';
    return 'locked';
  }

  function drawTrail() {
    const topPad = 60, gap = 110;
    const xs = [150, 80, 210, 80, 210, 80, 150];
    const pts = STOPS.map((id, i) => ({ id, x: xs[i % xs.length], y: topPad + i * gap }));

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i];
      const midY = (p0.y + p1.y) / 2;
      path += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }

    trailSvg.setAttribute('viewBox', `0 0 220 ${topPad + (pts.length - 1) * gap + 70}`);
    let s = `<path class="pathgame-trail-path" d="${path}"/>`;
    pts.forEach((p, i) => {
      const status = stopStatus(p.id);
      const icon = ICONS[p.id] || i;
      s += `<g class="pathgame-stop ${status}">
        <circle class="pathgame-stop-ring" cx="${p.x}" cy="${p.y}" r="24"/>
        <text class="pathgame-stop-icon" x="${p.x}" y="${p.y + 1}">${icon}</text>
      </g>`;
    });
    trailSvg.innerHTML = s;
  }

  function renderCard() {
    if (showingCorrect) {
      const f = forkById(showingCorrect);
      const opt = f.options.find(o => o.correct);
      card.innerHTML = `
        <div class="pathgame-feedback correct">
          <div class="tag">✓ That's it</div>
          <h3>${opt.label}</h3>
          <p>${opt.note}</p>
          <button class="pathgame-action" id="${containerId}-continue">Continue</button>
        </div>
      `;
      document.getElementById(`${containerId}-continue`).addEventListener('click', () => {
        done.add(showingCorrect);
        current = nextId(showingCorrect);
        showingCorrect = null;
        pendingFeedback = null;
        drawTrail();
        renderCard();
      });
      return;
    }

    if (current === 'win') {
      card.innerHTML = `
        <div class="pathgame-feedback correct">
          <div class="tag">✓ Solved</div>
          <h3>${opts.winTitle}</h3>
          <p>${opts.winBody}</p>
          <div class="pathgame-win-links">
            ${(opts.winLinks || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
          </div>
          <button class="pathgame-action" id="${containerId}-replay">Play again</button>
        </div>
      `;
      document.getElementById(`${containerId}-replay`).addEventListener('click', () => {
        current = ORDER[0]; done = new Set(); showingCorrect = null; pendingFeedback = null;
        drawTrail(); renderCard();
      });
      return;
    }

    const f = forkById(current);

    if (pendingFeedback && pendingFeedback.forkId === current) {
      const opt = pendingFeedback.opt;
      card.innerHTML = `
        <div class="pathgame-feedback wrong">
          <div class="tag">⚠ ${opt.tag}</div>
          <h3>${opt.title}</h3>
          <p>${opt.body}</p>
          <button class="pathgame-action" id="${containerId}-retry">&larr; Try again</button>
        </div>
      `;
      document.getElementById(`${containerId}-retry`).addEventListener('click', () => {
        pendingFeedback = null;
        renderCard();
      });
      return;
    }

    card.innerHTML = `
      <div class="pathgame-step-label">Step ${ORDER.indexOf(current) + 1} of ${ORDER.length}</div>
      <div class="pathgame-scenario">${f.scenario}</div>
      <div class="pathgame-ask">${f.ask}</div>
      <div class="pathgame-options">
        ${f.options.map((o, i) => `<button data-i="${i}">${o.label}</button>`).join('')}
      </div>
    `;
    card.querySelectorAll('.pathgame-options button').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = f.options[parseInt(btn.dataset.i, 10)];
        if (opt.correct) { showingCorrect = f.id; }
        else { pendingFeedback = { forkId: f.id, opt }; }
        renderCard();
      });
    });
  }

  drawTrail();
  renderCard();
}

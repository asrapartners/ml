// Sticky top bar: a prominent "Home" link plus a Foundation/Sage switcher.
// Injected at the top of <body> on every page. If the current page is a
// numbered lesson that exists in both workspaces, the switcher jumps to the
// matching lesson number in the other version instead of just its home page.
(function () {
  const FOUNDATION_LESSONS = {
    "1": "/lessons/0001-from-data-to-decisions.html",
    "2": "/lessons/0002-model-families.html",
    "3": "/lessons/0003-evaluation.html",
    "4": "/lessons/0004-build-the-policy.html"
  };
  const SAGE_LESSONS = {
    "1": "/sage/lessons/0001-the-finger-and-the-moon.html",
    "2": "/sage/lessons/0002-skillful-means.html",
    "3": "/sage/lessons/0003-action-and-its-fruits.html",
    "4": "/sage/lessons/0004-one-decision.html"
  };

  const path = window.location.pathname;
  const inSage = path.indexOf("/sage/") !== -1;
  const m = path.match(/000(\d)-/);
  const lessonNum = m ? m[1] : null;

  let foundationHref = "/";
  let sageHref = "/sage/";
  if (lessonNum && FOUNDATION_LESSONS[lessonNum] && SAGE_LESSONS[lessonNum]) {
    foundationHref = FOUNDATION_LESSONS[lessonNum];
    sageHref = SAGE_LESSONS[lessonNum];
  }

  const bar = document.createElement("div");
  bar.className = "topbar";
  bar.innerHTML =
    '<a href="/" class="topbar-home">&#8962; Home</a>' +
    '<div class="topbar-switch">' +
      '<a href="' + foundationHref + '" class="topbar-pill' + (!inSage ? " active" : "") + '">Foundation</a>' +
      '<a href="' + sageHref + '" class="topbar-pill' + (inSage ? " active" : "") + '">Sage</a>' +
    '</div>';
  document.body.insertBefore(bar, document.body.firstChild);

  // Show a "Build <hash> · <date>" line in the footer, if this page has one,
  // so it's possible to confirm at a glance whether the page is up to date.
  fetch("/version.json")
    .then(r => (r.ok ? r.json() : null))
    .then(data => {
      if (!data) return;
      const footer = document.querySelector(".footer-links");
      if (!footer) return;
      const d = new Date(data.timestamp);
      const formatted = d.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short",
        timeZone: "America/New_York"
      });
      const span = document.createElement("span");
      span.className = "build-info";
      span.textContent = "Build " + data.hash + " · " + formatted;
      footer.appendChild(span);
    })
    .catch(() => {});
})();

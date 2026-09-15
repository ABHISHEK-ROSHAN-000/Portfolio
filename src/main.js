/* Yumiko static replica — vanilla interactions. No frameworks, no third parties. */
import "./style.css";

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header reveals on load (it is fixed, so scroll observation can never fire) */
  var headerEl = document.querySelector('[data-reveal="header"]');
  function showHeader() {
    if (headerEl) headerEl.classList.add("is-visible");
  }
  if (headerEl && !reduceMotion) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(showHeader);
    });
  } else {
    showHeader();
  }

  /* Scroll-reveal for everything except the fixed header */
  var revealEls = document.querySelectorAll("[data-reveal]:not([data-reveal='header'])");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Work List / Grid switch */
  var switchOptions = document.querySelectorAll(".switch-option");
  var views = document.querySelectorAll("[data-work-view]");
  switchOptions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchOptions.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      var view = btn.getAttribute("data-view");
      views.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-work-view") !== view;
      });
    });
  });

  /* Mobile menu */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () {
    setMenu(!menu.classList.contains("open"));
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  /* Trusted-logo marquee: duplicate the track for a seamless loop */
  var track = document.querySelector(".marquee-track");
  if (track && !reduceMotion) {
    Array.prototype.forEach.call(track.children, function (li) {
      var copy = li.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
    });
  }

  /* Footer live clock: HH:MM:SS + local timezone name */
  var timeEl = document.getElementById("local-time");
  var tzEl = document.getElementById("tz-name");
  var tzName = "Local";
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.indexOf("/") !== -1) tzName = tz.split("/").pop().replace(/_/g, " ");
    else if (tz) tzName = tz;
  } catch (e) { /* keep fallback */ }
  tzEl.textContent = tzName;
  function tick() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, "0");
    var mm = String(now.getMinutes()).padStart(2, "0");
    var ss = String(now.getSeconds()).padStart(2, "0");
    timeEl.textContent = hh + ":" + mm + ":" + ss;
  }
  tick();
  window.setInterval(tick, 1000);
})();

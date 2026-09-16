/* Yumiko static replica — vanilla interactions. No frameworks, no third parties. */
import "./style.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-900.css";
import Lenis from "lenis";

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
            /* Release the compositor layer once the reveal finishes */
            window.setTimeout(function () { entry.target.style.willChange = "auto"; }, 950);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Lenis smooth scroll (skipped under reduced motion) */
  var lenis = null;
  if (!reduceMotion) {
    lenis = new Lenis({ lerp: 0.12, smoothWheel: true, anchors: true });
    var rafLenis = function (time) {
      lenis.raf(time);
      window.requestAnimationFrame(rafLenis);
    };
    window.requestAnimationFrame(rafLenis);
  }

  /* Portrait parallax on desktop only */
  var portrait = document.querySelector(".hero-portrait");
  if (portrait && window.innerWidth >= 810 && !reduceMotion) {
    portrait.addEventListener("mousemove", function (e) {
      var rect = portrait.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var img = portrait.querySelector("img");
      if (img) {
        img.style.transform = "translate(" + (x * -20) + "px, " + (y * -20) + "px)";
      }
    });
    portrait.addEventListener("mouseleave", function () {
      var img = portrait.querySelector("img");
      if (img) img.style.transform = "";
    });
  }

  /* Work List / Grid switch — set initial view by breakpoint (List on desktop, Grid below 1200px) */
  var switchOptions = document.querySelectorAll(".switch-option");
  var views = document.querySelectorAll("[data-work-view]");
  var initialView = window.innerWidth >= 1200 ? "list" : "grid";
  views.forEach(function (panel) {
    panel.hidden = panel.getAttribute("data-work-view") !== initialView;
  });
  switchOptions.forEach(function (btn) {
    btn.classList.toggle("is-active", btn.getAttribute("data-view") === initialView);
    btn.setAttribute("aria-selected", btn.getAttribute("data-view") === initialView ? "true" : "false");
  });

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

  /* Work list hover: floating 200px project preview near the cursor (fine pointers only) */
  var workList = document.querySelector(".work-list");
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  if (workList && finePointer && !reduceMotion) {
    var thumbs = Array.prototype.map.call(
      document.querySelectorAll(".work-grid .card-media img"),
      function (img) { return img.getAttribute("src"); }
    );
    var preview = document.createElement("div");
    preview.className = "row-preview";
    preview.setAttribute("aria-hidden", "true");
    var previewImg = document.createElement("img");
    previewImg.setAttribute("alt", "");
    preview.appendChild(previewImg);
    document.body.appendChild(preview);
    var rows = workList.querySelectorAll(".work-row");
    workList.addEventListener("mousemove", function (e) {
      preview.style.transform = "translate(" + (e.clientX + 24) + "px, " + (e.clientY - 110) + "px)";
    });
    Array.prototype.forEach.call(rows, function (row, i) {
      row.addEventListener("mouseenter", function () {
        previewImg.setAttribute("src", thumbs[i] || "");
        preview.classList.remove("show");
        void preview.offsetWidth;
        preview.classList.add("show");
      });
      row.addEventListener("mouseleave", function () {
        preview.classList.remove("show");
      });
    });
  }

  /* Smooth trailing cursor dot (fine pointers only) */
  if (finePointer && !reduceMotion) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    var targetX = -100;
    var targetY = -100;
    var dotX = -100;
    var dotY = -100;
    var dotVisible = false;
    document.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!dotVisible) {
        dotVisible = true;
        dotX = targetX;
        dotY = targetY;
        dot.classList.add("on");
      }
    });
    document.addEventListener("mouseleave", function () {
      dotVisible = false;
      dot.classList.remove("on");
    });
    var last = window.performance.now();
    (function follow(now) {
      var dt = Math.min(50, now - last) / 16.667;
      last = now;
      var f = 1 - Math.pow(1 - 0.12, dt);
      dotX += (targetX - dotX) * f;
      dotY += (targetY - dotY) * f;
      dot.style.transform = "translate(" + dotX.toFixed(1) + "px, " + dotY.toFixed(1) + "px)";
      window.requestAnimationFrame(follow);
    })();
  }

  /* Page wipe transitions (vertical; skipped under reduced motion via CSS) */
  var wipe = document.querySelector(".wipe");
  if (wipe) {
    /* Never snapshot or restore a covered page (bfcache Back/Forward) */
    window.addEventListener("pagehide", function () {
      wipe.classList.remove("wipe-exit", "wipe-done");
    });
    window.addEventListener("pageshow", function () {
      wipe.classList.remove("wipe-exit");
      wipe.style.animation = "none";
      void wipe.offsetWidth;
      wipe.style.animation = "";
    });
    /* Failsafe: healthy enter finishes ~1.2s, so a cover alive at 2.5s is stuck */
    var wipeFailsafe = window.setTimeout(function () { wipe.classList.add("wipe-done"); }, 2500);
    window.__clearWipeFailsafe = function () { window.clearTimeout(wipeFailsafe); };
  }
  if (wipe && !reduceMotion) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (link) {
      var href = link.getAttribute("href") || "";
      var internal = href.charAt(0) !== "#" && !/^[a-z]+:/i.test(href) && !link.hasAttribute("target");
      if (!internal) return;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.__clearWipeFailsafe) window.__clearWipeFailsafe();
        wipe.classList.add("wipe-exit");
        window.setTimeout(function () { window.location.href = link.href; }, 620);
      });
    });
  }
  /* Mobile menu */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
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

  /* Seamless loops: duplicate marquee + gallery tracks */
  Array.prototype.forEach.call(document.querySelectorAll(".marquee-track, .gallery-track"), function (track) {
    if (!track || reduceMotion) return;
    Array.prototype.forEach.call(track.children, function (item) {
      var copy = item.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
    });
  });

  /* Footer live clock: HH:MM:SS UTC */
  var timeEl = document.getElementById("local-time");
  var tzEl = document.getElementById("tz-name");
  if (tzEl) tzEl.textContent = "UTC";
  function tick() {
    var now = new Date();
    var hh = String(now.getUTCHours()).padStart(2, "0");
    var mm = String(now.getUTCMinutes()).padStart(2, "0");
    var ss = String(now.getUTCSeconds()).padStart(2, "0");
    timeEl.textContent = hh + ":" + mm + ":" + ss;
  }
  tick();
  window.setInterval(tick, 1000);
})();

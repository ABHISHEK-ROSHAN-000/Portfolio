/* Yumiko static replica — vanilla interactions. No frameworks, no third parties. */
import "./style.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-900.css";
import Lenis from "lenis";
import { footerHTML } from "./components/footer.js";

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* Shared footer component (single source, mounted before anything binds to it) */
  var footerMount = document.getElementById("site-footer");
  if (footerMount) footerMount.outerHTML = footerHTML;

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
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" }
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

  /* Work List / Grid switch — per-page default override, else List on desktop / Grid below 1200px */
  var switchOptions = document.querySelectorAll(".switch-option");
  var views = document.querySelectorAll("[data-work-view]");
  var switchRoot = document.querySelector(".switch");
  var initialView = (switchRoot && switchRoot.getAttribute("data-view-default")) || (window.innerWidth >= 1200 ? "list" : "grid");
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
    var lastMX = null;
    var lastMY = null;
    document.addEventListener("mousemove", function (e) {
      lastMX = e.clientX;
      lastMY = e.clientY;
    }, { passive: true });
    workList.addEventListener("mousemove", function (e) {
      preview.style.transform = "translate(" + (e.clientX + 24) + "px, " + (e.clientY - 110) + "px)";
    });
    Array.prototype.forEach.call(rows, function (row, i) {
      row.addEventListener("mouseenter", function () {
        if (lastMX === null || lastMY === null) return;
        preview.style.transform = "translate(" + (lastMX + 24) + "px, " + (lastMY - 110) + "px)";
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
    dot.innerHTML = '<span class="cursor-select" aria-hidden="true"><span class="sh sh--tl"></span><span class="sh sh--tr"></span><span class="sh sh--bl"></span><span class="sh sh--br"></span></span><span class="cursor-you">YOU</span><span class="cursor-label">View</span><svg class="cursor-arrow" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
    var currentLabel = "View";
    var labelTimer = null;
    document.addEventListener("mouseover", function (e) {
      var hit = e.target.closest ? e.target.closest(".card, .contact-row") : null;
      var inHero = e.target.closest ? !!e.target.closest(".hero--stage") : false;
      var inName = e.target.closest ? !!e.target.closest(".hero-name-box, .hero-tapes") : false;
      var label = "View";
      if (hit && hit.classList.contains("contact-row")) {
        var href = hit.getAttribute("href") || "";
        if (href.indexOf("mailto:") === 0) label = "Say Hi";
        else if (href.indexOf("tel:") === 0) label = "Call";
        else label = "Open";
      }
      dot.classList.toggle("view", !!hit);
      /* The YOU tag rides the same cursor while it is over the hero collage. */
      dot.classList.toggle("you", inHero && !hit && !inName);
      /* Over the name box the cursor itself becomes the selection marquee. */
      dot.classList.toggle("select", inName && !hit);
      if (label === currentLabel) return;
      currentLabel = label;
      var labelEl = dot.querySelector(".cursor-label");
      if (!labelEl) return;
      window.clearTimeout(labelTimer);
      labelEl.style.opacity = "0";
      labelTimer = window.setTimeout(function () {
        labelEl.textContent = label;
        labelEl.style.opacity = "";
      }, 120);
    });
    var last = window.performance.now();
    var follow = function (now) {
      var dt = now - last;
      if (!isFinite(dt) || dt < 0) dt = 16.667;
      dt = Math.min(50, dt) / 16.667;
      last = now;
      if (!isFinite(dotX) || !isFinite(dotY)) { dotX = targetX; dotY = targetY; }
      var f = 1 - Math.pow(1 - 0.12, dt);
      dotX += (targetX - dotX) * f;
      dotY += (targetY - dotY) * f;
      dot.style.transform = "translate(" + dotX.toFixed(1) + "px, " + dotY.toFixed(1) + "px) translate(-50%, -50%)";
      window.requestAnimationFrame(follow);
    };
    window.requestAnimationFrame(follow);
    window.addEventListener("pageshow", function () {
      dotX = targetX;
      dotY = targetY;
    });
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

  /* Hero clock: visitor-local 12h HH:MM:SS AM/PM */
  var heroTime = document.getElementById("hero-time");
  if (heroTime) {
    var tickHero = function () {
      var now = new Date();
      var hh = now.getHours();
      var suffix = hh >= 12 ? "PM" : "AM";
      hh = hh % 12 || 12;
      heroTime.textContent = String(hh).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0") + " " + suffix;
    };
    tickHero();
    window.setInterval(tickHero, 1000);
  }
})();

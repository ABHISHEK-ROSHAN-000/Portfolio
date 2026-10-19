/* Portfolio interactions — vanilla JS. No frameworks, no third parties. */
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

  /* Page transition — Pixel Dissolve (cyan + ink, random stagger).
     Cover is solid ink pre-JS (inline head style); JS swaps in the grid at
     full cover, pops cells out to reveal, and reverses on link clicks. */
  var pix = document.querySelector(".pix");
  /* Desktop: 16×10. Phones (<640px): 8 columns, rows derived from the
     viewport aspect so cells stay square on tall screens. */
  function pixDims() {
    if (window.innerWidth < 640) {
      var c = 8;
      var vw = window.innerWidth || 1;
      var vh = window.innerHeight || 1;
      return { c: c, r: Math.max(1, Math.round(c * vh / vw)) };
    }
    return { c: 16, r: 10 };
  }
  /* Fixed-seed PRNG so every build yields the IDENTICAL mosaic on every page.
     Only the dissolve stagger stays random (motion, not layout). Must match
     the inline bootstrap script in each HTML shell. */
  function seededRand(seed) {
    var s = seed;
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* Snap cells to whole device pixels so neighbors tile edge-to-edge
     with zero overlap and zero seam at any DPR (100%/125%/150%). The grid
     is rounded up to always cover the viewport; .pix clips the excess. */
  function applyPixGrid() {
    if (!pix) return;
    var dims = pixDims();
    var dpr = window.devicePixelRatio || 1;
    var r = pix.getBoundingClientRect();
    var w = r.width || window.innerWidth;
    var h = r.height || window.innerHeight;
    var cw = Math.ceil(w * dpr / dims.c) / dpr;
    var ch = Math.ceil(h * dpr / dims.r) / dpr;
    pix.style.gridTemplateColumns = "repeat(" + dims.c + ", " + cw + "px)";
    pix.style.gridTemplateRows = "repeat(" + dims.r + ", " + ch + "px)";
  }
  function buildPix() {
    if (!pix) return [];
    pix.innerHTML = "";
    applyPixGrid();
    var dims = pixDims();
    var rand = seededRand(1337);
    var cells = [];
    for (var i = 0; i < dims.c * dims.r; i++) {
      var d = document.createElement("div");
      if (rand() < 0.35) d.className = "alt";
      d.style.transform = "scale(0)";
      pix.appendChild(d);
      cells.push(d);
    }
    return cells;
  }
  function pixOut(cells) {
    return cells.map(function (c) {
      try {
        return c.animate(
          [{ transform: "scale(1)" }, { transform: "scale(0)" }],
          { duration: 260, easing: "cubic-bezier(.22,1,.36,1)", delay: Math.random() * 420, fill: "forwards" }
        ).finished.catch(function () {});
      } catch (e) { c.style.transform = "scale(0)"; return Promise.resolve(); }
    });
  }
  function pixIn(cells) {
    return cells.map(function (c) {
      try {
        return c.animate(
          [{ transform: "scale(0)" }, { transform: "scale(1)" }],
          { duration: 280, easing: "cubic-bezier(.22,1,.36,1)", delay: Math.random() * 480, fill: "forwards" }
        ).finished.catch(function () {});
      } catch (e) { c.style.transform = "scale(1)"; return Promise.resolve(); }
    });
  }
  var pixFailsafe = null;
  if (pix) {
    /* Freeze hidden: a bfcache Back/Forward restore must never show
       a stuck mid-exit mosaic — fresh loads rebuild the veil anyway. */
    window.addEventListener("pagehide", function () {
      pix.classList.remove("on");
      pix.classList.add("pix-done");
    });
    if (reduceMotion) {
      pix.classList.add("pix-done");
    } else {
      /* Inline bootstrap script already painted the identical mosaic
         pre-paint — reuse it so the pattern never reshuffles. */
      var enterCells = pix.children.length
        ? Array.prototype.slice.call(pix.children)
        : buildPix();
      applyPixGrid();
      enterCells.forEach(function (c) { c.style.transform = "scale(1)"; });
      pix.style.background = "transparent";
      pix.classList.add("on");
      try {
        Promise.all(pixOut(enterCells)).then(function () { pix.classList.add("pix-done"); });
      } catch (e) { pix.classList.add("pix-done"); }
      /* Failsafe: healthy reveal finishes ~1s, so a cover alive at 2.5s is stuck */
      pixFailsafe = window.setTimeout(function () { pix.classList.add("pix-done"); }, 2500);
      window.__clearPixFailsafe = function () { window.clearTimeout(pixFailsafe); };
    }
  }
  if (pix && !reduceMotion) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (link) {
      var href = link.getAttribute("href") || "";
      var internal = href.charAt(0) !== "#" && !/^[a-z]+:/i.test(href) && !link.hasAttribute("target");
      if (!internal) return;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.__clearPixFailsafe) window.__clearPixFailsafe();
        var cells = buildPix();
        pix.classList.remove("pix-done");
        pix.style.background = "transparent";
        pix.classList.add("on");
        try { Promise.all(pixIn(cells)).catch(function () {}); }
        catch (err) {}
        window.setTimeout(function () { window.location.href = link.href; }, 820);
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
  /* Tap outside the sheet closes it (sheet no longer covers the screen) */
  document.addEventListener("click", function (e) {
    if (!menu.classList.contains("open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setMenu(false);
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

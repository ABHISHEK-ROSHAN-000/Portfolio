/* Work detail renderer — fills the detail template from ?slug= using shared project data. */
import { projects, thumbSrc, galleryThumbs } from "./projects.js";

(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  var idx = projects.findIndex(function (p) { return p.slug === slug; });
  if (idx === -1) idx = 0;

  var project = projects[idx];

  document.title = project.title + " — Abhishek Roshan";

  var titleEl = document.getElementById("detail-title");
  var taglineEl = document.getElementById("detail-tagline");
  var imgEl = document.getElementById("detail-image");
  var clientEl = document.getElementById("detail-client");
  var serviceEl = document.getElementById("detail-service");
  var dateEl = document.getElementById("detail-date");
  var liveEl = document.getElementById("detail-live");
  var overviewEl = document.getElementById("detail-overview");
  var challengeEl = document.getElementById("detail-challenge");
  var solutionEl = document.getElementById("detail-solution");
  var moreEl = document.getElementById("detail-more");

  if (titleEl) titleEl.textContent = project.title;
  if (taglineEl) taglineEl.textContent = project.tagline;
  if (imgEl) {
    imgEl.setAttribute("src", project.heroImage || thumbSrc(project));
    imgEl.setAttribute("alt", project.title + " — " + project.category);
    imgEl.onerror = function () {
      imgEl.onerror = null;
      imgEl.setAttribute("src", thumbSrc(project));
    };
  }
  if (clientEl) clientEl.textContent = project.client;
  if (serviceEl) serviceEl.textContent = project.category;
  if (dateEl) dateEl.textContent = project.date;
  if (liveEl) {
    if (project.liveUrl) liveEl.setAttribute("href", project.liveUrl);
    else liveEl.style.display = "none";
  }
  if (overviewEl) overviewEl.textContent = project.overview;
  if (challengeEl) challengeEl.textContent = project.challenge;
  if (solutionEl) solutionEl.textContent = project.solution;
  var galleryEl = document.getElementById("detail-gallery");
  if (galleryEl) {
    var fallbacks = galleryThumbs(project);
    var sources = project.galleryImages && project.galleryImages.length
      ? project.galleryImages
      : fallbacks.map(function (t) { return t.src; });
    sources.slice(0, 4).forEach(function (src, i) {
      var fig = document.createElement("figure");
      fig.className = "g-item";
      var im = document.createElement("img");
      im.setAttribute("src", src);
      im.setAttribute("alt", project.title + " — screenshot " + (i + 1));
      im.setAttribute("loading", "lazy");
      im.onerror = (function (n) {
        return function () {
          im.onerror = null;
          im.setAttribute("src", fallbacks[n].src);
        };
      })(i);
      fig.appendChild(im);
      galleryEl.appendChild(fig);
    });
  }
  var moreEl = document.getElementById("detail-more");
  if (moreEl) {
    for (var k = 1; k <= 3; k++) {
      var q = projects[(idx + k) % projects.length];
      var a = document.createElement("a");
      a.className = "card";
      a.setAttribute("href", "./work-detail.html?slug=" + q.slug);
      var media = document.createElement("span");
      media.className = "card-media";
      var im = document.createElement("img");
      im.setAttribute("src", q.heroImage || thumbSrc(q));
      im.setAttribute("alt", q.title);
      im.setAttribute("loading", "lazy");
      im.onerror = (function (qq, el) {
        return function () {
          el.onerror = null;
          el.setAttribute("src", thumbSrc(qq));
        };
      })(q, im);
      media.appendChild(im);
      var meta = document.createElement("span");
      meta.className = "card-meta";
      var t = document.createElement("span");
      t.className = "work-title";
      t.textContent = q.title;
      var c = document.createElement("span");
      c.className = "work-cat";
      c.textContent = q.category;
      meta.appendChild(t);
      meta.appendChild(c);
      a.appendChild(media);
      a.appendChild(meta);
      moreEl.appendChild(a);
    }
  }
})();

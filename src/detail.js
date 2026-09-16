/* Work detail renderer — fills the detail template from ?slug= using shared project data. */
import { projects, thumbSrc } from "./projects.js";

(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  var idx = projects.findIndex(function (p) { return p.slug === slug; });
  if (idx === -1) idx = 0;

  var project = projects[idx];
  var next = projects[(idx + 1) % projects.length];

  document.title = project.title + " — Abhishek Roshan";

  var titleEl = document.getElementById("detail-title");
  var catEl = document.getElementById("detail-category");
  var imgEl = document.getElementById("detail-image");
  var descEl = document.getElementById("detail-description");
  var nextEl = document.getElementById("detail-next");

  if (titleEl) titleEl.textContent = project.title;
  if (catEl) catEl.textContent = project.category;
  if (imgEl) {
    imgEl.setAttribute("src", thumbSrc(project));
    imgEl.setAttribute("alt", project.title + " — " + project.category);
  }
  if (descEl) descEl.textContent = project.description;
  if (nextEl) nextEl.setAttribute("href", "./work-detail.html?slug=" + next.slug);
})();

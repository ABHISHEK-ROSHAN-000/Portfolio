/* Work index counter — renders the live project count next to the WORK title. */
import { projects } from "./projects.js";

var el = document.getElementById("work-count");
if (el) el.textContent = String(projects.length);

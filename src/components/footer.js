/* Shared footer component — single source rendered on every page.
   Mirrors the component pattern: edit here once, ships everywhere. */
export var footerHTML = `
  <footer class="section footer">
    <div class="wrap wrap--center">
      <p class="lede lede--center" data-reveal>Have an upcoming project, redesign, or custom web build? Let’s schedule a quick 15-minute intro call to discuss your project scope, timeline, and goals.</p>
      <div data-reveal>
        <a class="dot-link" href="./contact.html"><span class="dot-solid" aria-hidden="true"></span><span>Get in Touch</span></a>
      </div>
      <div class="footer-media" data-reveal aria-hidden="true">
        <div class="gallery-track">
          <div class="gallery-card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23161616'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='%232b2b2b' text-anchor='middle' dominant-baseline='middle'%3ER%3C/text%3E%3C/svg%3E" width="1200" height="900" alt="Reviso" loading="lazy"></div>
          <div class="gallery-card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23181818'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='%232e2e2e' text-anchor='middle' dominant-baseline='middle'%3EM%3C/text%3E%3C/svg%3E" width="1200" height="900" alt="Monkey Mind" loading="lazy"></div>
          <div class="gallery-card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23141414'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='%23292929' text-anchor='middle' dominant-baseline='middle'%3EP%3C/text%3E%3C/svg%3E" width="1200" height="900" alt="PawsHome" loading="lazy"></div>
          <div class="gallery-card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23171717'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='%232d2d2d' text-anchor='middle' dominant-baseline='middle'%3EA%3C/text%3E%3C/svg%3E" width="1200" height="900" alt="inA" loading="lazy"></div>
          <div class="gallery-card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23151515'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='%232a2a2a' text-anchor='middle' dominant-baseline='middle'%3EC%3C/text%3E%3C/svg%3E" width="1200" height="900" alt="Coming Soon" loading="lazy"></div>
          <div class="gallery-card"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23191919'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='%23303030' text-anchor='middle' dominant-baseline='middle'%3EC%3C/text%3E%3C/svg%3E" width="1200" height="900" alt="Coming Soon" loading="lazy"></div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="fineprint">© 2026 Abhishek Roshan</p>
        <div class="footer-socials">
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Linkedin</a>
          <span class="dot" aria-hidden="true"></span>
          <a href="https://x.com/" target="_blank" rel="noreferrer">X</a>
          <span class="dot" aria-hidden="true"></span>
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p class="fineprint clock"><span id="local-time">--:--:--</span><span class="clock-label" id="tz-name">Local</span></p>
      </div>
    </div>
  </footer>
`;

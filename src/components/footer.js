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
          <div class="gallery-card"><img src="images/reviso/main.webp" width="1200" height="900" alt="Reviso" loading="lazy"></div>
          <div class="gallery-card"><img src="images/monkey-mind/main.webp" width="1200" height="900" alt="Monkey Mind" loading="lazy"></div>
          <div class="gallery-card"><img src="images/pawshome/main.webp" width="1200" height="900" alt="PawsHome" loading="lazy"></div>
          <div class="gallery-card"><img src="images/ina/main.webp" width="1200" height="900" alt="inA" loading="lazy"></div>
          <div class="gallery-card"><img src="images/coming-soon-client/main.webp" width="1200" height="900" alt="Coming Soon" loading="lazy"></div>
          <div class="gallery-card"><img src="images/coming-soon-web/main.webp" width="1200" height="900" alt="Coming Soon" loading="lazy"></div>
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

import { defineConfig } from "vite";

// Relative base so the built site works on GitHub Pages
// both as a user site (<user>.github.io) and as a project site
// (<user>.github.io/<repo>).
export default defineConfig({
  base: "./",
  build: {
    // Inline sub-8kB assets: the 4.4 kB Flux pixel face rides inside the
    // render-blocking CSS (zero extra request, no hashed-preload rot).
    // Larger fonts/images stay as files.
    assetsInlineLimit: 8192,
    rollupOptions: {
      input: {
        main: "index.html",
        work: "work.html",
        about: "about.html",
        contact: "contact.html",
        detail: "work-detail.html",
        notfound: "404.html",
      },
    },
  },
});

import { defineConfig } from "vite";

// Relative base so the built site works on GitHub Pages
// both as a user site (<user>.github.io) and as a project site
// (<user>.github.io/<repo>).
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        work: "work.html",
        contact: "contact.html",
        detail: "work-detail.html",
        notfound: "404.html",
      },
    },
  },
});

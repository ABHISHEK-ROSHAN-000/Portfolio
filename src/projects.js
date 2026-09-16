/* Shared project data — replace with your own projects.
   thumbs reuse the letter-mark placeholders until real images are supplied. */
export var projects = [
  {
    slug: "lovel",
    title: "LOVEL",
    category: "Website Design",
    initial: "L",
    bg: "%23161616",
    fg: "%232b2b2b",
    description:
      "A conversion-focused marketing site with an editorial layout system, CMS-driven case studies, and performance budgets enforced at build time.",
  },
  {
    slug: "soni",
    title: "SONI",
    category: "Framer Development",
    initial: "S",
    bg: "%23181818",
    fg: "%232e2e2e",
    description:
      "A Framer build with scroll-driven storytelling, reusable override components, and a content model editors can run without developer help.",
  },
  {
    slug: "pine-valley",
    title: "Pine Valley",
    category: "Speed & SEO",
    initial: "P",
    bg: "%23141414",
    fg: "%23292929",
    description:
      "A rebuild targeting Core Web Vitals and structured data — faster loads, cleaner semantics, and measurable organic-search gains.",
  },
  {
    slug: "kyrosai",
    title: "KyrosAI",
    category: "CMS Architecture",
    initial: "K",
    bg: "%23171717",
    fg: "%232d2d2d",
    description:
      "A modular CMS architecture with typed collections, preview environments, and editorial workflows for a growing marketing team.",
  },
  {
    slug: "delane",
    title: "DELANE",
    category: "Framer Development",
    initial: "D",
    bg: "%23151515",
    fg: "%232a2a2a",
    description:
      "A Framer site with a custom design system, motion language, and breakpoints tuned for a fashion-forward audience.",
  },
  {
    slug: "noiri",
    title: "NOIRI",
    category: "Website Design",
    initial: "N",
    bg: "%23191919",
    fg: "%23303030",
    description:
      "A minimal portfolio-style marketing site with oversized type, generous whitespace, and subtle scroll reveals.",
  },
];

export function thumbSrc(p) {
  return (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='" +
    p.bg +
    "'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='" +
    p.fg +
    "' text-anchor='middle' dominant-baseline='middle'%3E" +
    p.initial +
    "%3C/text%3E%3C/svg%3E"
  );
}

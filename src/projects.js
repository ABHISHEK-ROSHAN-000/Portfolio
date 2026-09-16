/* Shared project data — Abhishek Roshan's portfolio projects. */
export var projects = [
  {
    slug: "reviso",
    title: "Reviso",
    category: "App & Website",
    initial: "R",
    bg: "%23161616",
    fg: "%232b2b2b",
    description:
      "AI flashcard app that turns notes and textbook photos into smart decks with spaced repetition — live on Google Play, with its marketing site that I also built and manage as founder and solo developer.",
  },
  {
    slug: "monkey-mind",
    title: "Monkey Mind",
    category: "Website Development",
    initial: "M",
    bg: "%23181818",
    fg: "%232e2e2e",
    description:
      "Full responsive website for a design studio with Firebase CMS integration, built with Vite and Cloudinary media.",
  },
  {
    slug: "pawshome",
    title: "PawsHome",
    category: "Website Design",
    initial: "P",
    bg: "%23141414",
    fg: "%23292929",
    description:
      "Pet adoption website concept for an NGO, designed and built as an internship task.",
  },
  {
    slug: "ina",
    title: "inA",
    category: "Website Development",
    initial: "A",
    bg: "%23171717",
    fg: "%232d2d2d",
    description:
      "Website built for an NGO as an internship task, fully responsive.",
  },
  {
    slug: "coming-soon-client",
    title: "Coming Soon",
    category: "Client Project",
    initial: "C",
    bg: "%23151515",
    fg: "%232a2a2a",
    description:
      "A new client project — details coming soon.",
  },
  {
    slug: "coming-soon-web",
    title: "Coming Soon",
    category: "Web Project",
    initial: "C",
    bg: "%23191919",
    fg: "%23303030",
    description:
      "A new web project — details coming soon.",
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

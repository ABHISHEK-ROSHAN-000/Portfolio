/* Shared project data — Abhishek Roshan's portfolio projects. */
export var projects = [
  {
    slug: "reviso",
    title: "Reviso",
    category: "App & Website",
    initial: "R",
    bg: "%23161616",
    fg: "%232b2b2b",
    tagline:
      "An AI study companion that turns notes and textbook photos into smart flashcards with spaced repetition.",
    client: "Reviso (own product)",
    date: "Jun 12, 2026",
    liveUrl: "https://play.google.com/store/apps/details?id=com.reviso.app",
    overview:
      "The goal of Reviso was to turn everyday study material — handwritten notes, textbook photos, and slides — into smart AI flashcards that students actually stick with. I built the full loop as founder and solo developer: AI deck generation, daily reviews with analytics, and the marketing site that explains it.",
    challenge:
      "Balancing heavy AI features with a fast, offline-friendly review experience was the hard part. Generation needs the cloud, but daily studying has to feel instant — even on low-end phones with no connection.",
    solution:
      "I split the app cleanly: AI generation online, FSRS-spaced reviews and progress fully offline and local. Daily free credits keep studying free, and lightweight screens keep the app fast across all devices.",
  },
  {
    slug: "monkey-mind",
    title: "Monkey Mind",
    category: "Website Development",
    initial: "M",
    bg: "%23181818",
    fg: "%232e2e2e",
    tagline:
      "A full responsive website for a boutique design studio, pairing clean layouts with seamless CMS editing.",
    client: "Monkey Mind Studio",
    date: "Mar 08, 2026",
    liveUrl: null,
    overview:
      "The goal was a full responsive website for a design studio that the team could update themselves. I built the complete site with Vite and wired a Firebase CMS behind it, with Cloudinary handling media.",
    challenge:
      "The challenge was giving non-technical editors full control without breaking the design — structured content, safe image handling, and layouts that hold up on every screen size.",
    solution:
      "A typed Firebase content model with preview-friendly editing and responsive templates. The studio ships updates on its own while the site stays fast and consistent.",
  },
  {
    slug: "pawshome",
    title: "PawsHome",
    category: "Website Design",
    initial: "P",
    bg: "%23141414",
    fg: "%23292929",
    tagline:
      "A warm adoption experience pairing friendly layouts with simple, clear browsing.",
    client: "NGO (internship)",
    date: "Jan 20, 2026",
    liveUrl: "https://abhishek-roshan-000.github.io/PawsHome-Task3/",
    overview:
      "A warm pet-adoption website concept for an NGO, designed and built as an internship task — simple browsing that helps visitors meet adoptable pets fast.",
    challenge:
      "Keeping it friendly and clear on small screens with limited content: every listing had to be scannable in seconds without heavy pages.",
    solution:
      "A lightweight, fully responsive build with clear pet cards and simple navigation — easy to extend with real listings later.",
  },
  {
    slug: "ina",
    title: "inA",
    category: "Website Development",
    initial: "A",
    bg: "%23171717",
    fg: "%232d2d2d",
    tagline:
      "A clear, accessible website pairing calm layouts with straightforward information.",
    client: "NGO (internship)",
    date: "Feb 14, 2026",
    liveUrl: "https://abhishek-roshan-000.github.io/inA/",
    overview:
      "A clear, accessible website for an NGO, built as an internship task — calm layouts that present the organization's work straightforwardly.",
    challenge:
      "Presenting a lot of information without overwhelming visitors, while keeping every page fast and readable on mobile.",
    solution:
      "A minimal responsive structure with strong hierarchy — content stays scannable and the site loads quickly on any connection.",
  },
  {
    slug: "coming-soon-client",
    title: "Coming Soon",
    category: "Client Project",
    initial: "C",
    bg: "%23151515",
    fg: "%232a2a2a",
    tagline:
      "A new client project — details coming soon.",
    client: "To be announced",
    date: "2026",
    liveUrl: null,
    overview:
      "A new client project — full case study coming soon.",
    challenge:
      "Details coming soon.",
    solution:
      "Details coming soon.",
  },
  {
    slug: "coming-soon-web",
    title: "Coming Soon",
    category: "Web Project",
    initial: "C",
    bg: "%23191919",
    fg: "%23303030",
    tagline:
      "A new web project — details coming soon.",
    client: "To be announced",
    date: "2026",
    liveUrl: null,
    overview:
      "A new web project — full case study coming soon.",
    challenge:
      "Details coming soon.",
    solution:
      "Details coming soon.",
  },
];

/* Builds 4 placeholder gallery tiles per project by shifting its shades. */
function shiftHex(hex, amt) {
  var n = parseInt(hex.slice(1), 16);
  var r = Math.min(255, Math.max(0, (n >> 16) + amt));
  var g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  var b = Math.min(255, Math.max(0, (n & 255) + amt));
  var s = ((r << 16) | (g << 8) | b).toString(16);
  while (s.length < 6) s = "0" + s;
  return "%23" + s;
}

export function galleryThumbs(p) {
  var base = decodeURIComponent(p.bg);
  var face = decodeURIComponent(p.fg);
  var variants = [
    [p.bg, p.fg],
    [shiftHex(base, -14), p.fg],
    [shiftHex(base, 14), p.fg],
    [p.fg, p.bg],
  ];
  return variants.map(function (v, i) {
    return {
      src:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='" +
        v[0] +
        "'/%3E%3Ctext x='50%25' y='52%25' font-family='Arial,sans-serif' font-size='150' font-weight='900' fill='" +
        v[1] +
        "' text-anchor='middle' dominant-baseline='middle'%3E" +
        p.initial +
        "%3C/text%3E%3C/svg%3E",
      alt: p.title + " — screenshot " + (i + 1),
    };
  });
}

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

import type { Project, ProjectBlock } from "./projects";

const media = (name: string) => `/media/projects/${name.includes(".") ? name : `${name}.webp`}`;
const writing = (slug: string, title: string, year: string, shortLabel: string, summary: string, image: string, alt: string, artwork?: "contain"): Project => ({
  slug, title, year, shortLabel, summary, statement: summary, category: "Prose",
  thumbnail: media(image), hero: media(image), heroAlt: alt, artwork,
  roles: [shortLabel === "Poetry" ? "Poet" : "Writer"], tools: [shortLabel], featured: true, blocks: [],
});
const text = (label: string, body: string, heading?: string): ProjectBlock => ({ type: "text", label, body, heading });
const list = (label: string, items: string[]): ProjectBlock => ({ type: "list", label, items });

/** Follows the supplied image/project groupings in Hello!.pdf. */
export const portfolioProjects: Project[] = [
  {
    ...writing("the-metal-in-i", "the metal in i", "2026", "Poetry", "A poetry collection accepted to Northwestern’s Poetry Major and Poetry Sequence.", "the-metal-in-i", "An eye framed by dark hair"),
    thumbnail: media("the-metal-in-i-v2.png"),
    hero: media("the-metal-in-i-v2.png"),
    transitionStyle: "landscape",
    heroAlt: "The metal in i cover featuring a close-up eye, dark hair, and small type on black",
    heroAspectRatio: 16 / 9,
    statementKicker: "A poetry collection",
    statementLead: "accepted to Northwestern’s",
    statement: "Poetry Major and Poetry Sequence.",
    blocks: [{ type: "manuscript", id: "the-metal-in-i" }, { type: "download", label: "Read the original poetry collection", href: "/documents/the-metal-in-i.pdf", detail: "PDF · 8 pages" }],
  },
  {
    ...writing("two-is-greater-than-one", "Two is greater than one", "2026", "Nonfiction", "Creative nonfiction by Victoria Yi, completed for English 208-0 in March 2026.", "two-is-greater-than-one", "Two open pizza boxes beside the water at night under a full moon"),
    hero: media("two-is-greater-than-one-transition-landscape.png"),
    transitionArtwork: media("two-is-greater-than-one-transition-landscape.png"),
    transitionStyle: "landscape",
    heroAspectRatio: 16 / 9,
    blocks: [{ type: "manuscript", id: "two-is-greater-than-one" }],
  },
  {
    ...writing("hamartia", "Hamartia", "2024", "Fiction", "Published in Navigating the Margins: A Collection of Stories by High School Students.", "hamartia", "The blue and yellow cover of Navigating the Margins, curated by Ella Heiliger", "contain"),
    thumbnail: media("hamartia-v2.png"),
    hero: media("hamartia-transition-landscape.png"),
    transitionArtwork: media("hamartia-transition-landscape.png"),
    transitionStyle: "landscape",
    heroAlt: "Hamartia cover featuring a full moon over dark ocean waves",
    heroAspectRatio: 16 / 9,
    artwork: undefined,
    blocks: [{ type: "manuscript", id: "hamartia" }],
  },
  {
    ...writing("cinnamon-and-stars", "Cinnamon and Stars", "2023", "Memoir", "A short memoir of my grandmother’s visit to Budapest in 1968. At the time, she lived in the Soviet Union.", "scholastic-awards", "Scholastic Art & Writing Awards centennial logo", "contain"),
    thumbnail: media("cinnamon-and-stars-v3.png"),
    hero: media("cinnamon-and-stars-v3.png"),
    transitionArtwork: media("cinnamon-and-stars-v3.png"),
    transitionStyle: "landscape",
    frameBackground: "#b2a088",
    heroAlt: "Charcoal artwork of a face emerging from darkness beneath scattered white stars",
    heroAspectRatio: 1654 / 951,
    artwork: undefined,
    statementKicker: "2023 Gold Key",
    statementLead: "Scholastic Art & Writing Awards",
    statement: "Personal Essay\n& Memoir",
    blocks: [
      { type: "image", src: media("cinnamon-certificate"), alt: "2023 Scholastic Gold Key certificate awarded to Victoria Yi for Cinnamon and Stars", size: "narrow", caption: "Baltimore Office of Promotion & the Arts · Scholastic Art & Writing Awards" },
      text("MEMOIR", "A short memoir of my grandmother’s visit to Budapest in 1968. At the time, she lived in the Soviet Union."),
      { type: "manuscript", id: "cinnamon-and-stars" },
      { type: "download", label: "Read the original memoir", href: "/documents/cinnamon-and-stars.pdf", detail: "PDF · 4 pages" },
    ],
  },
  {
    slug: "grain-boundary-segregation", title: "Experimental Measurements of Grain Boundary Segregation in Binary Alloys", tileTitle: "Grain Boundary Segregation", year: "PRESENT", category: "Research", shortLabel: "Research",
    summary: "Helen Ann Burgarella Research Fellowship recipient, Summer 2025. Experimental research on grain boundary segregation in nanocrystalline Cu-Au alloys.",
    statement: "Helen Ann Burgarella Research Fellowship recipient · Summer 2025.",
    thumbnail: media("grain-boundary-title-v4.png"), hero: media("grain-boundary-segregation-transition-landscape.png"), heroAlt: "Northwestern Engineering title image with a gloved hand holding a vial of metallic alloy particles",
    transitionArtwork: media("grain-boundary-segregation-transition-landscape.png"),
    transitionStyle: "landscape",
    heroAspectRatio: 16 / 9,
    imagePosition: "top",
    roles: ["Research fellow"], tools: ["High-energy ball-milling", "Thermal annealing", "X-ray diffraction"], featured: true,
    blocks: [
      list("RESEARCH", [
        "Fabricated nanocrystalline Cu-Au alloys via high-energy ball-milling and controlled thermal annealing to study equilibrium segregation.",
        "Performed x-ray diffraction to measure lattice parameters and grain size, and analyze structural evolution in binary alloy systems.",
        "Calculated grain boundary compositions, creating a high-volume experimental dataset for model validation.",
        "Developing predictive models for nanocrystalline stability to improve properties like thermal resilience and corrosion resistance.",
      ]),
      { type: "externalLink", label: "Read the whole proposal here", href: "/documents/grain-boundary-segregation-proposal.pdf" },
    ],
  },
  {
    slug: "gamma-ray-spectrometer", title: "Gamma Ray Spectrometer with Low Cost Hardware", tileTitle: "Gamma Ray Spectrometer", year: "2023", category: "Research", shortLabel: "Research",
    summary: "ASPIRE internship in Applied Physics (AOS/QLC) at the Johns Hopkins University Applied Physics Laboratory, Summer 2023.",
    statement: "A fully functional, highly portable gamma ray spectrometer built from hardware costing less than $300.",
    thumbnail: media("gamma-ray-circuit-v4.png"), hero: media("gamma-ray-poster"), heroAlt: "Full Gamma Ray Spectrometer with Low Cost Hardware research poster by Victoria Yi", heroAspectRatio: 2048 / 1484, artwork: undefined,
    roles: ["ASPIRE intern"], tools: ["C", "Python", "Scintillation detection", "Instrument calibration"], featured: true,
    blocks: [
      text("ASPIRE", "Johns Hopkins University Applied Physics Laboratory · Summer 2023", "Applied Physics (AOS/QLC)"),
      list("PROJECT", ["Constructed a fully functional, highly portable gamma ray spectrometer out of low-cost (<$300) hardware.", "Programmed in C and Python for the spectrometer to run scintillation detection and instrument calibration."]),
      { type: "poster", src: media("gamma-ray-poster"), alt: "Gamma Ray Spectrometer with Low Cost Hardware research poster by Victoria Yi", caption: "Research poster · JHU APL · ASPIRE" },
    ],
  },
  {
    slug: "seap-celestial-navigation", title: "SEAP: The Protractor, the Sextant, and the Student", tileTitle: "SEAP & Celestial Navigation", year: "2022–2023", category: "Research", shortLabel: "Research",
    summary: "Science & Engineering Apprenticeship Program at the Naval Academy in Summer 2022, followed by an iPoster at the American Astronomical Society’s 241st Meeting in January 2023.",
    statement: "Building a sextant from common materials and testing its accuracy through celestial navigation.",
    thumbnail: media("seap-measurement-v8.png"), hero: media("sextant-poster"), heroAlt: "Full Protractor, Sextant, and Student research poster by Victoria Yi and Jennifer Bartlett", heroAspectRatio: 2048 / 1118,
    roles: ["SEAP apprentice", "iPoster presenter"], collaborators: ["Prof. Murray Korman", "Dr. Jennifer Bartlett"], tools: ["Celestial navigation", "Environmental sensing"], featured: true,
    blocks: [
      text("SEAP", "Naval Academy · Summer 2022 · 40 hours per week for 8 weeks, with Prof. Murray Korman and Kinear Chair Jennifer Bartlett.", "Science & Engineering Apprenticeship Program"),
      list("PROJECTS", ["Built a makeshift sextant for less than $5 and studied its precision by calculating my coordinates.", "Created an environment sensor/logger for the US Coast Guard Academy’s library.", "Studied laser refraction, captured images of celestial objects, and created educational astronomy games for the Fairfax County Fair in Virginia."]),
      text("PRESENTATION", "Presented as an iPoster at the American Astronomical Society’s 241st Meeting on January 9, 2023. I created an abstract and an iPoster, mentored by Dr. Jennifer Bartlett.", "The Protractor, the Sextant, and the Student"),
      list("METHOD", ["Built a sextant out of common materials and tested its accuracy by using celestial navigation principles to find my apparent latitude and longitude.", "Found local apparent noon, measured the sun’s zenith distance, used the 2022 Nautical Almanac, calculated GHA, and compared coordinates with percent error."]),
      { type: "poster", src: media("sextant-poster"), alt: "The Protractor, the Sextant, and the Student iPoster by Victoria Yi and Jennifer Bartlett", caption: "American Astronomical Society · 241st Meeting · January 9, 2023" },
      { type: "externalLink", label: "Read the abstract", href: "https://ui.adsabs.harvard.edu/abs/2023AAS...24117006Y/abstract" },
      { type: "externalLink", label: "Explore the interactive iPoster", href: "https://aas241-aas.ipostersessions.com/Default.aspx?s=3B-D2-4E-B6-4F-C4-B7-64-F0-F1-C0-A7-05-50-C5-A6" },
      { type: "credits", items: [{ label: "Citation", value: "American Astronomical Society Meeting #241, id. 170.06. Bulletin of the American Astronomical Society, Vol. 55, No. 2, e-id 2023n2i170p06." }] },
    ],
  },
  ...([
    { slug: "three-dancers-one-song", cover: "three-dancers-one-song-video-thumbnail-clean.png", poster: "three-dancers-one-song-video-thumbnail-clean.png", posterFit: "contain" as const, title: "3 dancers choreograph to 1 song", subtitle: "stateside — zara larsson", year: "2026", season: "Winter 2026", role: "Director", id: "jVokSCVe2lY" },
    { slug: "who-knows-me-better", showYouTubeButton: false, cover: "who-knows-me-better-v2.png", poster: "who-knows-me-better-video-thumbnail-clean.png", posterFit: "contain" as const, title: "who knows me better?", subtitle: "best friend vs. partner", year: "2026", season: "Spring 2026", role: "Director", id: "q8e9ToSsuqk" },
    { slug: "guess-the-major", showYouTubeButton: false, cover: "guess-the-major-v2.png", poster: "guess-the-major-video-thumbnail-clean.png", posterFit: "contain" as const, title: "guess the major by their backpack", year: "2026", season: "Winter 2026", role: "Concept & pitch", id: "i5PezNPFKEE" },
    { slug: "match-the-college-couple", showYouTubeButton: false, cover: "match-the-college-couple-v2.png", poster: "match-the-college-couple-video-thumbnail-clean.png", posterFit: "contain" as const, title: "match the college couple", year: "2025", season: "Fall 2025", role: "Associate producer", id: "OmJ17rXjXpE" },
    { slug: "my-instax-and-i", cover: "my-instax-and-i-v2.png", poster: "my-instax-and-i-v2.png", posterFit: undefined, title: "my instax & I", subtitle: "Tech-Artifact Presentation", year: "", season: "Student project", role: "Solo creator", id: "QDvbTi1afIc" },
  ]).map((film): Project => {
    const cover = media(film.cover);
    return ({
    slug: film.slug, title: film.title, subtitle: film.subtitle, year: film.year, category: "Video", shortLabel: "Video",
    summary: film.role === "Solo creator" ? "A solo student project by Victoria Yi." : `${film.role} · reel8 productions · ${film.season}`,
    statement: film.role === "Solo creator" ? "A solo-created student film." : `${film.role} · reel8 productions · ${film.season}`,
    thumbnail: cover, hero: cover,
    heroAlt: `Video thumbnail for ${film.title}`,
    roles: [film.role], tools: ["Video"], featured: true, externalUrl: `https://www.youtube.com/watch?v=${film.id}`,
    blocks: [
      { type: "youtube", id: film.id, title: [film.title, film.subtitle].filter(Boolean).join(" — "), poster: media(film.poster), posterFit: film.posterFit, showYouTubeButton: film.showYouTubeButton },
      { type: "credits", items: [{ label: "Victoria Yi", value: film.role }, { label: "Production", value: film.role === "Solo creator" ? "Solo student project" : "reel8 productions" }, ...(film.year ? [{ label: "Season", value: film.season }] : [])] },
      { type: "externalLink", label: "Watch on YouTube", href: `https://www.youtube.com/watch?v=${film.id}` },
    ],
    });
  }),
];

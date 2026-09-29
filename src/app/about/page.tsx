import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, a Manufacturing and Design Engineering student at Northwestern University working across research, writing, and film.`,
  alternates: { canonical: "/about" },
};

const practices = [
  ["01.", "Engineering & research", "I study how materials and technical systems behave—from grain-boundary segregation in nanocrystalline Cu–Au alloys to low-cost radiation detection and celestial-navigation tools."],
  ["02.", "Writing", "I write poetry, fiction, and nonfiction rooted in lived experience. My work includes a Scholastic Gold Key memoir, a published short story, and a poetry collection accepted to Northwestern’s Poetry Major and Poetry Sequence."],
  ["03.", "Film & production", "I direct, develop concepts, and produce short-form student work. I care about clear premises, considered framing, and making every creative choice serve the people and story on screen."],
  ["04.", "What I stand for", "Curiosity across disciplines. Rigor without coldness. Clarity without flattening complexity. I want to make work that is useful, human, and memorable."],
] as const;

const experiences = [
  ["2025–PRESENT", "Northwestern University", "Helen Ann Burgarella Research Fellow studying grain-boundary segregation and stability in nanocrystalline Cu–Au alloys."],
  ["2023", "Johns Hopkins APL", "ASPIRE intern; built and programmed a portable gamma-ray spectrometer using less than $300 in hardware."],
  ["2022–2023", "U.S. Naval Academy / AAS", "SEAP apprentice; built a low-cost sextant, tested it through celestial navigation, and presented the work at the AAS 241st Meeting."],
  ["2025–2026", "reel8 productions", "Director, concept creator, and associate producer across student-led interview, dance, and entertainment formats."],
  ["2023–2026", "Selected writing", "Scholastic Gold Key memoirist, published fiction writer, and Northwestern poetry student."],
] as const;

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Manufacturing and Design Engineering student, researcher, writer, and director",
    affiliation: { "@type": "CollegeOrUniversity", name: "Northwestern University" },
    url: site.siteUrl,
    email: site.email,
    sameAs: [site.links.linkedin],
  };

  return <>
    <main className="about-page" id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="about-hero">
        <div className="about-hero-meta"><span>[ABOUT VICTORIA YI]</span><span>CHICAGO, IL</span></div>
        <h1>
          <span className="about-title-line"><strong>ENGINEER</strong><em>by training,</em></span>
          <span className="about-title-line"><strong>STORYTELLER</strong><em>by instinct.</em></span>
        </h1>
        <div className="about-identity">
          <figure className="about-photo">
            <Image
              src="/media/about-victoria-headshot-foliage-bw.png"
              alt="Victoria Yi smiling in front of a leafy backdrop"
              width={1122}
              height={1402}
              sizes="(max-width: 720px) 76vw, 24vw"
              priority
            />
          </figure>
          <p>I’m Victoria Yi, a multidisciplinary maker working where technical systems and human stories meet.</p>
          <dl>
            <div><dt>University</dt><dd>Northwestern University</dd></div>
            <div><dt>Major</dt><dd>Manufacturing and Design Engineering</dd></div>
            <div><dt>Graduation</dt><dd>2028</dd></div>
          </dl>
        </div>
      </section>

      <section className="about-intro">
        <span>[MY PRACTICE]</span>
        <p>I build tools, study materials, write from lived experience, and direct stories. Across each form, I’m trying to understand complicated things deeply—then make them clear, tangible, and felt.</p>
      </section>

      <div className="practice-sections">
        {practices.map(([number, title, body]) => <section key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></section>)}
      </div>

      <section className="experience">
        <span>[SELECTED EXPERIENCE]</span>
        <div className="experience-heading">
          <h2>Evidence and<br/><em>imagination</em><br/>belong together.</h2>
          <p>My experience crosses laboratories, engineering programs, literary work, and student production teams. The setting changes; the commitment to learning carefully and communicating clearly does not.</p>
        </div>
        <div className="experience-list">
          {experiences.map(([year, title, body]) => <article key={`${year}-${title}`}><span>{year}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <a href={site.links.resume} download>Download résumé ↘</a>
      </section>

      <section className="contact-panel">
        <span>Have a research question, story, or unlikely idea?</span>
        <h2>Let’s make it <em>rigorous, human,</em> and worth remembering.</h2>
        <a href={`mailto:${site.email}`}>Send me a message ↗</a>
        <div><a href={site.links.linkedin}>LinkedIn</a></div>
      </section>
    </main>
    <Footer />
  </>;
}

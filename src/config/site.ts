/** Edit this file first to personalize the entire portfolio. */
export const site = {
  name: "Victoria Yi",
  descriptor: "[Engineer, Researcher, Writer, Director]",
  shortDescriptor: "Engineering, Writing, Film",
  location: "Chicago, IL",
  timeZone: "America/Chicago",
  email: "torihyi@gmail.com",
  siteUrl: "https://victoriayi.com",
  biography:
    "I’m a Manufacturing and Design Engineering student at Northwestern University, Class of 2028, working across research, writing, and film.",
  links: {
    linkedin: "https://www.linkedin.com/in/victoria-yi-0433a9382/",
    resume: "/documents/victoria-yi-resume.pdf",
  },
} as const;

export const primaryNav = [
  { label: "Home,", href: "/" },
  { label: "Research,", href: "/research" },
  { label: "Prose,", href: "/stories" },
  { label: "Video,", href: "/film" },
  { label: "About", href: "/about" },
] as const;

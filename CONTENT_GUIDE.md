# Content editing guide

## Add or reorder a project

All projects live in the `portfolioProjects` array in `src/content/portfolio-data.ts`. Copy an existing project, give it a unique `slug`, update its fields, and place it where you want it to appear. The array order controls the carousel, list view, category views, and “Next project” order. The supporting types and lookup helpers live in `src/content/projects.ts`.

Required fields include `slug`, `title`, `year`, `category`, `summary`, `statement`, `thumbnail`, `hero`, `heroAlt`, `roles`, `featured`, and `blocks`.

## Replace a thumbnail or hero

Place the new file in `public/media/<project-slug>/` or directly in `public/media/`. Then update the project path, for example:

```ts
thumbnail: "/media/my-project/thumbnail.jpg",
hero: "/media/my-project/hero.jpg",
heroAlt: "Specific description of what the image shows",
```

## Add content blocks

Blocks render in array order. Available `type` values are:

- `text` — section label, heading, and body copy.
- `image` — wide or narrow image with optional caption.
- `imagePair` — two editorial images.
- `gallery` — an adaptable image gallery.
- `poster` — uncropped poster with an accessible full-screen viewer and optional PDF.
- `youtube` — click-to-load privacy-enhanced YouTube player.
- `quote` — oversized pull quote.
- `credits` — label/value credits list.
- `download` — downloadable file row.
- `externalLink` — external call-to-action row.
- `list` — a labeled list of research details or project notes.
- `manuscript` — a complete writing work stored in `src/content/manuscripts.json`, or the original-layout poetry pages stored in `src/content/poetry-pages.json`.

## Embed YouTube

Use only the video ID from the YouTube URL:

```ts
{
  type: "youtube",
  id: "aqz-KE-bpKQ",
  title: "Accessible title for the film",
  poster: "/media/my-film/poster.jpg"
}
```

The YouTube iframe is not loaded until Play is pressed and never autoplays with sound before interaction.

## Add a downloadable poster PDF

Put the PDF in `public/documents/`, then reference it from a poster or download block:

```ts
{
  type: "poster",
  src: "/media/my-research/poster.jpg",
  alt: "Full poster for My Research Project",
  pdf: "/documents/my-research-poster.pdf"
}
```

## Change identity and contact details

Edit `src/config/site.ts`. This updates the header, About page, footer, contact links, structured data, canonical URLs, sitemap, and default sharing metadata. Replace `public/og.png` and the `YN` letters in `src/app/icon.tsx` after changing the name.

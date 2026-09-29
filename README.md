# Victoria Yi — Portfolio

A data-driven portfolio for Victoria Yi's research, prose, and cinema work. The site uses Next.js App Router, React, TypeScript, GSAP, local media, and static project content. It does not require a database, CMS, or hosted site builder.

## Start here

1. Install Node.js 20.9 or newer.
2. Run `pnpm install` (or `npm install` if you prefer npm and remove `pnpm-lock.yaml`).
3. Run `pnpm dev`.
4. Open `http://localhost:3000`.

For a production check, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Personalize the site

Edit these files first:

1. `src/config/site.ts` — name, descriptor, biography, location, email, social links, CV, and canonical domain.
2. `src/content/portfolio-data.ts` — project titles, metadata, research copy, video links, media, and page blocks. Reorder the array to reorder the site.
3. `src/content/manuscripts.json` and `src/content/poetry-pages.json` — the complete writing and poetry content.
4. `public/media/projects/` — project covers, posters, video thumbnails, and poetry pages.
5. `public/documents/` — the poetry collection, memoir, research proposal, CV, and other downloads.
5. `public/og.png` — replace the social-sharing image after personalizing the identity.

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for examples of every content block.

## Architecture

- `src/app/` contains routes, metadata, sitemap, robots, and route templates.
- `src/components/` contains the GSAP carousel, list view, menu, video facade, poster viewer, case-study renderer, and shared UI.
- `src/content/projects.ts` defines the content types, while `src/content/portfolio-data.ts` contains the project collection.
- `src/config/site.ts` is the single source for identity and contact details.
- `public/media/` and `public/documents/` contain replaceable static assets.

The carousel uses wheel, trackpad, drag, touch, and arrow-key input. A requestAnimationFrame loop provides damped motion and recycles the track invisibly. Reduced-motion users get immediate movement and simple visual state changes. YouTube embeds are created only after the visitor presses Play.

## Deploy to GitHub and Vercel

1. Create an empty GitHub repository.
2. Commit this directory and push it to the repository.
3. In Vercel, choose **Add New → Project** and import the GitHub repository.
4. Vercel detects Next.js automatically. Keep the default build settings and deploy.
5. Every push to the production branch creates a new production deployment; other branches get preview deployments.

No environment variables are required.

## Connect a custom domain

In the Vercel project, open **Settings → Domains**, add your domain (for example `yourname.com`), and follow the displayed DNS instructions. Then set the same origin in `site.siteUrl` inside `src/config/site.ts` so canonical URLs, the sitemap, and social metadata use the real domain.

## Media notes

Portfolio media is stored locally. Preserve meaningful alt text when replacing an image. Keep poster images uncropped and export new carousel thumbnails at a practical web resolution. Institution logos use a contain treatment so their full artwork remains visible.

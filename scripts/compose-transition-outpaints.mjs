import { createRequire } from "node:module";

const root = new URL("../", import.meta.url).pathname;
const require = createRequire(import.meta.url);
const sharp = require(`${root}node_modules/.pnpm/sharp@0.35.4_@types+node@26.4.0/node_modules/sharp`);
const generatedRoot = "/Users/toriy/.codex/generated_images/01a08689-9a6d-7321-a70a-8a53ee66c4f8";
const mediaRoot = `${root}public/media/projects`;

const jobs = [
  {
    name: "two-is-greater-than-one",
    generated: `${generatedRoot}/exec-effff04c-69d0-44db-b6ec-825ade6df3d5.png`,
  },
  {
    name: "hamartia",
    generated: `${generatedRoot}/exec-fa3386b4-412d-4502-bdf0-4fe50a1b55c0.png`,
  },
  {
    name: "cinnamon-and-stars",
    generated: `${generatedRoot}/exec-ebf309bc-e0e8-42f9-ad03-a7688aea63fc.png`,
  },
  {
    name: "grain-boundary-segregation",
    generated: `${generatedRoot}/exec-d0207174-9ca3-4ae7-929f-ad750ad2a993.png`,
  },
];

for (const job of jobs) {
  await sharp(job.generated)
    .resize(1920, 1080, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(`${mediaRoot}/${job.name}-transition-landscape.png`);
}

import { createRequire } from "node:module";

const root = new URL("../", import.meta.url).pathname;
const require = createRequire(import.meta.url);
const sharp = require(`${root}node_modules/.pnpm/sharp@0.35.4_@types+node@26.4.0/node_modules/sharp`);
const generatedRoot = "/Users/toriy/.codex/generated_images/01a08689-9a6d-7321-a70a-8a53ee66c4f8";

const jobs = [
  {
    name: "three-dancers-one-song",
    generated: `${generatedRoot}/exec-c07116c6-df21-4e51-9895-064fc4f6d305.png`,
  },
  {
    name: "guess-the-major",
    generated: `${generatedRoot}/exec-c02faefb-a181-4ebc-a6e1-ecf6549621e2.png`,
  },
  {
    name: "match-the-college-couple",
    generated: `${generatedRoot}/exec-c056048b-7e4a-41e5-b668-34223349cb9a.png`,
  },
  {
    name: "who-knows-me-better",
    generated: `${generatedRoot}/exec-14f41796-b84f-48f3-a31a-f5b9bad1b84c.png`,
  },
];

for (const job of jobs) {
  const output = `${root}public/media/projects/${job.name}-video-thumbnail-clean.png`;
  await sharp(job.generated)
    .resize(1920, 1080, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.4, m1: 0.45, m2: 1.6 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

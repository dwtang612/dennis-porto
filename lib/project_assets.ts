import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(webp|jpg|jpeg|png)$/i;
const COVER_NAME = /^cover\.(webp|jpg|jpeg|png)$/i;
const MAIN_HINT = /\b(main|hero|primary)\b/i;

export type ProjectImages = {
  cover: string | null;
  screenshots: string[];
};

// Probes `public/projects/<slug>/` for images. Cover priority:
//   1. file named `cover.<ext>`
//   2. file with "main", "hero", or "primary" in its name
//   3. first image alphabetically (so the directory is never empty-rendered)
// All other images become screenshots, sorted alphabetically.
export function getProjectImages(slug: string): ProjectImages {
  const dir = path.join(process.cwd(), "public", "projects", slug);
  if (!fs.existsSync(dir)) return { cover: null, screenshots: [] };

  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort();

  if (files.length === 0) return { cover: null, screenshots: [] };

  const coverFile =
    files.find((f) => COVER_NAME.test(f)) ??
    files.find((f) => MAIN_HINT.test(f)) ??
    files[0];

  const cover = `/projects/${slug}/${coverFile}`;
  const screenshots = files
    .filter((f) => f !== coverFile)
    .map((f) => `/projects/${slug}/${f}`);

  return { cover, screenshots };
}

// Back-compat helper for callers that only need the cover.
export function getProjectCover(slug: string): string | null {
  return getProjectImages(slug).cover;
}

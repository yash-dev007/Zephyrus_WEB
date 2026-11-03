import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "legacy", "assets", "img");
const imageDir = path.join(root, "public", "assets", "img");
const iconDir = path.join(root, "public", "icons");

await mkdir(imageDir, { recursive: true });
await mkdir(iconDir, { recursive: true });

async function writeVariants(
  input,
  name,
  widths,
  { avifQuality = 55, webpQuality = 82 } = {},
) {
  const source = sharp(input, { density: 160 });

  for (const width of widths) {
    const base = source.clone().resize({ width, withoutEnlargement: true });

    await base
      .clone()
      .avif({ quality: avifQuality, effort: 5 })
      .toFile(path.join(imageDir, `${name}-${width}.avif`));

    await base
      .clone()
      .webp({ quality: webpQuality, effort: 5 })
      .toFile(path.join(imageDir, `${name}-${width}.webp`));
  }
}

await writeVariants(path.join(sourceDir, "dragon.svg"), "dragon", [654, 1308], {
  avifQuality: 58,
  webpQuality: 84,
});

// Background texture only needs one size at each viewport scale.
await writeVariants(path.join(sourceDir, "topo-dark.png"), "topo-dark", [836, 1672], {
  avifQuality: 50,
  webpQuality: 78,
});

// Social preview (Open Graph / Twitter).
await sharp(path.join(sourceDir, "zephyrus-ui.webp"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(root, "public", "og-image.jpg"));

// PWA / touch icons.
for (const size of [180, 192, 512]) {
  await sharp(path.join(sourceDir, "zephyrus-mark.png"))
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconDir, `icon-${size}.png`));
}

console.log(
  "Optimized images written to public/assets/img, public/icons, and public/og-image.jpg",
);

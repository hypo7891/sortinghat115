// One-time helper: the Gemini-generated gargoyle image has a fake
// checkerboard "transparency" baked into actual pixels (two alternating
// neutral greys, ~131 and ~189, fully opaque alpha). Flood-fill from the
// border through checkerboard-like pixels only (low saturation, mid-grey
// value) to key them to transparent without punching holes in the statue's
// own (slightly tinted, non-neutral) stone-grey shading, then crop to the
// remaining opaque bounding box.
import sharp from 'sharp';

const SRC = 'image/石像鬼.png';
const OUT = 'src/assets/gargoyle.png';

const { data, info } = await sharp(SRC).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

function isCheckerish(x, y) {
  const i = (y * width + x) * channels;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const sat = maxC - minC;
  const val = (r + g + b) / 3;
  return sat <= 10 && val >= 100 && val <= 215;
}

const visited = new Uint8Array(width * height);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push([x, 0], [x, height - 1]);
}
for (let y = 0; y < height; y++) {
  stack.push([0, y], [width - 1, y]);
}

while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || x >= width || y < 0 || y >= height) continue;
  const idx = y * width + x;
  if (visited[idx]) continue;
  if (!isCheckerish(x, y)) continue;
  visited[idx] = 1;
  const i = idx * channels;
  data[i + 3] = 0;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const alpha = data[(y * width + x) * channels + 3];
    if (alpha > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log('bbox', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

await sharp(data, { raw: { width, height, channels } })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .png()
  .toFile(OUT);

console.log('wrote', OUT);

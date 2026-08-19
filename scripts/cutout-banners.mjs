import sharp from 'sharp';

const SRC = 'image/Gemini_Generated_Image_5589td5589td5589.png';
const NAMES = ['courage', 'wisdom', 'patience', 'composure'];
const OUT_DIR = 'src/assets/badges';

const WHITE_THRESHOLD = 235; // near-white background pixels

async function main() {
  const { data, info } = await sharp(SRC)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isWhite = (x, y) => {
    const i = (y * width + x) * channels;
    return data[i] >= WHITE_THRESHOLD && data[i + 1] >= WHITE_THRESHOLD && data[i + 2] >= WHITE_THRESHOLD;
  };

  // Flood fill from all four border edges through near-white pixels, marking
  // them transparent. This clears the shared white backdrop while leaving
  // each banner's own (non-white) pixels untouched.
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
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const idx = y * width + x;
    if (visited[idx]) continue;
    if (!isWhite(x, y)) continue;
    visited[idx] = 1;
    const i = idx * channels;
    data[i + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const cutoutPath = 'scripts/.banners-cutout.png';
  const cutout = sharp(data, { raw: { width, height, channels } }).png();
  await cutout.toFile(cutoutPath);

  // Measured bounding box of each banner's opaque content in the source
  // sprite sheet (left-to-right), including vertical extent — sharp's
  // .trim() only compares RGB against the corner pixel and doesn't trim by
  // alpha, so the box is computed manually instead.
  const boxes = [
    [25, 104, 343, 627],
    [374, 104, 693, 627],
    [723, 104, 1041, 626],
    [1073, 104, 1391, 627],
  ];
  for (let i = 0; i < 4; i++) {
    const [left, top, right, bottom] = boxes[i];
    await sharp(cutoutPath)
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
      .toFile(`${OUT_DIR}/${NAMES[i]}.png`);
  }

  console.log('done');
}

main();

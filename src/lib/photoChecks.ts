export interface PhotoChecks {
  luminosite: boolean;
  cadrage: boolean;
  nettete: boolean;
  distance: boolean;
}

export async function analyzePhoto(file: File): Promise<PhotoChecks> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const maxDim = 400; // downscale for fast analysis
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Luminosité: average brightness, expect a mid-range (not too dark, not blown out)
  let totalBrightness = 0;
  const gray = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const b = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[i / 4] = b;
    totalBrightness += b;
  }
  const avgBrightness = totalBrightness / (width * height);
  const luminosite = avgBrightness > 40 && avgBrightness < 230;

  // Netteté: simple Laplacian-based edge variance (blurry images have low variance)
  let edgeSum = 0;
  let edgeCount = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const laplacian =
        4 * gray[idx] - gray[idx - 1] - gray[idx + 1] - gray[idx - width] - gray[idx + width];
      edgeSum += laplacian * laplacian;
      edgeCount++;
    }
  }
  const sharpnessScore = edgeSum / edgeCount;
  const nettete = sharpnessScore > 15;

  // Cadrage: reasonably square-ish framing (not an extreme panorama/sliver)
  const ratio = img.width / img.height;
  const cadrage = ratio > 0.5 && ratio < 2;

  // Distance: proxy via resolution — very low-res photos suggest too far / heavily cropped
  const distance = img.width >= 400 && img.height >= 400;

  return { luminosite, cadrage, nettete, distance };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
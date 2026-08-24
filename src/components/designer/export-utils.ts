import type { DesignElement } from "./types";

export type ExportFormat = "png-transparent" | "png-white" | "svg";

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    // Never block the export on a broken/odd image — resolve with an empty image.
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Render text + shapes (+ images) onto an HTML canvas and download as PNG. */
export async function exportPng(
  elements: DesignElement[],
  canvasWidth: number,
  canvasHeight: number,
  background: "transparent" | "white"
): Promise<void> {
  // Preload any images so nothing is missing when we draw.
  await Promise.all(
    elements
      .filter((el) => el.type === "image")
      .map((el) => loadImage(el.content))
  );

  const scale = 2; // 2x for crisp output
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(canvasWidth * scale));
  canvas.height = Math.max(1, Math.round(canvasHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.scale(scale, scale);
  if (background === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  for (const el of elements) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, el.opacity / 100));
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    if (el.type === "shape") {
      ctx.fillStyle = el.color;
      if (el.shape === "circle") {
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(el.width, el.height) / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(el.x, el.y, el.width, el.height);
      }
    } else if (el.type === "text") {
      ctx.fillStyle = el.color;
      ctx.font = `600 ${el.fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lines = el.content.split("\n");
      const lineHeight = el.fontSize * 1.2;
      const startY = cy - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, cx, startY + i * lineHeight);
      });
    } else if (el.type === "image") {
      const img = imageCache.get(el.content);
      if (img && img.naturalWidth > 0) {
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
      }
    }

    ctx.restore();
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (blob) downloadBlob(blob, "smartprint-design.png");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Serialize text + shape elements to an SVG string and download it. */
export function exportSvg(
  elements: DesignElement[],
  canvasWidth: number,
  canvasHeight: number
): void {
  const parts: string[] = [];

  for (const el of elements) {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    const opacity = Math.min(1, Math.max(0, el.opacity / 100)).toFixed(2);
    const transform = `rotate(${el.rotation} ${cx} ${cy})`;

    if (el.type === "shape") {
      if (el.shape === "circle") {
        parts.push(
          `<circle cx="${cx}" cy="${cy}" r="${Math.min(el.width, el.height) / 2}" fill="${el.color}" opacity="${opacity}" transform="${transform}"/>`
        );
      } else {
        parts.push(
          `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.color}" opacity="${opacity}" transform="${transform}" rx="4"/>`
        );
      }
    } else if (el.type === "text") {
      const lines = el.content.split("\n");
      const lineHeight = el.fontSize * 1.2;
      const startY = cy - ((lines.length - 1) * lineHeight) / 2 + el.fontSize * 0.35;
      const tspans = lines
        .map(
          (line, i) =>
            `<tspan x="${cx}" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`
        )
        .join("");
      parts.push(
        `<text text-anchor="middle" font-size="${el.fontSize}" font-weight="600" font-family="system-ui, -apple-system, sans-serif" fill="${el.color}" opacity="${opacity}" transform="${transform}">${tspans}</text>`
      );
    }
    // Images are intentionally skipped in the text-only SVG export.
  }

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">` +
    parts.join("") +
    `</svg>`;

  downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "smartprint-design.svg");
}

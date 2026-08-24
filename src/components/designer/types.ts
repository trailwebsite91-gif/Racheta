/** Shared types for the SmartPrint Studio design tool. */

export type ElementType = "text" | "image" | "shape";
export type ShapeKind = "rect" | "circle";
export type Tool = "select" | "text" | "rect" | "circle" | "upload";
export type CreationTool = Exclude<Tool, "select" | "upload">;

export interface DesignElement {
  id: string;
  type: ElementType;
  /** Present when type === "shape". */
  shape?: ShapeKind;
  /** Top-left position (px, relative to canvas top-left, unrotated). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Degrees, clockwise. */
  rotation: number;
  /** 0–100. */
  opacity: number;
  /** Text content, or image data URL when type === "image". */
  content: string;
  /** Text color / shape fill. */
  color: string;
  /** Font size in px (text only). */
  fontSize: number;
}

export type MockupKind = "shirt" | "hoodie" | "sweatshirt" | "mug" | "phone" | "tote" | "poster" | "cap";

export interface Product {
  id: string;
  name: string;
  /** Design canvas dimensions (the print area). */
  canvasWidth: number;
  canvasHeight: number;
  mockup: {
    kind: MockupKind;
    /** Silhouette bounding box (px). */
    bodyWidth: number;
    bodyHeight: number;
    /** Print area rectangle inside the silhouette (px). */
    printX: number;
    printY: number;
    printWidth: number;
    printHeight: number;
    /** CSS gradient for the product body. */
    gradient: string;
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "classic-tee",
    name: "Classic T-Shirt",
    canvasWidth: 400,
    canvasHeight: 500,
    mockup: {
      kind: "shirt",
      bodyWidth: 300,
      bodyHeight: 330,
      printX: 45,
      printY: 105,
      printWidth: 210,
      printHeight: 150,
      gradient: "linear-gradient(160deg, #ffffff 0%, #e7e5e4 55%, #d6d3d1 100%)",
    },
  },
  {
    id: "oversized-tee",
    name: "Oversized T-Shirt",
    canvasWidth: 400,
    canvasHeight: 500,
    mockup: {
      kind: "shirt",
      bodyWidth: 320,
      bodyHeight: 360,
      printX: 50,
      printY: 110,
      printWidth: 220,
      printHeight: 160,
      gradient: "linear-gradient(160deg, #fafaf9 0%, #dcdcd9 55%, #c8c6c2 100%)",
    },
  },
  {
    id: "hoodie",
    name: "Hoodie",
    canvasWidth: 420,
    canvasHeight: 520,
    mockup: {
      kind: "hoodie",
      bodyWidth: 310,
      bodyHeight: 350,
      printX: 50,
      printY: 110,
      printWidth: 210,
      printHeight: 160,
      gradient: "linear-gradient(160deg, #292524 0%, #1c1917 60%, #0c0a09 100%)",
    },
  },
  {
    id: "sweatshirt",
    name: "Sweatshirt",
    canvasWidth: 400,
    canvasHeight: 500,
    mockup: {
      kind: "sweatshirt",
      bodyWidth: 300,
      bodyHeight: 340,
      printX: 45,
      printY: 105,
      printWidth: 210,
      printHeight: 150,
      gradient: "linear-gradient(160deg, #f0abfc 0%, #d946ef 60%, #a21caf 100%)",
    },
  },
  {
    id: "mug",
    name: "Mug",
    canvasWidth: 300,
    canvasHeight: 200,
    mockup: {
      kind: "mug",
      bodyWidth: 170,
      bodyHeight: 200,
      printX: 30,
      printY: 45,
      printWidth: 110,
      printHeight: 110,
      gradient: "linear-gradient(160deg, #ffffff 0%, #f5f5f4 50%, #d4d4d8 100%)",
    },
  },
  {
    id: "phone-case",
    name: "Phone Case",
    canvasWidth: 280,
    canvasHeight: 560,
    mockup: {
      kind: "phone",
      bodyWidth: 150,
      bodyHeight: 300,
      printX: 28,
      printY: 60,
      printWidth: 94,
      printHeight: 180,
      gradient: "linear-gradient(160deg, #e0f2fe 0%, #38bdf8 60%, #0369a1 100%)",
    },
  },
  {
    id: "tote-bag",
    name: "Tote Bag",
    canvasWidth: 400,
    canvasHeight: 500,
    mockup: {
      kind: "tote",
      bodyWidth: 250,
      bodyHeight: 280,
      printX: 50,
      printY: 65,
      printWidth: 150,
      printHeight: 150,
      gradient: "linear-gradient(160deg, #fef3c7 0%, #fbbf24 60%, #b45309 100%)",
    },
  },
  {
    id: "poster",
    name: "Poster",
    canvasWidth: 500,
    canvasHeight: 700,
    mockup: {
      kind: "poster",
      bodyWidth: 240,
      bodyHeight: 336,
      printX: 12,
      printY: 12,
      printWidth: 216,
      printHeight: 312,
      gradient: "linear-gradient(160deg, #fafafa 0%, #e4e4e7 100%)",
    },
  },
  {
    id: "cap",
    name: "Cap",
    canvasWidth: 350,
    canvasHeight: 280,
    mockup: {
      kind: "cap",
      bodyWidth: 250,
      bodyHeight: 170,
      printX: 62,
      printY: 30,
      printWidth: 126,
      printHeight: 80,
      gradient: "linear-gradient(160deg, #dcfce7 0%, #4ade80 60%, #166534 100%)",
    },
  },
];

export function getProduct(id: string): Product {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
}

export const PRESET_COLORS = [
  "#18181b",
  "#ffffff",
  "#7c3aed",
  "#2563eb",
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#a855f7",
];

export const FONT_SIZES = [12, 16, 18, 24, 32, 48];

let idCounter = 0;
export function genId(): string {
  idCounter += 1;
  return `el-${Date.now().toString(36)}-${idCounter}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

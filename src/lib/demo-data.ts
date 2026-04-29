import type { LucideIcon } from "lucide-react";
import { Armchair, Coffee, LampDesk } from "lucide-react";

export type ModelKind = "chair" | "table" | "lamp";

export type ArModel = {
  id: string;
  tenantSlug: string;
  name: string;
  category: string;
  kind: ModelKind;
  color: string;
  material: string;
  modelUrl: string;
  posterUrl?: string;
  scans: number;
  conversions: number;
};

export type Tenant = {
  slug: string;
  name: string;
  segment: string;
  location: string;
  qrLabel: string;
  accent: string;
  icon: LucideIcon;
  models: ArModel[];
};

export const tenants: Tenant[] = [
  {
    slug: "espresso-bar",
    name: "Espresso Bar",
    segment: "Cafe",
    location: "Tashkent City",
    qrLabel: "Table 08",
    accent: "#0f766e",
    icon: Coffee,
    models: [
      {
        id: "signature-chair",
        tenantSlug: "espresso-bar",
        name: "Signature lounge chair",
        category: "Interior seating",
        kind: "chair",
        color: "#0f766e",
        material: "Walnut frame, dark teal fabric",
        modelUrl: "/models/signature-chair.glb",
        scans: 1284,
        conversions: 146,
      },
      {
        id: "round-table",
        tenantSlug: "espresso-bar",
        name: "Round menu table",
        category: "Cafe table",
        kind: "table",
        color: "#b45309",
        material: "Oak top, matte black base",
        modelUrl: "/models/signature-chair.glb",
        scans: 846,
        conversions: 88,
      },
    ],
  },
  {
    slug: "noma-furniture",
    name: "Noma Furniture",
    segment: "Furniture showroom",
    location: "Samarkand",
    qrLabel: "Sofa zone",
    accent: "#7c3aed",
    icon: Armchair,
    models: [
      {
        id: "atelier-lamp",
        tenantSlug: "noma-furniture",
        name: "Atelier floor lamp",
        category: "Lighting",
        kind: "lamp",
        color: "#d97706",
        material: "Brushed brass, linen shade",
        modelUrl: "/models/signature-chair.glb",
        scans: 2190,
        conversions: 302,
      },
      {
        id: "modular-chair",
        tenantSlug: "noma-furniture",
        name: "Modular reading chair",
        category: "Living room",
        kind: "chair",
        color: "#4f46e5",
        material: "Ash frame, woven wool",
        modelUrl: "/models/signature-chair.glb",
        scans: 1735,
        conversions: 211,
      },
    ],
  },
  {
    slug: "studio-light",
    name: "Studio Light",
    segment: "Decor brand",
    location: "Bukhara",
    qrLabel: "Window display",
    accent: "#be123c",
    icon: LampDesk,
    models: [
      {
        id: "gallery-lamp",
        tenantSlug: "studio-light",
        name: "Gallery desk lamp",
        category: "Desk setup",
        kind: "lamp",
        color: "#be123c",
        material: "Ceramic base, opal glass",
        modelUrl: "/models/signature-chair.glb",
        scans: 912,
        conversions: 74,
      },
    ],
  },
];

export function getTenant(slug: string) {
  return tenants.find((tenant) => tenant.slug === slug);
}

export const demoModels = tenants.flatMap((tenant) => tenant.models);

export function getModel(id: string) {
  return demoModels.find((model) => model.id === id);
}

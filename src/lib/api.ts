import type { ModelKind } from "@/lib/demo-data";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type ApiBusiness = {
  id: string;
  name: string;
  slug: string;
  segment: string;
  location: string;
};

export type ApiModel = {
  id: string;
  business?: string;
  business_name?: string;
  name: string;
  category: string;
  kind: ModelKind | "other";
  color: string;
  material: string;
  file_url: string;
  status: string;
};

export async function ensureDemoBusiness() {
  const slug = "local-business";
  const existing = await fetch(`${apiBaseUrl}/api/businesses/${slug}/`, {
    cache: "no-store",
  });

  if (existing.ok) {
    return (await existing.json()) as ApiBusiness;
  }

  const created = await fetch(`${apiBaseUrl}/api/businesses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Local Business",
      slug,
      segment: "Demo workspace",
      location: "Tashkent",
    }),
  });

  if (!created.ok) {
    throw new Error("Business profile could not be created.");
  }

  return (await created.json()) as ApiBusiness;
}

export async function uploadModel(input: {
  businessId: string;
  name: string;
  category: string;
  kind: ModelKind;
  color: string;
  material: string;
  file: File;
}) {
  const formData = new FormData();
  formData.set("business", input.businessId);
  formData.set("name", input.name);
  formData.set("category", input.category);
  formData.set("kind", input.kind);
  formData.set("color", input.color);
  formData.set("material", input.material);
  formData.set("file", input.file);
  formData.set("status", "live");

  const response = await fetch(`${apiBaseUrl}/api/models/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Model upload failed.");
  }

  return (await response.json()) as ApiModel;
}

export async function fetchPublicModel(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/public/models/${id}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ApiModel;
}

export async function sendScanEvent(modelId: string, qrCode?: string | null) {
  await fetch(`${apiBaseUrl}/api/public/models/${modelId}/scan/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qr_code: qrCode }),
  });
}

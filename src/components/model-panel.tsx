"use client";

import { ArCanvas } from "@/components/ar-canvas";
import { ModelViewer } from "@/components/model-viewer";
import { QrCard } from "@/components/qr-card";
import { ensureDemoBusiness, uploadModel } from "@/lib/api";
import { demoModels, type ArModel, type ModelKind } from "@/lib/demo-data";
import { Box, CheckCircle2, Link as LinkIcon, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type PanelModel = ArModel & {
  source: "demo" | "local";
};

const storageKey = "ar-view.local-models";

function readLocalModels(): PanelModel[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
  } catch {
    return [];
  }
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ModelPanel() {
  const [localModels, setLocalModels] = useState<PanelModel[]>(readLocalModels);
  const [selectedId, setSelectedId] = useState("signature-chair");
  const [name, setName] = useState("Cafe demo chair");
  const [category, setCategory] = useState("Cafe table object");
  const [kind, setKind] = useState<ModelKind>("chair");
  const [color, setColor] = useState("#0f766e");
  const [modelUrl, setModelUrl] = useState("/models/signature-chair.glb");
  const [file, setFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState("Local fallback tayyor");

  const models = useMemo<PanelModel[]>(
    () => [
      ...demoModels.map((model) => ({ ...model, source: "demo" as const })),
      ...localModels,
    ],
    [localModels],
  );

  const selected = models.find((model) => model.id === selectedId) ?? models[0];

  async function addModel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (file) {
      setSaveStatus("Backendga upload qilinmoqda...");

      try {
        const business = await ensureDemoBusiness();
        const created = await uploadModel({
          businessId: business.id,
          name,
          category,
          kind,
          color,
          material: "Uploaded model preview",
          file,
        });

        const nextModel: PanelModel = {
          id: created.id,
          tenantSlug: "local-business",
          name: created.name,
          category: created.category,
          kind: created.kind === "other" ? "chair" : created.kind,
          color: created.color,
          material: created.material,
          modelUrl: created.file_url,
          scans: 0,
          conversions: 0,
          source: "local",
        };
        const nextModels = [...localModels, nextModel];
        setLocalModels(nextModels);
        window.localStorage.setItem(storageKey, JSON.stringify(nextModels));
        setSelectedId(created.id);
        setModelUrl(created.file_url);
        setSaveStatus("Backendga saqlandi va QR tayyor.");
        return;
      } catch {
        setSaveStatus("Backend ishlamadi, model local fallback sifatida qo'shildi.");
      }
    }

    const id = `${makeSlug(name) || "model"}-${Date.now().toString(36)}`;
    const localObjectUrl = file ? URL.createObjectURL(file) : modelUrl;
    const nextModel: PanelModel = {
      id,
      tenantSlug: "local-business",
      name,
      category,
      kind,
      color,
      material: "Uploaded model preview",
      modelUrl: localObjectUrl,
      scans: 0,
      conversions: 0,
      source: "local",
    };

    const nextModels = [...localModels, nextModel];
    setLocalModels(nextModels);
    window.localStorage.setItem(storageKey, JSON.stringify(nextModels));
    setSelectedId(id);
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Box className="size-5" />
            </div>
            <div>
              <p className="font-semibold leading-5">AR View Panel</p>
              <p className="text-xs text-zinc-500">Authsiz model va QR boshqaruvi</p>
            </div>
          </Link>
          <Link
            href={`/ar/${selected.id}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <LinkIcon className="size-4" />
            Open scan page
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr_320px] lg:px-8">
        <form onSubmit={addModel} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold">3D model qo&apos;shish</h1>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Hozircha local prototip. DRF kelganda shu form `POST /api/models/` ga ulanadi.
            </p>
          </div>

          <label className="block text-sm font-medium">
            Model nomi
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none focus:border-zinc-950"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Kategoriya
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none focus:border-zinc-950"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            GLB URL
            <input
              value={modelUrl}
              onChange={(event) => setModelUrl(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none focus:border-zinc-950"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            GLB fayl
            <input
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-2 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          <div className="grid grid-cols-[1fr_84px] gap-3">
            <label className="block text-sm font-medium">
              Tur
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value as ModelKind)}
                className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 outline-none focus:border-zinc-950"
              >
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="lamp">Lamp</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Rang
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white p-1"
              />
            </label>
          </div>

          <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
            <Plus className="size-4" />
            Model qo&apos;shish
          </button>

          <p className="text-sm text-zinc-500">{saveStatus}</p>

          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            Browser local faylni boshqa telefonga bera olmaydi. Real upload uchun DRF media storage
            va public GLB URL kerak bo&apos;ladi.
          </div>
        </form>

        <section className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-500">Tanlangan model</p>
                <h2 className="mt-1 text-2xl font-semibold">{selected.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">{selected.category}</p>
              </div>
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                {selected.source === "demo" ? "Demo" : "Local"}
              </span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="h-[430px]">
              <ModelViewer
                src={selected.modelUrl}
                alt={selected.name}
                className="h-full w-full rounded-lg border border-zinc-200 bg-white"
              />
            </div>
            <div className="h-[430px]">
              <ArCanvas kind={selected.kind} color={selected.color} label={`${selected.name} fallback`} />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <QrCard path={`/ar/${selected.id}`} label={`${selected.name} QR`} />
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-4">
              <p className="font-semibold">Model katalog</p>
            </div>
            <div className="max-h-[420px] divide-y divide-zinc-200 overflow-auto">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedId(model.id)}
                  className={`flex w-full items-center gap-3 p-4 text-left hover:bg-zinc-50 ${
                    selected.id === model.id ? "bg-zinc-50" : ""
                  }`}
                >
                  <div className="size-10 rounded-md border border-zinc-200" style={{ backgroundColor: model.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{model.name}</span>
                    <span className="block truncate text-xs text-zinc-500">{model.modelUrl}</span>
                  </span>
                  {selected.id === model.id ? <CheckCircle2 className="size-4 text-emerald-600" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Upload className="size-4" />
              Backend kerak bo&apos;ladigan joylar
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Model fayl upload, public QR link, scan event, tenant profile va model statuslari DRF
              endpointlariga chiqadi.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

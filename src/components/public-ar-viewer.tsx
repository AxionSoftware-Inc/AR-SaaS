"use client";

import { ModelViewer } from "@/components/model-viewer";
import { fetchPublicModel, sendScanEvent, type ApiModel } from "@/lib/api";
import { absoluteUrl, androidSceneViewerUrl } from "@/lib/ar-links";
import type { ArModel } from "@/lib/demo-data";
import { ArrowLeft, Box, Camera, Heart, MessageCircle, Move3D, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PublicArViewerProps = {
  modelId: string;
  initialModel?: ArModel;
};

type ViewModel = {
  id: string;
  name: string;
  category: string;
  material: string;
  modelUrl: string;
};

function toViewModel(model: ArModel | ApiModel): ViewModel {
  return {
    id: model.id,
    name: model.name,
    category: model.category,
    material: model.material,
    modelUrl: "modelUrl" in model ? model.modelUrl : model.file_url,
  };
}

export function PublicArViewer({ modelId, initialModel }: PublicArViewerProps) {
  const searchParams = useSearchParams();
  const qrCode = searchParams.get("qr");
  const [apiModel, setApiModel] = useState<ApiModel | null>(null);
  const [isLoading, setIsLoading] = useState(!initialModel);
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));

  useEffect(() => {
    let ignore = false;

    if (!initialModel) {
      fetchPublicModel(modelId)
        .then((model) => {
          if (!ignore) setApiModel(model);
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    }

    if (!initialModel) {
      sendScanEvent(modelId, qrCode).catch(() => undefined);
    }

    return () => {
      ignore = true;
    };
  }, [initialModel, modelId, qrCode]);

  const model = useMemo(() => {
    if (initialModel) return toViewModel(initialModel);
    if (apiModel) return toViewModel(apiModel);
    return null;
  }, [apiModel, initialModel]);

  const absoluteModelUrl = model && origin ? absoluteUrl(model.modelUrl, origin) : "";
  const androidArUrl =
    model && origin
      ? androidSceneViewerUrl({
          modelUrl: absoluteModelUrl,
          pageUrl: typeof window === "undefined" ? origin : window.location.href,
          title: model.name,
        })
      : "";
  const isHttps = origin.startsWith("https://");

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <p className="text-sm text-zinc-300">Model yuklanmoqda...</p>
      </main>
    );
  }

  if (!model) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-semibold">Model topilmadi</h1>
          <p className="mt-2 text-sm text-zinc-400">QR link backend yoki demo katalogda yo&apos;q.</p>
          <Link href="/panel" className="mt-5 inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-semibold text-zinc-950">
            Panelga qaytish
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/panel"
            className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 bg-white/10 hover:bg-white/15"
            aria-label="Back to panel"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold">{model.name}</p>
            <p className="truncate text-xs text-zinc-400">QR scan page</p>
          </div>
          <div className="size-10" />
        </header>

        <section className="grid flex-1 gap-5 py-5 lg:grid-cols-[1fr_330px] lg:items-stretch">
          <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/10 bg-white">
            <ModelViewer
              src={model.modelUrl}
              alt={model.name}
              className="h-full min-h-[560px] w-full bg-white"
            />
            <div className="pointer-events-none absolute left-4 top-4 rounded-md bg-zinc-950/80 px-3 py-2 text-sm font-medium">
              3D + AR ready
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-zinc-950/80 px-3 py-2 text-sm">
              <Move3D className="size-4" />
              Rotate, zoom, then tap AR
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-zinc-400">{model.category}</p>
              <h1 className="mt-2 text-2xl font-semibold">{model.name}</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{model.material}</p>
            </div>

            <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-5">
              <div className="flex items-center gap-3">
                <Camera className="size-5 text-emerald-300" />
                <p className="font-semibold">Android native AR</p>
              </div>
              <a
                href={androidArUrl || "#"}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-300 px-4 text-sm font-semibold text-zinc-950 hover:bg-emerald-200"
              >
                <Box className="size-4" />
                Android AR&apos;da ochish
              </a>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {isHttps
                  ? "Bu tugma Android Scene Viewer orqali kamerali AR rejimni ochadi."
                  : "Native AR uchun sahifa HTTPS orqali ochilishi kerak. HTTP faqat 3D preview beradi."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                [Heart, "Save"],
                [MessageCircle, "Ask"],
                [ShoppingBag, "Order"],
              ].map(([Icon, label]) => (
                <button
                  key={label as string}
                  className="flex h-20 flex-col items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 text-sm font-medium hover:bg-white/15"
                >
                  <Icon className="size-5" />
                  {label as string}
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-white/10 bg-white/10 p-5">
              <div className="flex items-center gap-3">
                <Camera className="size-5 text-emerald-300" />
                <p className="font-semibold">Eslatma</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Oq fondagi 3D viewer browser preview. Androidda haqiqiy kamera AR uchun yuqoridagi
                native AR tugmasidan foydalaning.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

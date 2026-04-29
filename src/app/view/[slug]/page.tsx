import { ArCanvas } from "@/components/ar-canvas";
import { getTenant, tenants } from "@/lib/demo-data";
import { ArrowLeft, Camera, Heart, Info, MessageCircle, Move3D, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type ViewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return tenants.map((tenant) => ({ slug: tenant.slug }));
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { slug } = await params;
  const tenant = getTenant(slug);

  if (!tenant) {
    notFound();
  }

  const model = tenant.models[0];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 bg-white/10 hover:bg-white/15"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold">{tenant.name}</p>
            <p className="truncate text-xs text-zinc-400">{tenant.qrLabel}</p>
          </div>
          <button
            className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 bg-white/10 hover:bg-white/15"
            aria-label="Info"
          >
            <Info className="size-5" />
          </button>
        </header>

        <section className="grid flex-1 gap-5 py-5 lg:grid-cols-[1fr_330px] lg:items-stretch">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/10 bg-white">
            <ArCanvas kind={model.kind} color={model.color} label={model.name} />
            <div className="pointer-events-none absolute left-4 top-4 rounded-md bg-zinc-950/80 px-3 py-2 text-sm font-medium">
              Browser 3D preview
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-zinc-950/80 px-3 py-2 text-sm">
              <Move3D className="size-4" />
              Rotate preview is active
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-zinc-400">{model.category}</p>
              <h1 className="mt-2 text-2xl font-semibold">{model.name}</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{model.material}</p>
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
                <p className="font-semibold">Mobile AR next</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Keyingi bosqichda WebXR, model-viewer yoki native mobile orqali kamera ustida
                real joylashtirish qo&apos;shiladi. Hozirgi build web oqimini isbotlaydi.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

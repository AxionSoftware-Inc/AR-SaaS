import { ArCanvas } from "@/components/ar-canvas";
import { QrCard } from "@/components/qr-card";
import { tenants } from "@/lib/demo-data";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Box,
  Layers3,
  Plus,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";

const activeTenant = tenants[0];
const activeModel = activeTenant.models[0];

export default function Home() {
  const totalScans = tenants.flatMap((tenant) => tenant.models).reduce((sum, model) => sum + model.scans, 0);
  const totalConversions = tenants
    .flatMap((tenant) => tenant.models)
    .reduce((sum, model) => sum + model.conversions, 0);

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Layers3 className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold leading-5">AR View</p>
              <p className="text-xs text-zinc-500">Commerce-ready 3D QR platform</p>
            </div>
          </div>
          <nav className="hidden items-center gap-2 text-sm font-medium text-zinc-600 md:flex">
            <Link className="rounded-md px-3 py-2 hover:bg-zinc-100" href="/panel">
              Panel
            </Link>
            <a className="rounded-md px-3 py-2 hover:bg-zinc-100" href="#dashboard">
              Dashboard
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-zinc-100" href="#models">
              Models
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-zinc-100" href="#qr">
              QR
            </a>
          </nav>
          <Link
            href={`/ar/${activeModel.id}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <ScanLine className="size-4" />
            Preview scan
          </Link>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_430px] lg:px-8">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                <BadgeCheck className="size-4" />
                MVP: web dashboard + QR + browser 3D preview
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-zinc-950 md:text-5xl">
                Cafelar va mebel bizneslari uchun QR orqali ochiladigan AR katalog.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                Biznes profil ochadi, 3D model yuklaydi, stol yoki showroom uchun QR oladi.
                Mijoz QR ni skaner qilganda model telefon brauzerida ko&apos;rinadi.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Active profiles", tenants.length.toString(), ShieldCheck],
                ["Monthly scans", totalScans.toLocaleString("en-US"), BarChart3],
                ["Lead actions", totalConversions.toLocaleString("en-US"), ArrowUpRight],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <Icon className="size-5 text-zinc-500" />
                  <p className="mt-3 text-2xl font-semibold">{value as string}</p>
                  <p className="text-sm text-zinc-500">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[460px] min-h-[460px]">
            <ArCanvas kind={activeModel.kind} color={activeModel.color} label={activeModel.name} />
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-zinc-950">Workspace</p>
            <div className="mt-4 space-y-2">
              {tenants.map((tenant) => {
                const Icon = tenant.icon;
                return (
                  <button
                    key={tenant.slug}
                    className={`flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left ${
                      tenant.slug === activeTenant.slug
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{tenant.name}</span>
                      <span className="block truncate text-xs opacity-70">{tenant.segment}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold">Different angle</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Oddiy katalog emas: har QR stol, xona yoki display joyiga bog&apos;lanadi. Dashboard scan,
              qiziqish va sotuvga yaqin harakatlarni ko&apos;rsatadi.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-zinc-500">Business profile</p>
                <h2 className="text-2xl font-semibold">{activeTenant.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {activeTenant.segment} / {activeTenant.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/panel" className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold hover:bg-zinc-50">
                  <Upload className="size-4" />
                  Upload model
                </Link>
                <Link href="/panel" className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800">
                  <Plus className="size-4" />
                  New QR
                </Link>
              </div>
            </div>
          </section>

          <section id="models" className="grid gap-6 xl:grid-cols-[1fr_390px]">
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 p-5">
                <div>
                  <h2 className="text-lg font-semibold">3D model catalog</h2>
                  <p className="text-sm text-zinc-500">Upload, approve, assign to QR points.</p>
                </div>
                <Box className="size-5 text-zinc-500" />
              </div>
              <div className="divide-y divide-zinc-200">
                {activeTenant.models.map((model) => (
                  <div key={model.id} className="grid gap-4 p-5 md:grid-cols-[1fr_130px_130px] md:items-center">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-md border border-zinc-200" style={{ backgroundColor: model.color }} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{model.name}</p>
                        <p className="truncate text-sm text-zinc-500">{model.material}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{model.scans.toLocaleString("en-US")}</p>
                      <p className="text-xs text-zinc-500">Scans</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{model.conversions.toLocaleString("en-US")}</p>
                      <p className="text-xs text-zinc-500">Actions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="qr" className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">QR ochadigan model</p>
                    <p className="mt-1 text-sm text-zinc-500">{activeModel.name}</p>
                  </div>
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                    Backendsiz demo
                  </span>
                </div>
                <div className="mt-4 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex min-h-48 items-center justify-center rounded-md bg-white">
                    <div className="relative h-32 w-36">
                      <div
                        className="absolute left-4 top-12 h-14 w-28 rounded-md border border-black/10 shadow-lg"
                        style={{ backgroundColor: activeModel.color }}
                      />
                      <div
                        className="absolute left-6 top-2 h-24 w-24 rounded-md border border-black/10 shadow-lg"
                        style={{ backgroundColor: activeModel.color }}
                      />
                      <div className="absolute bottom-0 left-7 h-14 w-2 rounded bg-amber-900" />
                      <div className="absolute bottom-0 left-28 h-14 w-2 rounded bg-amber-900" />
                      <div className="absolute bottom-0 left-14 h-14 w-2 rounded bg-amber-900" />
                      <div className="absolute bottom-0 left-24 h-14 w-2 rounded bg-amber-900" />
                    </div>
                  </div>
                  <div className="mt-3 rounded-md bg-white p-3">
                    <p className="text-sm font-semibold text-zinc-950">{activeModel.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{activeModel.material}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Bu demo model serverdagi static GLB fayldan ochiladi. QR ni skaner qilsangiz
                  shu model browserda 3D/AR view sifatida chiqadi.
                </p>
              </div>
              <QrCard path={`/ar/${activeModel.id}?native=1`} label={`${activeTenant.qrLabel}: ${activeModel.name}`} />
              <Link
                href={`/ar/${activeModel.id}?native=1`}
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white text-sm font-semibold hover:bg-zinc-50"
              >
                <QrCode className="size-4" />
                Open customer view
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["Spatial QR zones", "Each QR can represent a table, room, display wall, or product shelf."],
              ["Model QA pipeline", "Uploaded GLB/USDZ files can be checked before customers see them."],
              ["Offer layer", "Businesses can attach menu, price, booking, or inquiry actions to the 3D view."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <Sparkles className="size-5 text-zinc-500" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

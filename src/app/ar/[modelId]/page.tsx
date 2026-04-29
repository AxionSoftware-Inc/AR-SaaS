import { PublicArViewer } from "@/components/public-ar-viewer";
import { demoModels, getModel } from "@/lib/demo-data";
import { Suspense } from "react";

type ArPageProps = {
  params: Promise<{
    modelId: string;
  }>;
};

export function generateStaticParams() {
  return demoModels.map((model) => ({ modelId: model.id }));
}

export default async function ArPage({ params }: ArPageProps) {
  const { modelId } = await params;
  const model = getModel(modelId);

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">
          <p className="text-sm text-zinc-300">Model yuklanmoqda...</p>
        </main>
      }
    >
      <PublicArViewer modelId={modelId} initialModel={model} />
    </Suspense>
  );
}

"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";

type QrCardProps = {
  path: string;
  label: string;
};

export function QrCard({ path, label }: QrCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  const targetUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return path;
    }

    return `${window.location.origin}${path}`;
  }, [path]);

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 176,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    }).then(setQrDataUrl);
  }, [targetUrl]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-950">{label}</p>
          <p className="mt-1 max-w-[190px] truncate text-xs text-zinc-500">
            {targetUrl}
          </p>
        </div>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          Live
        </span>
      </div>
      <div className="mt-4 flex aspect-square items-center justify-center rounded-md border border-zinc-200 bg-zinc-50">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt={`${label} QR`} className="h-44 w-44" />
        ) : (
          <div className="h-44 w-44 animate-pulse rounded bg-zinc-200" />
        )}
      </div>
    </div>
  );
}

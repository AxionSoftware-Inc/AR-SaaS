export function absoluteUrl(pathOrUrl: string, origin: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function androidSceneViewerUrl(input: {
  modelUrl: string;
  pageUrl: string;
  title: string;
  mode?: "ar_only" | "ar_preferred" | "3d_only";
}) {
  const file = encodeURIComponent(input.modelUrl);
  const fallback = encodeURIComponent(input.pageUrl);
  const title = encodeURIComponent(input.title);
  const mode = input.mode ?? "ar_only";

  return [
    `intent://arvr.google.com/scene-viewer/1.0?file=${file}`,
    `&title=${title}`,
    `&mode=${mode}`,
    "#Intent;scheme=https",
    ";package=com.google.android.googlequicksearchbox",
    ";action=android.intent.action.VIEW",
    `;S.browser_fallback_url=${fallback}`,
    ";end;",
  ].join("");
}

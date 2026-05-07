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
}) {
  const file = encodeURIComponent(input.modelUrl);
  const fallback = encodeURIComponent(input.pageUrl);
  const title = encodeURIComponent(input.title);

  return [
    `intent://arvr.google.com/scene-viewer/1.0?file=${file}`,
    `&title=${title}`,
    "&mode=ar_preferred",
    "#Intent;scheme=https",
    ";package=com.google.android.googlequicksearchbox",
    ";action=android.intent.action.VIEW",
    `;S.browser_fallback_url=${fallback}`,
    ";end;",
  ].join("");
}

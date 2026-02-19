function ensureProtocol(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function parseUrl(input: string): URL | null {
  try {
    return new URL(ensureProtocol(input));
  } catch {
    return null;
  }
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export type EmbedTemplateResult = {
  html: string;
} | {
  error: string;
};

export function buildIframeEmbedHtml(inputUrl: string): EmbedTemplateResult {
  const url = parseUrl(inputUrl);
  if (!url) {
    return { error: "Please enter a valid iframe URL." };
  }

  return {
    html: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;"><iframe src="${escapeAttribute(url.toString())}" title="Embedded content" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe></div>`,
  };
}

function extractYouTubeVideoId(input: string): string | null {
  const url = parseUrl(input);
  if (!url) {
    return null;
  }

  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.replace(/^\//, "").split("/")[0];
    return id || null;
  }

  if (host.endsWith("youtube.com")) {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    const segments = url.pathname.split("/").filter(Boolean);
    if ((segments[0] === "embed" || segments[0] === "shorts") && segments[1]) {
      return segments[1];
    }
  }

  return null;
}

export function buildYouTubeEmbedHtml(inputUrl: string): EmbedTemplateResult {
  const videoId = extractYouTubeVideoId(inputUrl);

  if (!videoId) {
    return { error: "Please enter a valid YouTube video URL." };
  }

  const src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  return {
    html: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;"><iframe src="${escapeAttribute(src)}" title="YouTube video player" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe></div>`,
  };
}

function isTweetUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  const isXOrTwitter = host === "x.com" || host.endsWith(".x.com") || host === "twitter.com" || host.endsWith(".twitter.com");
  if (!isXOrTwitter) {
    return false;
  }

  return /^\/[A-Za-z0-9_]+\/status\/\d+/.test(url.pathname);
}

export function buildTweetEmbedHtml(inputUrl: string): EmbedTemplateResult {
  const url = parseUrl(inputUrl);

  if (!url || !isTweetUrl(url)) {
    return { error: "Please enter a valid Tweet/X post URL." };
  }

  const twitframeUrl = `https://twitframe.com/show?url=${encodeURIComponent(url.toString())}`;

  return {
    html: `<figure style="margin:0;"><iframe src="${escapeAttribute(twitframeUrl)}" title="Embedded tweet" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="width:100%;min-height:560px;border:0;border-radius:12px;"></iframe><figcaption style="margin-top:8px;font-size:12px;opacity:0.7;">Source: <a href="${escapeAttribute(url.toString())}" target="_blank" rel="noopener noreferrer">${escapeText(url.toString())}</a></figcaption></figure>`,
  };
}
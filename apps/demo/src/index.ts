type WorkerEnv = {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

function hasFileExtension(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop() ?? "";
  return lastSegment.includes(".");
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method !== "GET" && request.method !== "HEAD") {
      return env.ASSETS.fetch(request);
    }

    if (!hasFileExtension(pathname) && pathname !== "/") {
      const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
      const htmlPath = `${normalizedPath}.html`;
      const htmlRequest = new Request(`${url.origin}${htmlPath}${url.search}`, request);
      const htmlResponse = await env.ASSETS.fetch(htmlRequest);

      if (htmlResponse.status !== 404) {
        return htmlResponse;
      }
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
  },
};
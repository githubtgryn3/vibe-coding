export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    if (path === "/" || path === "") {
      path = "/index.html";
    }

    const asset = await env.ASSETS.fetch(
      new Request("https://assets.local" + path, request)
    );

    if (asset.status === 404 && path !== "/index.html") {
      const fallback = await env.ASSETS.fetch(
        new Request("https://assets.local/index.html", request)
      );
      if (fallback.status === 200) {
        return new Response(fallback.body, {
          status: 200,
          headers: fallback.headers,
        });
      }
    }

    return asset;
  },
};
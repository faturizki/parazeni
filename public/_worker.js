/**
 * Cloudflare Worker for static site serving
 * Routes all requests to index.html for SPA routing
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Try to serve the requested file
    let response = await env.ASSETS.fetch(request);

    // If 404 and not a static asset, serve index.html for SPA routing
    if (response.status === 404 && !pathname.match(/\.[^\/]+$/)) {
      response = await env.ASSETS.fetch(new Request(new URL('/index.html', url).toString(), request));
    }

    return response;
  },
};

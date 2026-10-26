// On client-side navigations, React Router single fetch calls the loader with
// "/path.data?_routes=..." (or "/_root.data" for "/"). Rebuild the real page URL.
function getPageUrl(request: Request): URL {
  const url = new URL(request.url);
  url.pathname =
    url.pathname === "/_root.data" ? "/" : url.pathname.replace(/\.data$/, "");
  url.searchParams.delete("_routes");
  return url;
}

export { getPageUrl };

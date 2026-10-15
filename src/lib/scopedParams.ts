function useScopedParams(search: string, scope = "") {
  const params = new URLSearchParams(search);
  const prefix = scope ? `${scope}:` : "";

  function applyUpdates(updates: Record<string, string | number | undefined>) {
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(`${prefix}${key}`);
      } else {
        params.set(`${prefix}${key}`, String(value));
      }
    });
  }

  return {
    getParam: (key: string) => params.get(`${prefix}${key}`),
    getScopedSearch: (updates: Record<string, string | number | undefined>) => {
      applyUpdates(updates);
      const search = params.toString();
      return search ? `?${search}` : "";
    },
  };
}

export { useScopedParams };

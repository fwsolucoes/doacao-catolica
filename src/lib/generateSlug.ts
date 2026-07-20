function generateSlug(value: string): string {
  // Remove accents/diacritics
  // eslint-disable-next-line no-misleading-character-class
  let slug = value.normalize("NFD").replace(/[̀-ͯ]/g, "");

  slug = slug
    .replace(/[^\w\s-]/g, "") // remove special chars except hyphens and spaces
    .replace(/\s+/g, "-") // spaces → hyphens
    .toLowerCase();

  slug = slug.replace(/-{2,}/g, "-"); // collapse consecutive hyphens

  slug = slug.replace(/^-+|-+(?=-)/g, ""); // remove leading hyphens (allow trailing while typing)

  return slug;
}

export { generateSlug };

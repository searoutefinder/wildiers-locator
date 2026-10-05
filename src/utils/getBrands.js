  export const getBrandIds = (brands, names) => {
    const idByName = new Map(brands.map((b) => [b.name, b.id]));
    return names.map((name) => idByName.get(name)).filter(Boolean);
  }; 
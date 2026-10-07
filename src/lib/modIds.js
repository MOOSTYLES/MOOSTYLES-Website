export const MOD_ID_PATTERN = /^MOD-\d{4,}$/;

export const formatModId = (number) => `MOD-${String(number).padStart(4, "0")}`;

const idNumber = (id) => Number(id.slice("MOD-".length));

// Mods keep the ID stored in their file. Mods created in the CMS have none, so
// they're numbered after the highest stored ID, oldest dateAdded first. That
// keeps counting in upload order without the CMS having to know the next ID.
export const assignModIds = (mods) => {
  const seen = new Map();
  const unnumbered = [];

  for (const mod of mods) {
    if (!mod.legacyId) {
      unnumbered.push(mod);
      continue;
    }
    if (!MOD_ID_PATTERN.test(mod.legacyId)) {
      throw new Error(`Mod "${mod.slug}" has ID "${mod.legacyId}", expected MOD-####.`);
    }
    if (seen.has(mod.legacyId)) {
      throw new Error(
        `Mods "${seen.get(mod.legacyId)}" and "${mod.slug}" share the ID ${mod.legacyId}.`
      );
    }
    seen.set(mod.legacyId, mod.slug);
  }

  const dateValue = (mod) =>
    mod.dateAdded ? new Date(mod.dateAdded).getTime() : Number.POSITIVE_INFINITY;

  unnumbered.sort((a, b) => dateValue(a) - dateValue(b) || a.slug.localeCompare(b.slug));

  let next = Math.max(0, ...[...seen.keys()].map(idNumber)) + 1;
  for (const mod of unnumbered) {
    mod.legacyId = formatModId(next++);
  }

  return mods;
};

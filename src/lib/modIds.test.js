import { describe, it, expect } from "vitest";
import { assignModIds, formatModId } from "./modIds";

const mod = (slug, legacyId = "", dateAdded = "") => ({ slug, legacyId, dateAdded });

describe("formatModId", () => {
  it("zero-pads to four digits", () => {
    expect(formatModId(1)).toBe("MOD-0001");
    expect(formatModId(123)).toBe("MOD-0123");
  });
});

describe("assignModIds", () => {
  it("keeps stored IDs", () => {
    const mods = assignModIds([mod("a", "MOD-0002"), mod("b", "MOD-0001")]);
    expect(mods.map((m) => m.legacyId)).toEqual(["MOD-0002", "MOD-0001"]);
  });

  it("numbers new mods after the highest stored ID, oldest first", () => {
    const mods = assignModIds([
      mod("newer", "", "2026-10-05T00:00:00Z"),
      mod("existing", "MOD-0032"),
      mod("older", "", "2026-10-01T00:00:00Z"),
    ]);
    expect(Object.fromEntries(mods.map((m) => [m.slug, m.legacyId]))).toEqual({
      newer: "MOD-0034",
      existing: "MOD-0032",
      older: "MOD-0033",
    });
  });

  it("numbers undated new mods last, by slug", () => {
    const mods = assignModIds([mod("b"), mod("a"), mod("dated", "", "2026-10-01T00:00:00Z")]);
    expect(mods.map((m) => m.legacyId)).toEqual(["MOD-0003", "MOD-0002", "MOD-0001"]);
  });

  it("rejects a malformed ID", () => {
    expect(() => assignModIds([mod("a", "archive-001")])).toThrow(/expected MOD-####/);
  });

  it("rejects a duplicate ID", () => {
    expect(() => assignModIds([mod("a", "MOD-0001"), mod("b", "MOD-0001")])).toThrow(
      /share the ID MOD-0001/
    );
  });
});

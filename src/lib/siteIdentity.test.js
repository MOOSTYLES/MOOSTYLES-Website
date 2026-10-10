import { describe, expect, it, vi } from "vitest";
import { getSiteIdentity } from "./siteIdentity";

vi.mock("./mods", () => ({
  getModByAnyId: (id) => ({
    "ardenne-coupe": { collection: " ARDENNE " },
    "classic-chair": { collection: "Halo" },
    "legacy-jet": { collection: "ARDENNE" },
  })[id],
}));

describe("site identity at the brand boundary", () => {
  it.each(["/ardenne", "/ardenne/", "/ardenne/mods"])("recognizes %s as ARDENNE", (pathname) => {
    expect(getSiteIdentity(pathname)).toBe("ardenne");
  });

  it.each(["/", "/home", "/mods", "/support", "/ardenne-other"])("keeps %s on MOOSTYLES", (pathname) => {
    expect(getSiteIdentity(pathname)).toBe("moostyles");
  });

  it("keeps ARDENNE mod details within the ARDENNE identity", () => {
    expect(getSiteIdentity("/mods/ardenne-coupe")).toBe("ardenne");
    expect(getSiteIdentity("/product/legacy-jet/")).toBe("ardenne");
  });

  it("keeps ordinary and missing mod details on MOOSTYLES", () => {
    expect(getSiteIdentity("/mods/classic-chair")).toBe("moostyles");
    expect(getSiteIdentity("/mods/missing")).toBe("moostyles");
  });

  it("handles encoded slugs and malformed addresses safely", () => {
    expect(getSiteIdentity("/mods/ardenne%2Dcoupe")).toBe("ardenne");
    expect(getSiteIdentity("/mods/%E0%A4%A")).toBe("moostyles");
  });
});

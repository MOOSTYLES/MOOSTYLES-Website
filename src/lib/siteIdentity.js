import { getModByAnyId } from "./mods";
import { isArdenneMod } from "./modCatalog";

export function getSiteIdentity(pathname) {
  if (pathname === "/ardenne" || pathname.startsWith("/ardenne/")) return "ardenne";
  const modMatch = pathname.match(/^\/(?:mods|product)\/([^/]+)\/?$/);
  if (modMatch) {
    try {
      const mod = getModByAnyId(decodeURIComponent(modMatch[1]));
      if (mod && isArdenneMod(mod)) return "ardenne";
    } catch {
      // A malformed URL belongs to the normal not-found flow.
    }
  }
  return "moostyles";
}

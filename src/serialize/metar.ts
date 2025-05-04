import { MetarResponse, MetarSerializedKeys } from "../types/metar";

export function serializeMetar(metar: MetarResponse): string {
  const serializedEntries = Object.entries(metar).map(
    ([k, v]) => `${MetarSerializedKeys[k]}: ${v}`,
  );
  return serializedEntries.join("\n");
}

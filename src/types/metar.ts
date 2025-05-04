export interface MetarResponse {
  metar_id: number;
  name: string;
  icaoId: string;
  receiptTime: string;
  obsTime: number;
  reportTime: string;
  temp: number;
  dewp: number;
  wdir: string;
  wspd: number;
  wgst?: number;
  visib: string;
  altim: number;
  rawOb: string;
}

export const MetarSerializedKeys: Record<string, string> = {
  metar_id: "Metar ID",
  name: "Facility Name",
  icaoId: "ICAO ID Code",
  receiptTime: "Receipt Time",
  obsTime: "Observed Time",
  reportTime: "Reported Time",
  temp: "Temperature",
  dewp: "Dewpoint",
  wdir: "Wind Direction",
  wspd: "Wind Speed",
  wgst: "Wind Gust",
  visib: "Visibility",
  altim: "Altimeter",
  rawOb: "Raw Observation",
};

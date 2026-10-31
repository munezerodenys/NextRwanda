export type SectorData = { id: number; name: string; description: string | null; indicators: number };

export type Summary = {
  sectors: number;
  indicators: number;
  measurements: number;
  verified_measurements: number;
  latest_reporting_year: number | null;
  data_sources: string[];
  frameworks: string[];
  sector_data: SectorData[];
};
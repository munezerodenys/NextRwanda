"use client";

import "leaflet/dist/leaflet.css";
import { AlertTriangle, ArrowLeft, MapPin, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ComponentType, useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Measurement = { indicator: string; value: number; unit: string | null; year: number; verification_status: string; district: string | null; province: string | null };
type Analysis = { indicators: { measurements: Measurement[] }[] };
type GeoJsonData = { type: "FeatureCollection"; features: { type: "Feature"; properties?: Record<string, unknown>; geometry: unknown }[] };
type MapLayer = { bindTooltip: (content: string, options: { sticky: boolean }) => void; on: (events: { click: () => void }) => void };

const LeafletMap = MapContainer as unknown as ComponentType<Record<string, unknown>>;
const LeafletTiles = TileLayer as unknown as ComponentType<Record<string, unknown>>;
const LeafletShapes = GeoJSON as unknown as ComponentType<Record<string, unknown>>;

export default function RwandaDistrictMap({ onSelectDistrict }: { onSelectDistrict?: (district: string) => void }) {
  const router = useRouter();
  const [geoJson, setGeoJson] = useState<GeoJsonData | null>(null);
  const [records, setRecords] = useState<Measurement[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [error, setError] = useState("");
  const [boundaryError, setBoundaryError] = useState("");
  const [boundaryLoading, setBoundaryLoading] = useState(true);
  const mapHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    const mapElement = mapHostRef.current?.querySelector(".leaflet-container") as (HTMLElement & { _leaflet_id?: number }) | null;
    if (mapElement) delete mapElement._leaflet_id;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nexrwanda_access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const boundaryController = new AbortController();
    const boundaryTimeout = window.setTimeout(() => boundaryController.abort(), 10000);

    fetch("/geo/rwanda-districts.geojson", { signal: boundaryController.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Rwanda district boundaries could not be loaded.");
        return response.json() as Promise<GeoJsonData>;
      })
      .then(setGeoJson)
      .catch((requestError) => setBoundaryError(requestError.name === "AbortError" ? "Rwanda district boundaries took too long to load." : requestError instanceof Error ? requestError.message : "Rwanda district boundaries could not be loaded."))
      .finally(() => {
        window.clearTimeout(boundaryTimeout);
        setBoundaryLoading(false);
      });

    fetch(`${apiUrl}/api/v1/intelligence/analyze`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({}) })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("nexrwanda_access_token");
          router.replace("/login");
          return null;
        }
        if (!response.ok) throw new Error("District measurements are currently unavailable.");
        return response.json() as Promise<Analysis>;
      })
      .then((analysis) => setRecords(analysis?.indicators.flatMap((indicator) => indicator.measurements.filter((record) => record.district)) ?? []))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "District measurements are currently unavailable."));

    return () => {
      boundaryController.abort();
      window.clearTimeout(boundaryTimeout);
    };
  }, [router]);

  const selectedRecords = records.filter((record) => record.district?.toLowerCase() === selectedDistrict.toLowerCase());

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#12233f]">
      <header className="border-b border-[#dfe5ee] bg-[#102542] text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10"><Link href="/dashboard/innovations" className="text-sm font-bold uppercase tracking-[0.2em]">NexRwanda</Link><Link href="/dashboard/innovations" className="text-sm text-[#d9e4f3]">All innovations</Link></div></header>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Link href="/dashboard/innovations" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563a6]"><ArrowLeft size={16} /> All innovations</Link>
        <div className="mt-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4c7cae]">Geographic intelligence</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Rwanda Development Gap Map</h1><p className="mt-3 max-w-2xl text-[#5d6b7d]">Select a district to inspect connected development measurements. Missing measurements are never treated as poor performance.</p></div>
        {error && <div className="mt-6 flex items-center gap-3 border border-[#efc5bf] bg-[#fff4f2] p-4 text-[#9b3d2c]"><AlertTriangle size={18} /> {error}<button className="ml-auto" onClick={() => window.location.reload()}><RefreshCw size={17} /></button></div>}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.75fr]">
                    <div ref={mapHostRef} className="overflow-hidden border border-[#dfe5ee] bg-white"><div className="h-[620px]">{geoJson ? <LeafletMap center={[-1.94, 29.87]} zoom={8} scrollWheelZoom className="h-full w-full"><LeafletTiles attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><LeafletShapes data={geoJson as never} style={() => ({ color: "#2563a6", weight: 1.5, fillColor: "#69a879", fillOpacity: 0.35 })} onEachFeature={(feature: { properties?: Record<string, unknown> }, layer: MapLayer) => { const properties = feature.properties; const district = String(properties?.NAME_2 ?? properties?.name ?? properties?.district ?? "Unknown district"); layer.bindTooltip(district, { sticky: true }); layer.on({ click: () => { setSelectedDistrict(district); onSelectDistrict?.(district); } }); }} /></LeafletMap> : <div className="flex h-full items-center justify-center p-8 text-center text-[#64748b]">{boundaryLoading ? "Loading Rwanda district boundaries..." : boundaryError || "Rwanda district boundaries are unavailable."}</div>}</div><p className="border-t border-[#e8edf3] px-4 py-3 text-xs text-[#64748b]">Boundary source: GADM Rwanda level-2 administrative dataset. Boundary presence does not imply development measurements are available.</p></div>
          <aside className="border border-[#dfe5ee] bg-white p-6"><div className="flex items-center gap-2 text-[#2563a6]"><MapPin size={19} /><p className="font-bold">District details</p></div>{selectedDistrict ? <><h2 className="mt-5 text-2xl font-bold">{selectedDistrict}</h2>{selectedRecords.length ? <div className="mt-5 space-y-4">{selectedRecords.map((record, index) => <div className="border-t border-[#e8edf3] pt-4" key={`${record.indicator}-${record.year}-${index}`}><p className="font-semibold">{record.indicator}</p><p className="mt-1 text-2xl font-bold text-[#2563a6]">{record.value} <span className="text-sm font-normal text-[#64748b]">{record.unit}</span></p><p className="mt-1 text-xs text-[#64748b]">{record.year} · {record.verification_status}</p></div>)}</div> : <p className="mt-5 border-l-4 border-[#d78d4d] bg-[#fff8ef] p-4 text-sm leading-6 text-[#6b5b4a]">No verified district-level development measurements are connected for this district.</p>}</> : <p className="mt-5 text-sm leading-6 text-[#64748b]">Choose a district on the map to inspect its available records.</p>}</aside>
        </div>
      </div>
    </main>
  );
}

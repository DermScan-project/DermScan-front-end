"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Leaflet's default marker icons don't load correctly with bundlers unless fixed manually
const patientIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#DC2626;border:3px solid white;box-shadow:0 0 0 2px #DC2626;"></div>`,
  iconSize: [14, 14],
});
const medecinIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#16A34A;border:3px solid white;box-shadow:0 0 0 2px #16A34A;"></div>`,
  iconSize: [12, 12],
});

interface MapMedecin {
  id: string;
  nomComplet: string;
  cabinetLat: number | null;
  cabinetLng: number | null;
}

// Fits the map view to the patient + all médecin markers whenever they change.
function FitBounds({
  patientCoords,
  points,
}: {
  patientCoords: { lat: number; lng: number };
  points: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [patientCoords.lat, patientCoords.lng],
      ...points.map((p) => [p.lat, p.lng] as [number, number]),
    ]);

    if (points.length === 0) {
      map.setView([patientCoords.lat, patientCoords.lng], 14);
      return;
    }

    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
  }, [map, patientCoords.lat, patientCoords.lng, JSON.stringify(points)]);

  return null;
}

export default function MedecinMap({
  patientCoords,
  medecins,
}: {
  patientCoords: { lat: number; lng: number };
  medecins: MapMedecin[];
}) {
  const validMedecins = medecins.filter((m) => m.cabinetLat !== null && m.cabinetLng !== null);

  return (
   <div className="relative isolate z-0 rounded-2xl overflow-hidden border border-ardoise/10 h-64">
      <MapContainer center={[patientCoords.lat, patientCoords.lng]} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitBounds
          patientCoords={patientCoords}
          points={validMedecins.map((m) => ({ lat: m.cabinetLat!, lng: m.cabinetLng! }))}
        />
        <Marker position={[patientCoords.lat, patientCoords.lng]} icon={patientIcon}>
          <Tooltip permanent direction="top" offset={[0, -8]} className="!bg-white !text-[#DC2626] !font-medium !text-xs !border-none !shadow-sm !rounded-md !px-2 !py-1">
            Votre position
          </Tooltip>
          <Popup>Votre position</Popup>
        </Marker>
        {validMedecins.map((m) => (
          <Marker key={m.id} position={[m.cabinetLat!, m.cabinetLng!]} icon={medecinIcon}>
            <Tooltip permanent direction="top" offset={[0, -6]} className="!bg-white !text-[#16A34A] !font-medium !text-xs !border-none !shadow-sm !rounded-md !px-2 !py-1">
              Dr. {m.nomComplet}
            </Tooltip>
            <Popup>Dr. {m.nomComplet}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
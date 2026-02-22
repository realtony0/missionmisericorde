"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MarkerData = { id: string; lat: number; lng: number; name: string };

export default function Map({ markers }: { markers: MarkerData[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([14.5, -15.5], 6);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);

    return () => {
      markersLayer.current?.clearLayers();
      markersLayer.current = null;

      try {
        map.remove();
      } catch {
        // Defensive cleanup for strict mode / rapid route transitions.
      }

      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const layer = markersLayer.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const icon = L.divIcon({
      className: "custom-marker",
      html: "<span style='background:#1B6B3A;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px'>●</span>",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    markers.forEach((m) => {
      L.marker([m.lat, m.lng], { icon }).bindPopup(m.name).addTo(layer);
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.2), { maxZoom: 12 });
    } else {
      map.setView([14.5, -15.5], 6);
    }
  }, [markers]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-xl overflow-hidden bg-primary/5" />;
}

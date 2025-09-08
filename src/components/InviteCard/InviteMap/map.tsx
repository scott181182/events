"use client";

import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Event } from "../../../payload-types";

export interface InviteMapProps {
  mapEmbedUrl?: string;
  meetCoordinates?: Event["meetCoordinates"];
  mapOptions?: Event["mapOptions"];
  className?: string;
}

export function InviteMap({ mapEmbedUrl, meetCoordinates, mapOptions, className }: Readonly<InviteMapProps>) {
  if (!meetCoordinates?.latitude || !meetCoordinates?.longitude) {
    return (
      mapEmbedUrl && (
        <iframe
          title="Map"
          src={mapEmbedUrl}
          className="w-full min-h-32"
          style={{ border: "1px solid black" }}
        ></iframe>
      )
    );
  }

  const center = (mapOptions?.center as LatLngTuple) ?? [meetCoordinates.latitude, meetCoordinates.longitude];

  return (
    <MapContainer center={center} zoom={mapOptions?.zoom ?? 14} className={className}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[meetCoordinates.latitude, meetCoordinates.longitude]}>
        <Popup>Meeting Spot</Popup>
      </Marker>
    </MapContainer>
  );
}

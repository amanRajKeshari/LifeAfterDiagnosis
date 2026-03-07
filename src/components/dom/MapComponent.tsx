'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DonationRequest } from '@/services/api';

// Create pulsating red icon for patients
const pulseIcon = new L.DivIcon({
    className: 'custom-pulse-icon',
    html: `<div style="
    width: 20px; 
    height: 20px; 
    background: #FF2E63; 
    border-radius: 50%; 
    box-shadow: 0 0 0 rgba(255,46,99, 0.4); 
    animation: pulse-ring 2s infinite;
    border: 2px solid white;
  "></div>
  <style>
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(255,46,99, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(255,46,99, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255,46,99, 0); }
    }
  </style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// Create blue icon for user location
const userIcon = new L.DivIcon({
    className: 'user-location-icon',
    html: `<div style="
    width: 16px; 
    height: 16px; 
    background: #08D9D6; 
    border-radius: 50%; 
    border: 2px solid white;
    box-shadow: 0 0 10px rgba(8,217,214, 0.8);
  "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

const INDIA_BOUNDS: L.LatLngBoundsExpression = [
    [6.753515, 68.162386], // Southwest
    [35.503922, 97.395555] // Northeast
];
const INDIA_CENTER: LatLngTuple = [20.5937, 78.9629];

// Component to auto-fit bounds based on requests
function MapAutoFit({ requests, userPos }: { requests: DonationRequest[], userPos: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        if (requests.length === 0 && !userPos) return;

        const bounds = L.latLngBounds([]);
        if (userPos) bounds.extend(userPos);

        requests.forEach(req => {
            const anyReq = req as any;
            if (anyReq.hospitalId?.location?.coordinates) {
                bounds.extend([anyReq.hospitalId.location.coordinates[0], anyReq.hospitalId.location.coordinates[1]]);
            } else {
                // Mock coordinates in India
                bounds.extend([20.5937 + (Math.random() - 0.5) * 5, 78.9629 + (Math.random() - 0.5) * 5]);
            }
        });

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        }
    }, [requests, userPos, map]);

    return null;
}

export default function MapComponent({
    requests,
    selectedId,
    onSelect,
    userLocation
}: {
    requests: DonationRequest[],
    selectedId: string | null,
    onSelect: (r: DonationRequest) => void,
    userLocation: [number, number] | null
}) {
    return (
        <MapContainer
            center={userLocation || INDIA_CENTER}
            zoom={5}
            minZoom={4}
            maxBounds={INDIA_BOUNDS}
            maxBoundsViscosity={1.0}
            style={{ width: '100%', height: '100%', zIndex: 10, background: '#0A0A0F' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                    <Popup className="dark-popup"><div className="text-black font-bold text-sm">You are here</div></Popup>
                </Marker>
            )}

            {requests.map(req => {
                // Generate mock coords if not populated, pinned by ID to prevent jumping
                const seed = req._id.charCodeAt(req._id.length - 1) % 10;
                const lat = 20.5937 + ((seed - 5) * 1.5);
                const lng = 78.9629 + ((seed - 5) * 2.0);

                return (
                    <Marker
                        key={req._id}
                        position={[lat, lng]}
                        icon={pulseIcon}
                        eventHandlers={{
                            click: () => onSelect(req)
                        }}
                    >
                        {/* We'll handle custom popup externally using HTML overlay for better framer motion styling, 
                but keeping basic popup just in case */}
                    </Marker>
                );
            })}

            <MapAutoFit requests={requests} userPos={userLocation} />
        </MapContainer>
    );
}

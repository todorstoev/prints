import React, { useRef } from 'react'
import { Icon, LocationEvent } from 'leaflet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

type MouseProps = {
    getLoc: (e: LocationEvent) => void
}

export const LocationMap: React.FC<MouseProps> = ({ getLoc }) => {
    const location = {
        lat: 51.505,
        lng: -0.09,
    }

    const mapRef = useRef(null)

    const handleClick = () => {
        const map: any = mapRef.current

        if (map != null) {
            map.leafletElement.locate()
        }
    }

    const markerIcon = new Icon({
        iconUrl: './assets/marker.svg',
        iconRetinaUrl: './assets/marker.svg',
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    })
    return (
        <>
            <Map
                center={location}
                length={4}
                onClick={handleClick}
                onLocationfound={getLoc}
                ref={mapRef}
                zoom={13}
                style={{ height: '100%' }}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={location} icon={markerIcon}>
                    <Popup>You are here</Popup>
                </Marker>
            </Map>
        </>
    )
}

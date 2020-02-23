import React from 'react'

import { Icon, LeafletMouseEvent } from 'leaflet'
import { Map as LeafletMap, Marker, TileLayer } from 'react-leaflet'

import { Coords } from '../types'

type MapProps = {
    center: Coords
    zoom: number
    onClick?: (e: LeafletMouseEvent) => void
}

type MapMarkerProps = {
    position: Coords
}

export const Map: React.FC<MapProps> = props => {
    const { center, zoom, onClick, children } = props

    return (
        <LeafletMap
            style={{ height: '100%' }}
            center={center}
            zoom={zoom}
            onclick={onClick}
        >
            <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />

            {children}
        </LeafletMap>
    )
}

export const MapMarker: React.FC<MapMarkerProps> = props => {
    const { position, children } = props

    const icon = new Icon({
        iconUrl: './assets/marker.svg',
        iconRetinaUrl: './assets/marker.svg',
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    })

    return (
        <Marker position={position} onClick={() => console.log('test')}>
            {children} icon={icon}
        </Marker>
    )
}

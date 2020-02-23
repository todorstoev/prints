import React from 'react'

import { Icon, LeafletMouseEvent } from 'leaflet'
import { Marker } from 'react-leaflet'

import { Coords } from '../types'

type MapMarkerProps = {
    position: Coords
    onClick?: (e: LeafletMouseEvent) => void
}

const MapMarker: React.FC<MapMarkerProps> = props => {
    const { position, children } = props

    const icon = new Icon({
        iconUrl: './assets/marker.svg',
        iconRetinaUrl: './assets/marker.svg',
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    })

    return (
        <Marker
            position={position}
            icon={icon}
            onClick={() => console.log('test')}
        >
            {children}
        </Marker>
    )
}

export default MapMarker

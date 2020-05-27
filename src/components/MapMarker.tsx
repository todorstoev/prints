import React from 'react'

import { Icon, LeafletMouseEvent } from 'leaflet'
import { Marker } from 'react-leaflet'

import { Coords } from '../types'

type MapMarkerProps = {
    position: Coords
    icon?: Icon
    onClick?: (e: LeafletMouseEvent) => void
}

const MapMarker: React.FC<MapMarkerProps> = props => {
    const { position, icon, onClick, children } = props

    const defaultIcon = new Icon({
        iconUrl: './assets/default-location-pin-icon.svg',
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    })

    return (
        <Marker
            position={position}
            icon={icon || defaultIcon}
            onClick={onClick}
        >
            {children}
        </Marker>
    )
}

export default MapMarker

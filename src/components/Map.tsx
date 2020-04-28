import React from 'react'

import { LeafletMouseEvent } from 'leaflet'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'

import { Coords } from '../types'

type MapProps = {
    center: Coords
    zoom: number
    onClick?: (e: LeafletMouseEvent) => void
}

const Map: React.FC<MapProps> = props => {
    const { center, zoom, onClick, children } = props

    return (
        <LeafletMap
            style={{ height: '100%' }}
            center={center}
            zoom={zoom}
            onclick={onClick}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />

            {children}
        </LeafletMap>
    )
}

export default Map

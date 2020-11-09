import React from 'react'

import { LeafletMouseEvent } from 'leaflet'
import { Map as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet'

import { Coords } from '../types'

type MapProps = {
    controls: boolean
    center: Coords
    zoom: number
    dragging: boolean
    onClick?: (e: LeafletMouseEvent) => void
}

const Map: React.FC<MapProps> = (props) => {
    const { center, zoom, onClick, children, controls, dragging } = props

    return (
        <LeafletMap
            style={{ height: '100%' }}
            center={center}
            zoom={zoom}
            onclick={onClick}
            zoomControl={false}
            dragging={dragging}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />

            {children}
            {controls && <ZoomControl position={'bottomleft'} />}
        </LeafletMap>
    )
}

export default Map

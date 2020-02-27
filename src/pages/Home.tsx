import React from 'react'

import { Icon } from 'leaflet'
import { Popup } from 'react-leaflet'
import { Box, Text, Link } from 'rebass'

import { Coords } from '../types'
import { getDevices } from '../utils/db'
import { getUserLocation } from '../utils/location'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'

type DeviceMarker = {
    brand: string
    model: string
    type: string
    material: string[]
    location: Coords
}

type HomeProps = {}

type HomeState = {
    mapCenter: Coords
    mapZoom: number
    mapMarkers: DeviceMarker[]
}

const DeviceMarkerPopup: React.FC<DeviceMarker> = props => {
    const { model, type, material } = props

    return (
        <Popup>
            <Box>
                <Text>Model: {model}</Text>
                <Text>Type: {type}</Text>
                <Text>Materials: {material.join(', ')}</Text>
                <Link href="#">See more</Link>
            </Box>
        </Popup>
    )
}

export class Home extends React.Component<HomeProps, HomeState> {
    readonly state: HomeState = {
        mapCenter: { lat: 0, lng: 0 },
        mapZoom: 13,
        mapMarkers: [],
    }

    componentDidMount() {
        getUserLocation().then(location => {
            this.setState({ mapCenter: location })
        })

        getDevices().then(devices => {
            const mapMarkers = devices.map(device => {
                const { brand, model, type, material, location } = device

                return { brand, model, type, material, location }
            })

            this.setState({ mapMarkers })
        })
    }

    render() {
        const { mapCenter, mapZoom, mapMarkers } = this.state

        const deviceIcon = new Icon({
            iconUrl: './assets/device-location-pin-icon.svg',
            iconAnchor: [20, 40],
            popupAnchor: [0, -35],
            iconSize: [40, 40],
        })

        return (
            <div style={{ height: '100vh' }}>
                <Map center={mapCenter} zoom={mapZoom}>
                    {mapMarkers.map((marker, index) => (
                        <MapMarker
                            key={index}
                            position={marker.location}
                            icon={deviceIcon}
                        >
                            <DeviceMarkerPopup {...marker} />
                        </MapMarker>
                    ))}
                </Map>
            </div>
        )
    }
}

export default Home

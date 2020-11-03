import React from 'react'

import { Icon } from 'leaflet'
import { Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { Box, Text } from 'rebass'

import { Link } from 'react-router-dom'

import { Coords, Device } from '../types'
import { getUserLocation } from '../shared/helpers'
import { getDevicesService } from '../shared/services'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'
import { Subscription } from 'rxjs'

type HomeProps = {}

type HomeState = {
    mapCenter: Coords
    mapZoom: number
    mapMarkers: Device[]
}

const DeviceMarkerPopup: React.FC<Device> = device => {
    const { model, type, materials } = device

    return (
        <Popup>
            <Box>
                <Text>Model: {model}</Text>
                <Text>Type: {type}</Text>
                <Text>Materials: {materials.join(', ')}</Text>
                <Link to={{ pathname: '/messages', state: device }}>
                    Message
                </Link>
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

    subscription: Subscription | undefined

    componentDidMount() {
        getUserLocation().then(location => {
            this.setState({ mapCenter: location })
        })

        const observable = getDevicesService()

        this.subscription = observable.subscribe({
            next: snapshot => {
                this.setState({ mapMarkers: snapshot })
            },
        })
    }

    componentWillUnmount() {
        this.subscription?.unsubscribe()
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
            <Box height={'100%'}>
                <Map center={mapCenter} zoom={mapZoom}>
                    <MarkerClusterGroup>
                        {mapMarkers.map((marker, index) => {
                            return (
                                <MapMarker
                                    key={index}
                                    position={marker.location}
                                    icon={deviceIcon}
                                >
                                    {marker && (
                                        <DeviceMarkerPopup {...marker} />
                                    )}
                                </MapMarker>
                            )
                        })}
                    </MarkerClusterGroup>
                </Map>
            </Box>
        )
    }
}

export default Home

import React from 'react'
import { useSelector } from 'react-redux'

import { Icon } from 'leaflet'
import { Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { Box, Text } from 'rebass'

import { Link } from 'react-router-dom'

import { Coords, Device, PrintsUser, RootState } from '../types'
import { getUserLocation } from '../shared/helpers'
import { getDevicesService } from '../shared/services'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'

type HomeProps = {}

type HomeState = {
    mapCenter: Coords
    mapZoom: number
    mapMarkers: Device[]
}

const DeviceMarkerPopup: React.FC<Device> = (device) => {
    const user = useSelector<RootState, PrintsUser>((state) => state.auth.user)

    const { model, type, materials, prestige } = device

    return (
        <Popup>
            <Box>
                <Text>Model: {model}</Text>
                <Text>Type: {type}</Text>
                <Text>Materials: {materials.join(', ')}</Text>
                <Text>Prestige: {prestige}</Text>
                {user.uid !== device.id && (
                    <Link to={{ pathname: '/messages', state: device }}>
                        Message
                    </Link>
                )}
                {user.uid === device.id && (
                    <Text>This device belongs to you</Text>
                )}
            </Box>
        </Popup>
    )
}

export class Home extends React.Component<HomeProps, HomeState> {
    mounted: boolean = false

    readonly state: HomeState = {
        mapCenter: { lat: 0, lng: 0 },
        mapZoom: 13,
        mapMarkers: [],
    }

    componentDidMount() {
        this.mounted = true

        getUserLocation().then((location) => {
            if (this.mounted) this.setState({ mapCenter: location })
        })

        getDevicesService().then((devices) => {
            if (this.mounted) this.setState({ mapMarkers: devices })
        })
    }

    componentWillUnmount() {
        this.mounted = false
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

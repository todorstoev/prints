import React, { useRef } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { RootState, AuthState } from '../types'
import { Flex, Box, Heading } from 'rebass'
import { Label, Input, Select } from '@rebass/forms'
import { Icon } from 'leaflet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

const mapState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Devices: React.FC<PropsFromRedux> = () => {
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

    const handleLocationFound = (e: Object) => {
        console.log(e)
    }

    const markerIcon = new Icon({
		iconUrl: './assets/marker.svg',
		iconRetinaUrl: './assets/marker.svg',
		iconAnchor: [20, 40],
		popupAnchor: [0, -35],
		iconSize: [40, 40]
	});

    return (
        <Flex mx={2} mb={3}>
            <Box width={1 / 2}>
                <Heading>Fill your Device</Heading>
            </Box>

            <Box width={1 / 2} px={2}>
                <Box width={1 / 1} px={2}>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                        id="brand"
                        name="brand"
                        defaultValue="Your Printer Brand"
                    />
                </Box>
                <Box width={1 / 1} px={2}>
                    <Label htmlFor="type">Type</Label>
                    <Input
                        id="type"
                        name="type"
                        defaultValue="Your Printer Type"
                    />
                </Box>
                <Box width={1 / 1} px={2}>
                    <Label htmlFor="name">Dimension</Label>
                    <Flex>
                        <Box width={1 / 3} pr={1}>
                            <Input id="name" name="name" defaultValue="width" />
                        </Box>
                        <Box width={1 / 3} pr={1}>
                            <Input
                                id="name"
                                name="name"
                                defaultValue="height"
                            />
                        </Box>

                        <Box width={1 / 3}>
                            <Input
                                id="name"
                                name="name"
                                defaultValue="lenght"
                            />
                        </Box>
                    </Flex>
                </Box>
                <Box width={1 / 1} px={2}>
                    <Label htmlFor="material">Material</Label>
                    <Select id="material" name="material" defaultValue="NYC">
                        <option>NYC</option>
                        <option>DC</option>
                        <option>ATX</option>
                    </Select>
                </Box>
                <Box width={1 / 1} px={2} height={500}>
                    {' '}
                    <Map
                        center={location}
                        length={4}
                        onClick={handleClick}
                        onLocationfound={handleLocationFound}
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
                </Box>
            </Box>
        </Flex>
    )
}

export default connector(Devices)

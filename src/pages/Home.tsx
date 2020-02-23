import React from 'react'

import { Coords } from '../types'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'

const MOCKS = {
    center: {
        lat: 42.69693239404586,
        lng: 23.321554719216266,
    },
    zoom: 13,
    markers: [
        {
            uid: 'qwerty123',
            position: { lat: 42.696390680938606, lng: 23.275898255875127 },
        },
        {
            uid: 'qwerty223',
            position: { lat: 42.68617057353356, lng: 23.283278722974835 },
        },
        {
            uid: 'qwerty323',
            position: { lat: 42.68516108896059, lng: 23.36686680384834 },
        },
        {
            uid: 'qwerty423',
            position: { lat: 42.7059783882962, lng: 23.36068780813697 },
        },
        {
            uid: 'qwerty523',
            position: { lat: 42.71682585050188, lng: 23.30147243256948 },
        },
        {
            uid: 'qwerty623',
            position: { lat: 42.70951032831949, lng: 23.271950564170634 },
        },
        {
            uid: 'qwerty723',
            position: { lat: 42.68124918129858, lng: 23.33253904989618 },
        },
        {
            uid: 'qwerty823',
            position: { lat: 42.687810950977585, lng: 23.24242869577175 },
        },
        {
            uid: 'qwerty923',
            position: { lat: 42.71506011375391, lng: 23.39020967653581 },
        },
        {
            uid: 'qwerty102',
            position: { lat: 42.725030303811195, lng: 23.31228567506441 },
        },
        {
            uid: 'qwerty103',
            position: { lat: 42.71948499961, lng: 23.22423498617711 },
        },
        {
            uid: 'qwerty104',
            position: { lat: 42.71961103475512, lng: 23.3898663989963 },
        },
    ],
}

type DeviceMarker = {
    uid: string
    position: Coords
}

type HomeProps = {}

type HomeState = {
    mapCenter: Coords
    mapZoom: number
    mapMarkers: DeviceMarker[]
}

export class Home extends React.Component<HomeProps, HomeState> {
    readonly state: HomeState = {
        mapCenter: MOCKS.center,
        mapZoom: MOCKS.zoom,
        mapMarkers: MOCKS.markers,
    }

    render() {
        const { mapCenter, mapZoom, mapMarkers } = this.state

        return (
            <div style={{ height: '100vh' }}>
                <Map center={mapCenter} zoom={mapZoom}>
                    {mapMarkers.map(marker => (
                        <MapMarker
                            key={marker.uid}
                            position={marker.position}
                        />
                    ))}
                </Map>
            </div>
        )
    }
}

export default Home

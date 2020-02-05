import React, { useRef, useEffect, useState } from 'react'
import { Icon, LocationEvent } from 'leaflet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { Cords } from '../types'

type MouseProps = {
    getLoc: (e: LocationEvent) => void
}

const getLocationByIpAddress = (): Promise<Cords | Cords> => {
    return new Promise(resolve => {
        fetch('https://ipapi.co/json')
            .then(res => res.json())
            .then(location =>
                resolve({
                    lat: location.latitude,
                    lng: location.longitude,
                })
            )
    })
}

const getUserLocation = (): Promise<Cords | any> => {
    return new Promise(resolve =>
        navigator.geolocation.getCurrentPosition(
            location =>
                resolve({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                }),
            () => resolve(getLocationByIpAddress())
        )
    )
}

export const LocationMap: React.FC<MouseProps> = ({ getLoc }) => {
    const [cords, setCords] = useState<Cords>({
        lat: 0,
        lng: 0,
    })

    const [markerCords, setMarkerCords] = useState<Cords>({
        lat: 0,
        lng: 0,
    })

    useEffect(() => {
        if (cords.lat === 0 && cords.lng === 0) {
            getUserLocation().then(res => {
                setCords(res)
                setMarkerCords(res)
            })
        }
    }, [cords])

    const mapRef = useRef(null)

    const handleClick = (e: LocationEvent) => {
        setMarkerCords(e.latlng)
        getLoc(e)
        // const map: any = mapRef.current

        // if (map != null) {
        //     debugger
        //     map.leafletElement.locate()
        // }
    }

    // const onLocationfound = (e: LocationEvent) => {
    //     setCords(e.latlng)
    //     debugger
    // }

    const markerIcon = new Icon({
        iconUrl: './assets/marker.svg',
        iconRetinaUrl: './assets/marker.svg',
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [30, 30],
    })

    return (
        <>
            <Map
                center={cords}
                length={4}
                onClick={handleClick}
                // onLocationfound={onLocationfound}
                ref={mapRef}
                zoom={13}
                style={{ height: '100%' }}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerCords} icon={markerIcon}>
                    <Popup>You are here</Popup>
                </Marker>
            </Map>
        </>
    )
}

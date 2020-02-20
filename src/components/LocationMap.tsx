import React, { useRef, useEffect, useState } from 'react'
import { Icon, LocationEvent } from 'leaflet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { Coords } from '../types'

type MouseProps = {
    getLoc?: (e: LocationEvent) => void
    startCoords?: Coords
}

const getLocationByIpAddress = (): Promise<Coords | Coords> => {
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

const getUserLocation = (): Promise<Coords | any> => {
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

export const LocationMap: React.FC<MouseProps> = ({ getLoc, startCoords }) => {
    const [Coords, setCoords] = useState<Coords>({
        lat: 0,
        lng: 0,
    })

    const [markerCoords, setMarkerCoords] = useState<Coords>({
        lat: 0,
        lng: 0,
    })

    useEffect(() => {
        if (Coords.lat === 0 && Coords.lng === 0) {
            getUserLocation().then(res => {
                setCoords(res)
                setMarkerCoords(res)
            })
        }
    }, [Coords.lat, Coords.lng])

    const mapRef = useRef(null)

    const handleClick = (e: LocationEvent) => {
        setMarkerCoords(e.latlng)
        getLoc && getLoc(e)
        // const map: any = mapRef.current

        // if (map != null) {
        //     debugger
        //     map.leafletElement.locate()
        // }
    }

    // const onLocationfound = (e: LocationEvent) => {
    //     setCoords(e.latlng)
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
                center={startCoords || Coords}
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
                <Marker position={markerCoords} icon={markerIcon}>
                    <Popup>You are here</Popup>
                </Marker>
            </Map>
        </>
    )
}

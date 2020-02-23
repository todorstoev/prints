import { Coords } from '../types'

const getLocationByIpAddress = (): Promise<Coords> => {
    return new Promise<Coords>(resolve => {
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

export const getUserLocation = (): Promise<Coords> => {
    return new Promise<Coords>(resolve =>
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

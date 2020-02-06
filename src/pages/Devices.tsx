import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RootState, AuthState, Device, Cords } from '../types'
import { Flex, Box, Heading, Button, Text, Card } from 'rebass'
import { Label, Input, Select } from '@rebass/forms'
import { LocationMap } from '../components/LocationMap'
import firebase, { db, myFirebase } from '../firebase/firebase'

const authState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(authState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Devices: React.FC<PropsFromRedux> = ({ user }) => {
    const { register, handleSubmit, errors } = useForm()
    const [cords, setCords] = useState<Cords>({
        lat: 0,
        lng: 0,
    })
    const [devices, setDevices] = useState<Array<Device>>([])

    useEffect(() => {
        db.collection('devices').onSnapshot(snapshot => {
            let deviceBuffer: Array<Device> = []
            snapshot.forEach(doc => {
                deviceBuffer.push(doc.data() as Device)
            })
            setDevices(deviceBuffer)
        })
    }, [cords])

    const onSubmit = (data: any) => {
        const device: Device = {
            dimension: {
                width: data.width,
                height: data.height,
                lenght: data.lenght,
            },
            location: new firebase.firestore.GeoPoint(cords.lat, cords.lng),
            brand: data.brand,
            material: data.material,
            type: data.type,
            uid: user.uid,
        }

        db.collection('devices')
            .add(device)
            .then(snapshot => {
                console.log(snapshot)
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <Flex mx={2} mb={3}>
            <Box width={1 / 2} className={'left-side'}>
                <Box width={1 / 1} px={2}>
                    <Heading>Your Devices</Heading>
                    {devices.length <= 0 && (
                        <Text>You have no devices added</Text>
                    )}
                </Box>
                <Box width={1 / 1} px={2}>
                    {devices.length > 0 &&
                        devices.map((device: Device, i) => (
                            <Card key={i} width={'auto'}>
                                <Box width={1 / 2}>
                                    <Heading>Device</Heading>
                                    <Text>Brand: {device.brand}</Text>
                                    <Text>Type: {device.type}</Text>
                                    <Text>
                                        Dimension: {device.dimension.height} /{' '}
                                        {device.dimension.width} /{' '}
                                        {device.dimension.lenght}
                                    </Text>
                                    <Text>Мaterial: {device.material}</Text>
                                </Box>
                                <Box width={1 / 2}>
                                    <LocationMap />
                                </Box>
                            </Card>
                        ))}
                </Box>
            </Box>

            <Box width={1 / 2} px={2} className={'right-side'}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box width={1 / 1} px={2}>
                        <Heading>Add new device</Heading>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            name="brand"
                            ref={register({ required: true })}
                        />
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            name="type"
                            ref={register({ required: true })}
                        />
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="width">Dimension</Label>
                        <Flex>
                            <Box width={1 / 3} pr={1}>
                                <Input
                                    id="width"
                                    name="width"
                                    ref={register({ required: true })}
                                />
                            </Box>
                            <Box width={1 / 3} pr={1}>
                                <Input
                                    id="height"
                                    name="height"
                                    ref={register({ required: true })}
                                />
                            </Box>

                            <Box width={1 / 3}>
                                <Input
                                    id="lenght"
                                    name="lenght"
                                    ref={register({ required: true })}
                                />
                            </Box>
                        </Flex>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="material">Material</Label>
                        <Select
                            name="material"
                            ref={register({ required: true })}
                        >
                            <option>ABS</option>
                            <option>PLA</option>r<option>PETG</option>
                        </Select>
                    </Box>
                    <Box width={1 / 1} px={2} height={500}>
                        <LocationMap
                            getLoc={e => {
                                setCords(e.latlng)
                            }}
                        ></LocationMap>
                    </Box>
                    <Button variant="primary" mr={2} type={'submit'}>
                        Add Device
                    </Button>
                </form>
            </Box>
        </Flex>
    )
}

export default connector(Devices)

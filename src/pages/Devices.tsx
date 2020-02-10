import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RootState, AuthState, Device, Cords } from '../types'
import { Flex, Box, Heading, Button, Text, Card } from 'rebass'
import { Label, Input, Select } from '@rebass/forms'
import { LocationMap } from '../components/LocationMap'
import firebase, { db } from '../firebase/firebase'

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
    console.log(errors)
    useEffect(() => {
        db.collection('devices')
            .where('uid', '==', user.uid)
            .onSnapshot(snapshot => {
                let deviceBuffer: Array<Device> = []
                snapshot.forEach(doc => {
                    deviceBuffer.push(doc.data() as Device)
                })
                setDevices(deviceBuffer)
            })
    }, [user.uid])

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
                            <Card key={i} width={'auto'} marginY={10}>
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
                            sx={{
                                ':focus': {
                                    borderColor: errors.brand
                                        ? 'error'
                                        : 'primary',
                                },
                                borderColor: errors.brand ? 'error' : 'gray',
                            }}
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'This fields is required',
                                },
                            })}
                        />
                        <Text color={'error'}>
                            {errors.brand && 'Brand is required'}
                        </Text>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="model">Model</Label>
                        <Input
                            id="model"
                            name="model"
                            sx={{
                                ':focus': {
                                    borderColor: errors.model
                                        ? 'error'
                                        : 'gray',
                                },
                                borderColor: errors.model ? 'error' : 'gray',
                            }}
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'This fields is required',
                                },
                            })}
                        />
                        <Text color={'error'}>
                            {errors.model && 'Model is required'}
                        </Text>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            name="type"
                            sx={{
                                ':focus': {
                                    borderColor: errors.type ? 'error' : 'gray',
                                },
                                borderColor: errors.type ? 'error' : 'gray',
                            }}
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'This fields is required',
                                },
                            })}
                        />
                        <Text color={'error'}>
                            {errors.type && 'Type is required'}
                        </Text>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="width">Dimension</Label>
                        <Flex>
                            <Box width={1 / 3} pr={1}>
                                <Input
                                    id="width"
                                    name="width"
                                    sx={{
                                        ':focus': {
                                            borderColor: errors.width
                                                ? 'error'
                                                : 'gray',
                                        },
                                        borderColor: errors.width
                                            ? 'error'
                                            : 'gray',
                                    }}
                                    ref={register({
                                        required: {
                                            value: true,
                                            message: 'This fields is required',
                                        },
                                    })}
                                />
                                <Text color={'error'}>
                                    {errors.width && 'Width is required'}
                                </Text>
                            </Box>
                            <Box width={1 / 3} pr={1}>
                                <Input
                                    id="height"
                                    name="height"
                                    sx={{
                                        ':focus': {
                                            borderColor: errors.height
                                                ? 'error'
                                                : 'gray',
                                        },
                                        borderColor: errors.height
                                            ? 'error'
                                            : 'gray',
                                    }}
                                    ref={register({
                                        required: {
                                            value: true,
                                            message: 'This fields is required',
                                        },
                                    })}
                                />
                                <Text color={'error'}>
                                    {errors.height && 'Height is required'}
                                </Text>
                            </Box>

                            <Box width={1 / 3}>
                                <Input
                                    id="lenght"
                                    name="lenght"
                                    sx={{
                                        ':focus': {
                                            borderColor: errors.lenght
                                                ? 'error'
                                                : 'gray',
                                        },
                                        borderColor: errors.lenght
                                            ? 'error'
                                            : 'gray',
                                    }}
                                    ref={register({
                                        required: {
                                            value: true,
                                            message: 'This fields is required',
                                        },
                                    })}
                                />
                                <Text color={'error'}>
                                    {errors.lenght && 'Lenght is required'}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="material">Material</Label>
                        <Select
                            name="material"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'This fields is required',
                                },
                            })}
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

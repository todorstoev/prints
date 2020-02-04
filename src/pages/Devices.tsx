import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RootState, AuthState, Device, Cords } from '../types'
import { Flex, Box, Heading, Button } from 'rebass'
import { Label, Input, Select } from '@rebass/forms'
import { LocationMap } from '../components/LocationMap'
import firebase from 'firebase'

const authState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(authState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Devices: React.FC<PropsFromRedux> = () => {
    const { register, handleSubmit, errors } = useForm()
    const [cords, setCords] = useState<Cords>({
        lat: 0,
        lng: 0,
    })
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
        }
    }

    return (
        <Flex mx={2} mb={3}>
            <Box width={1 / 2}>
                <Heading>Fill your Device</Heading>
            </Box>

            <Box width={1 / 2} px={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        Primary
                    </Button>
                </form>
            </Box>
        </Flex>
    )
}

export default connector(Devices)

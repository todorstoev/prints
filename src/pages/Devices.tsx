import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RootState, AuthState } from '../types'
import { Flex, Box, Heading, Button } from 'rebass'
import { Label, Input, Select } from '@rebass/forms'
import { LocationMap } from '../components/LocationMap'

const authState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(authState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Devices: React.FC<PropsFromRedux> = () => {
    const { register, handleSubmit, errors } = useForm()
    const onSubmit = (data: any) => {
        console.log(data)
        console.log(data)
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
                            defaultValue="Brand"
                            ref={register({ required: true })}
                        />
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            name="type"
                            defaultValue="Your Printer Type"
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
                                    defaultValue="width"
                                    ref={register({ required: true })}
                                />
                            </Box>
                            <Box width={1 / 3} pr={1}>
                                <Input
                                    id="height"
                                    name="height"
                                    defaultValue="height"
                                    ref={register({ required: true })}
                                />
                            </Box>

                            <Box width={1 / 3}>
                                <Input
                                    id="lenght"
                                    name="lenght"
                                    defaultValue="lenght"
                                    ref={register({ required: true })}
                                />
                            </Box>
                        </Flex>
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="material">Material</Label>
                        <Select
                            name="material"
                            defaultValue="NYC"
                            ref={register({ required: true })}
                        >
                            <option>NYC</option>
                            <option>DC</option>
                            <option>ATX</option>
                        </Select>
                    </Box>
                    <Box width={1 / 1} px={2} height={500}>
                        <LocationMap
                            getLoc={e => {
                                console.log(e.latlng)
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

import React, { useRef } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { RootState, AuthState } from '../types'
import { Flex, Box, Heading } from 'rebass'
import { Label, Input, Select } from '@rebass/forms'
import { LocationMap } from '../components/LocationMap'

const authState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(authState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Devices: React.FC<PropsFromRedux> = () => {
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
                    <LocationMap
                        getLoc={e => {
                            console.log(e.latlng)
                        }}
                    ></LocationMap>
                </Box>
            </Box>
        </Flex>
    )
}

export default connector(Devices)

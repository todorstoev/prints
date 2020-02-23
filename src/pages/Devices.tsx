import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RootState, AuthState, Device, Coords, Printer } from '../types'
import { Flex, Box, Heading, Button, Text, Card } from 'rebass'
import { Label, Input } from '@rebass/forms'
import { LocationMap } from '../components/LocationMap'
import { db } from '../firebase/firebase'
import Select, { OptionsType } from 'react-select'
import makeAnimated from 'react-select/animated'
import { useTheme } from 'emotion-theming'

const authState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(authState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Devices: React.FC<PropsFromRedux> = ({ user }) => {
    const mainTheme = useTheme<any>()
    const { register, handleSubmit, errors } = useForm()
    const [cords, setCords] = useState<Coords>({
        lat: 0,
        lng: 0,
    })
    const [devices, setDevices] = useState<Array<Device>>([])
    const [printers, setPrinters] = useState<Array<Printer>>([])
    const [predefinedDevices, setPredefinedDevices] = useState<any>()
    const [selectedPrinter, setSelectedPrinter] = useState<Printer>()

    const materials: any = [
        { value: 'pla', label: 'PLA' },
        { value: 'abs', label: 'ABS' },
        { value: 'petg', label: 'PETG' },
    ]

    const animatedComponents = makeAnimated()

    useEffect(() => {
        db.collection('devices')
            .where('owner', '==', user.uid)
            .onSnapshot(snapshot => {
                let deviceBuffer: Array<Device> = []
                snapshot.forEach(doc => {
                    deviceBuffer.push(doc.data() as Device)
                })
                setDevices(deviceBuffer)
            })

        db.collection('printers').onSnapshot(snapshot => {
            let printersBuffer: Array<Printer> = []
            let predefinedBuffer: Array<any> = []
            snapshot.forEach(doc => {
                const printer = doc.data() as Printer
                predefinedBuffer.push({
                    value: printer,
                    label: `${printer.brand} ${printer.model}`,
                })
                printersBuffer.push(printer)
            })
            setPredefinedDevices(predefinedBuffer)
            setPrinters(printersBuffer)
        })
    }, [user.uid])

    const onSubmit = (data: any) => {
        const device: Device = {
            dimensions: {
                width: data.width,
                height: data.height,
                depth: data.depth,
            },
            location: { lat: cords.lat, lng: cords.lng },
            brand: data.brand,
            material: data.material,
            type: data.type,
            owner: user.uid,
            model: data.model,
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
                                        Dimensions: {device.dimensions.height} /{' '}
                                        {device.dimensions.width} /{' '}
                                        {device.dimensions.depth}
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
                    <Box
                        width={1 / 1}
                        px={2}
                        sx={{ position: 'relative', zIndex: 9999 }}
                    >
                        <Select
                            isClearable={true}
                            onChange={selected => {
                                debugger
                                const selectedPrinterd = (selected as unknown) as {
                                    label: string
                                    value: Printer
                                }
                                setSelectedPrinter(selectedPrinterd.value)
                            }}
                            placeholder={'search for printer...'}
                            options={predefinedDevices}
                            theme={theme => ({
                                ...theme,

                                colors: {
                                    ...theme.colors,
                                    primary: mainTheme.colors.primary,
                                    secondary: mainTheme.colors.secondary,
                                },
                            })}
                        />
                    </Box>
                    <Box width={1 / 1} px={2}>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            name="brand"
                            value={selectedPrinter ? selectedPrinter.brand : ''}
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
                            value={selectedPrinter ? selectedPrinter.model : ''}
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
                        <Flex>
                            <Box width={1 / 3} pr={1}>
                                <Label htmlFor="width">Width (in mm)</Label>
                                <Input
                                    id="width"
                                    name="width"
                                    value={
                                        selectedPrinter
                                            ? selectedPrinter.dimensions.width
                                            : ''
                                    }
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
                                <Label htmlFor="height">Height (in mm)</Label>
                                <Input
                                    id="height"
                                    name="height"
                                    value={
                                        selectedPrinter
                                            ? selectedPrinter.dimensions.height
                                            : ''
                                    }
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
                                <Label htmlFor="depth">Depth (in mm)</Label>
                                <Input
                                    id="depth"
                                    name="depth"
                                    value={
                                        selectedPrinter
                                            ? selectedPrinter.dimensions.height
                                            : ''
                                    }
                                    sx={{
                                        ':focus': {
                                            borderColor: errors.depth
                                                ? 'error'
                                                : 'gray',
                                        },
                                        borderColor: errors.depth
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
                                    {errors.depth && 'Depth is required'}
                                </Text>
                            </Box>
                        </Flex>
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

                    <Box
                        width={1 / 1}
                        px={2}
                        sx={{ zIndex: 9998, position: 'relative' }}
                    >
                        <Label htmlFor="material">Material</Label>
                        <Select
                            theme={theme => ({
                                ...theme,

                                colors: {
                                    ...theme.colors,
                                    primary: mainTheme.colors.primary,
                                    secondary: mainTheme.colors.secondary,
                                },
                            })}
                            placeholder={'choose material...'}
                            options={materials}
                            defaultValue={[materials[0]]}
                            isMulti={true}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                        ></Select>
                    </Box>
                    <Box width={1 / 1} px={2} height={500} marginY={10}>
                        <LocationMap
                            getLoc={e => {
                                setCords(e.latlng)
                            }}
                        ></LocationMap>
                    </Box>
                    <Box width={1 / 1} px={2} height={500}>
                        <Button variant="primary" mr={2} type={'submit'}>
                            Add Device
                        </Button>
                    </Box>
                </form>
            </Box>
        </Flex>
    )
}

export default connector(Devices)

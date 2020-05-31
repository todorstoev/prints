import React, {
    useState,
    ChangeEvent,
    CSSProperties,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react'
import ReactDOM from 'react-dom'

import { useForm, Controller } from 'react-hook-form'
import { Flex, Box, Heading, Button, Text } from 'rebass'
import { useTheme } from 'emotion-theming'

import { Label, Input } from '@rebass/forms'
import Select, { ValueType } from 'react-select'
import { connect, ConnectedProps } from 'react-redux'
import makeAnimated from 'react-select/animated'

import { Coords, Device, Printer, RootState, AuthState } from '../types'
import { db } from '../firebase/firebase'
import { getUserLocation, getPrinters } from '../utils'

import MapMarker from '../components/MapMarker'
import Map from '../components/Map'

const authState = (state: RootState): AuthState => {
    return state.auth
}

const connector = connect(authState)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    toggleModal: Dispatch<SetStateAction<boolean>>
}

const AddPrinter: React.FC<Props> = ({ user, toggleModal }) => {
    const mainTheme = useTheme<any>()

    const [userLocation, setUserLocation] = useState<Coords>({
        lat: 0,
        lng: 0,
    })

    const [pickerCords, setPickerCords] = useState<Coords>({
        lat: 0,
        lng: 0,
    })

    const [printerOptions, setPrinterOptions] = useState<any[]>([])

    const animatedComponents = makeAnimated()

    const { register, handleSubmit, errors, clearError, control } = useForm()

    // Printer State
    const [selectedBrand, setSelectedBrand] = useState<string>('')
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [selectedWidth, setSelectedWidth] = useState<number>(0)
    const [selectedHeight, setSelectedHeight] = useState<number>(0)
    const [selectedDepth, setSelectedDepth] = useState<number>(0)
    // Printer State

    useEffect(() => {
        getUserLocation().then(setUserLocation)

        getPrinters().then(printers => {
            const printerOptions = printers.map(printer => ({
                value: printer,
                label: `${printer.brand} ${printer.model}`,
            }))

            setPrinterOptions(printerOptions)
        })
    }, [])

    const materials: Array<any> = [
        { value: 'pla', label: 'PLA' },
        { value: 'abs', label: 'ABS' },
        { value: 'petg', label: 'PETG' },
    ]

    const types: Array<any> = [
        { value: 'FDM', label: 'FDM' },
        { value: 'SLS', label: 'SLS' },
        { value: 'Resin', label: 'Resin' },
    ]

    const onSubmit = (data: any, e: any) => {
        const device: Device = {
            dimensions: {
                width: Number(data.width),
                height: Number(data.height),
                depth: Number(data.depth),
            },
            location: {
                lat: pickerCords ? pickerCords.lat : userLocation.lat,
                lng: pickerCords ? pickerCords.lng : userLocation.lng,
            },
            brand: data.brand,
            materials: data.materials.map((mat: any) => mat.label),
            type: data.type.label,
            owner: user.uid as string,
            model: data.model,
        }

        // TODO: Extract in db util
        db.collection('devices')
            .add(device)
            .then(snapshot => {
                console.log(snapshot)
            })
            .catch(e => {
                console.log(e)
            })

        toggleModal(false)
    }

    return ReactDOM.createPortal(
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box width={1 / 1} px={2}>
                    <Heading>Add new device</Heading>
                </Box>
                <Box
                    width={1 / 1}
                    px={2}
                    sx={{ position: 'relative', zIndex: 12 }}
                >
                    <Select
                        isClearable={true}
                        onChange={(selected: ValueType<any>) => {
                            if (selected === null) {
                                setSelectedBrand('')
                                setSelectedModel('')
                                setSelectedWidth(0)
                                setSelectedHeight(0)
                                setSelectedDepth(0)
                            } else {
                                const { value } = selected as {
                                    value: Printer
                                }

                                setSelectedBrand(value.brand)
                                setSelectedModel(value.model)
                                setSelectedWidth(value.dimensions.width)
                                setSelectedHeight(value.dimensions.height)
                                setSelectedDepth(value.dimensions.depth)

                                clearError('brand')

                                if (selected.value.model) {
                                    clearError('model')
                                }
                            }
                        }}
                        placeholder={'Search for printer ...'}
                        options={printerOptions}
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
                        value={selectedBrand}
                        onChange={(val: ChangeEvent<HTMLInputElement>) => {
                            setSelectedBrand(val.target.value)
                        }}
                        sx={{
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
                        value={selectedModel}
                        onChange={(val: ChangeEvent<HTMLInputElement>) => {
                            setSelectedModel(val.target.value)
                        }}
                        sx={{
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
                                type={'number'}
                                value={selectedWidth}
                                onChange={(
                                    val: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSelectedWidth(
                                        (val.target.value as unknown) as number
                                    )
                                }}
                                sx={{
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
                                type={'number'}
                                value={selectedHeight}
                                onChange={(
                                    val: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSelectedHeight(
                                        (val.target.value as unknown) as number
                                    )
                                }}
                                sx={{
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
                                type={'number'}
                                value={selectedDepth}
                                onChange={(
                                    val: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSelectedDepth(
                                        (val.target.value as unknown) as number
                                    )
                                }}
                                sx={{
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
                <Box
                    width={1 / 1}
                    px={2}
                    sx={{ zIndex: 11, position: 'relative' }}
                >
                    <Label htmlFor="type">Type</Label>
                    <Controller
                        control={control}
                        name={'type'}
                        rules={{ required: true }}
                        as={
                            <Select
                                options={types}
                                styles={{
                                    control: (
                                        e: CSSProperties
                                    ): CSSProperties => {
                                        return {
                                            ...e,
                                            borderColor: !errors.type
                                                ? 'rgb(204, 204, 204)'
                                                : mainTheme.colors.error,
                                        }
                                    },
                                }}
                                theme={theme => ({
                                    ...theme,

                                    colors: {
                                        ...theme.colors,
                                        primary: mainTheme.colors.primary,
                                        secondary: mainTheme.colors.secondary,
                                    },
                                })}
                            />
                        }
                    />
                    <Text color={'error'}>
                        {errors.type && 'Type is required'}
                    </Text>
                </Box>

                <Box
                    width={1 / 1}
                    px={2}
                    sx={{ zIndex: 10, position: 'relative' }}
                >
                    <Label htmlFor="materials">Materials</Label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        name={'materials'}
                        as={
                            <Select
                                styles={{
                                    control: (
                                        e: CSSProperties
                                    ): CSSProperties => {
                                        return {
                                            ...e,
                                            borderColor: !errors.materials
                                                ? 'rgb(204, 204, 204)'
                                                : mainTheme.colors.error,
                                        }
                                    },
                                }}
                                theme={theme => ({
                                    ...theme,

                                    colors: {
                                        ...theme.colors,
                                        primary: mainTheme.colors.primary,
                                        secondary: mainTheme.colors.secondary,
                                    },
                                })}
                                isClearable={false}
                                placeholder={'Choose materials ...'}
                                options={materials}
                                isMulti={true}
                                components={animatedComponents}
                            ></Select>
                        }
                    />
                    <Text color={'error'}>
                        {errors.materials &&
                            'There must be at least 1 material'}
                    </Text>
                </Box>
                <Box
                    width={1 / 1}
                    px={2}
                    height={500}
                    marginY={10}
                    sx={{ zIndex: 0, position: 'relative' }}
                >
                    <Map
                        zoom={13}
                        center={userLocation}
                        onClick={e => setPickerCords(e.latlng)}
                    >
                        <MapMarker position={pickerCords}></MapMarker>
                    </Map>
                </Box>
                <Box width={1 / 1} px={2}>
                    <Button variant="primary" mr={2} type={'submit'}>
                        Add Device
                    </Button>
                    <Button onClick={() => toggleModal(false)}>Cancel</Button>
                </Box>
            </form>
        </Box>,
        document.body
    )
}

export default connector(AddPrinter)

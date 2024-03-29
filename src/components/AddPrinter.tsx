import React, { useState, ChangeEvent, CSSProperties, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useForm, Controller } from 'react-hook-form';
import { Flex, Box, Heading, Button, Text } from 'rebass';
import { useTheme } from 'emotion-theming';

import { Label, Input } from '@rebass/forms';
import Select from 'react-select';

import makeAnimated from 'react-select/animated';

import { Coords, Device, DeviceState, MapState, Printer, PrintsUser, RootState } from '../types';

import { convertGeopoint, getUserLocation } from '../shared/helpers';
import { getPrinters } from '../shared/services';

import Map from '../components/Map';

import { Loader } from './Loader';
import { actions } from '../shared/store';
import MapMarker from './MapMarker';

type Props = {
  toggleModal: any;
};

const AddPrinter: React.FC<Props> = ({ toggleModal }) => {
  const [userLocation, setUserLocation] = useState<Coords>(convertGeopoint(0, 0));

  const [uLocationRetrieved, setULocationRetrieved] = useState<boolean>(false);

  const { isLoading, userDevices, uid, email, displayName, userLoc } = useSelector<
    RootState,
    PrintsUser & DeviceState & MapState
  >((state) => ({
    ...state.auth.user,
    ...state.devices,
    ...state.map,
  }));

  const [pickerCords, setPickerCords] = useState<Coords>(userLoc);

  const [lastestDevicesNum] = useState<number>(userDevices.length);

  const mainTheme = useTheme<any>();

  const dispatch = useDispatch();

  const [printerOptions, setPrinterOptions] = useState<any[]>([]);

  const animatedComponents = makeAnimated();

  const { register, handleSubmit, errors, clearError, control } = useForm();

  // Printer State
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWidth, setSelectedWidth] = useState<number>(0);
  const [selectedHeight, setSelectedHeight] = useState<number>(0);
  const [selectedDepth, setSelectedDepth] = useState<number>(0);
  // Printer State

  useEffect(() => {
    getUserLocation().then((res) => {
      setUserLocation(res);
      setULocationRetrieved(true);
    });

    getPrinters().then((printers) => {
      const printerOptions = printers.map((printer) => ({
        value: printer,
        label: `${printer.brand} ${printer.model}`,
      }));

      setPrinterOptions(printerOptions);
    });
  }, [userDevices.length, lastestDevicesNum, toggleModal]);

  const materials: Array<any> = [
    { value: 'pla', label: 'PLA' },
    { value: 'abs', label: 'ABS' },
    { value: 'petg', label: 'PETG' },
  ];

  const types: Array<any> = [
    { value: 'FDM', label: 'FDM' },
    { value: 'SLS', label: 'SLS' },
    { value: 'SLA', label: 'SLA' },
  ];

  const onSubmit = async (data: any, e: any) => {
    const device: Device = {
      dimensions: {
        width: Number(data.width),
        height: Number(data.height),
        depth: Number(data.depth),
      },
      coordinates: convertGeopoint(
        pickerCords ? pickerCords.latitude : userLocation.latitude,
        pickerCords ? pickerCords.longitude : userLocation.longitude,
      ),
      brand: data.brand,
      materials: data.materials ? data.materials.map((mat: any) => mat.label) : null,
      type: data.type.label,
      model: data.model,
      uemail: email,
      uname: displayName,
      uid,
    };

    dispatch(actions.requestAddDevice(device));
  };

  return (
    <React.Fragment>
      {isLoading && <Loader></Loader>}
      {!isLoading && (
        <Box>
          <Heading mb={2} color={'primary'}>
            Add new device
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection={['column', 'row']}>
              <Box width={[1 / 1, 1 / 2]} mr={[0, 3]} pr={[0, 3]}>
                <Box width={1 / 1}>
                  <Select
                    isClearable={true}
                    styles={{
                      control: (e: CSSProperties): CSSProperties => {
                        return {
                          ...e,
                          borderColor: mainTheme.colors.secondary,
                        };
                      },
                    }}
                    onChange={(selected: any) => {
                      if (selected === null) {
                        setSelectedBrand('');
                        setSelectedModel('');
                        setSelectedWidth(0);
                        setSelectedHeight(0);
                        setSelectedDepth(0);
                      } else {
                        const { value } = (selected as unknown) as {
                          value: Printer;
                        };

                        setSelectedBrand(value.brand);
                        setSelectedModel(value.model);
                        setSelectedWidth(value.dimensions.width);
                        setSelectedHeight(value.dimensions.height);
                        setSelectedDepth(value.dimensions.depth);

                        clearError('brand');

                        if ((selected.value as any).model) {
                          clearError('model');
                        }
                      }
                    }}
                    placeholder={'Search for printer ...'}
                    options={printerOptions}
                    theme={(theme: any) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary: mainTheme.colors.primary,
                        secondary: mainTheme.colors.secondary,
                      },
                    })}
                  />
                </Box>
                <Box width={1 / 1}>
                  <Label htmlFor="brand" my={1}>
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={selectedBrand}
                    onChange={(val: ChangeEvent<HTMLInputElement>) => {
                      setSelectedBrand(val.target.value);
                    }}
                    sx={{
                      borderColor: errors.brand ? 'error' : 'secondary',
                    }}
                    ref={register({
                      required: {
                        value: true,
                        message: 'This fields is required',
                      },
                    })}
                  />
                </Box>
                <Box width={1 / 1}>
                  <Label htmlFor="model" my={1}>
                    Model
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    value={selectedModel}
                    onChange={(val: ChangeEvent<HTMLInputElement>) => {
                      setSelectedModel(val.target.value);
                    }}
                    sx={{
                      borderColor: errors.model ? 'error' : 'secondary',
                    }}
                    ref={register({
                      required: {
                        value: true,
                        message: 'This fields is required',
                      },
                    })}
                  />
                </Box>
                <Box width={1 / 1}>
                  <Flex>
                    <Box width={1 / 3} pr={1}>
                      <Label htmlFor="width" my={1}>
                        Width
                      </Label>
                      <Input
                        id="width"
                        name="width"
                        type={'number'}
                        value={selectedWidth}
                        onChange={(val: ChangeEvent<HTMLInputElement>) => {
                          setSelectedWidth((val.target.value as unknown) as number);
                        }}
                        sx={{
                          borderColor: errors.width ? 'error' : 'secondary',
                        }}
                        ref={register({
                          required: {
                            value: true,
                            message: 'This fields is required',
                          },
                        })}
                      />
                    </Box>
                    <Box width={1 / 3} pr={1}>
                      <Label htmlFor="height" my={1}>
                        Height
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type={'number'}
                        value={selectedHeight}
                        onChange={(val: ChangeEvent<HTMLInputElement>) => {
                          setSelectedHeight((val.target.value as unknown) as number);
                        }}
                        sx={{
                          borderColor: errors.height ? 'error' : 'secondary',
                        }}
                        ref={register({
                          required: {
                            value: true,
                            message: 'This fields is required',
                          },
                        })}
                      />
                    </Box>
                    <Box width={1 / 3}>
                      <Label htmlFor="depth" my={1}>
                        Depth
                      </Label>
                      <Input
                        id="depth"
                        name="depth"
                        type={'number'}
                        value={selectedDepth}
                        onChange={(val: ChangeEvent<HTMLInputElement>) => {
                          setSelectedDepth((val.target.value as unknown) as number);
                        }}
                        sx={{
                          borderColor: errors.depth ? 'error' : 'secondary',
                        }}
                        ref={register({
                          required: {
                            value: true,
                            message: 'This fields is required',
                          },
                        })}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box width={1 / 1}>
                  <Label htmlFor="type" my={1}>
                    Type
                  </Label>
                  <Controller
                    control={control}
                    name={'type'}
                    rules={{ required: true }}
                    as={
                      <Select
                        options={types}
                        styles={{
                          control: (e: CSSProperties): CSSProperties => {
                            return {
                              ...e,

                              borderColor: !errors.type
                                ? mainTheme.colors.secondary
                                : mainTheme.colors.error,
                            };
                          },
                        }}
                        menuPortalTarget={document.body}
                        theme={(theme: any) => ({
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
                </Box>

                <Box width={1 / 1}>
                  <Label htmlFor="materials" my={1}>
                    Materials
                  </Label>
                  <Controller
                    control={control}
                    rules={{ required: false }}
                    name={'materials'}
                    as={
                      <Select
                        styles={{
                          control: (e: CSSProperties): CSSProperties => {
                            return {
                              ...e,
                              zIndex: 1001,
                              borderColor: !errors.materials
                                ? mainTheme.colors.secondary
                                : mainTheme.colors.error,
                            };
                          },
                        }}
                        theme={(theme: any) => ({
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
                        menuPortalTarget={document.body}
                        components={animatedComponents}
                      ></Select>
                    }
                  />
                </Box>
              </Box>
              <Box width={[1 / 1, 1 / 2]} mt={[3, 0]}>
                <Box
                  width={1 / 1}
                  height={[200, '100%']}
                  sx={{
                    zIndex: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {uLocationRetrieved && (
                    <Map
                      dragging={true}
                      controls={true}
                      zoom={13}
                      center={userLocation}
                      // onClick={(e) => setPickerCords(convertGeopoint(e.latlng.lat, e.latlng.lng))}
                    >
                      <MapMarker
                        position={pickerCords}
                        onClick={(e) => setPickerCords(convertGeopoint(e.latlng.lat, e.latlng.lng))}
                      ></MapMarker>
                    </Map>
                  )}
                </Box>
              </Box>
            </Flex>
            <Text color={'error'} mt={2}>
              {Object.keys(errors).length > 0 && 'Please fill all required fields.'}
            </Text>
            <Box width={1 / 1} mt={3}>
              <Button variant="primary" mr={2} type={'submit'}>
                Add Device
              </Button>
              <Button variant="secondary" type={'reset'} onClick={() => toggleModal(false)}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </React.Fragment>
  );
};

export default AddPrinter;

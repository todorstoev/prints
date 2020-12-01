import React, { useState, useRef, RefObject, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Flex, Box, Text, Card, Image, Button, Heading } from 'rebass';
import { useTheme } from 'emotion-theming';
import { useTransition, animated, useChain, ReactSpringHook, config } from 'react-spring';

import { useForm } from 'react-hook-form';

import { RootState, Device } from '../types';

import AddPrinter from '../components/AddPrinter';
import Modal from '../components/Modal';
import { Input } from '@rebass/forms';
import { UserControl } from '../components/UserControl';
import { actions } from '../shared/store';
import Loader from 'react-loader-spinner';

const Profile: React.FC = () => {
  const { user, userDevices, isLoading } = useSelector((state: RootState) => ({
    ...state.auth,
    ...state.devices,
  }));

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [edit, setEdit] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { handleSubmit, register, errors } = useForm();

  const mainTheme = useTheme<any>();

  const unameTrsRef = useRef() as RefObject<ReactSpringHook>;

  const emailTrsRef = useRef() as RefObject<ReactSpringHook>;

  const sbmBtnTrRef = useRef() as RefObject<ReactSpringHook>;

  const unameTrs = useTransition(edit, null, {
    initial: null,
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff,
    ref: unameTrsRef,
  });

  const emailTrs = useTransition(edit, null, {
    initial: null,
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff,
    ref: emailTrsRef,
  });

  const devicesTrs = useTransition(userDevices, (item) => item?.id as string, {
    from: { transform: 'translate3d(0,-40px,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
    leave: { transform: 'translate3d(0,-40px,0)', opacity: 1 },
    config: config.stiff,
    trail: 200,
  });

  useEffect(() => {
    if (errors) {
      for (const error in errors) {
        dispatch(actions.addNotification(errors[`${error}`].message));
      }
    }
  }, [errors, dispatch]);

  useEffect(() => {
    dispatch(actions.requestLoadUserDevices());
  }, [dispatch]);

  useChain(
    edit ? [unameTrsRef, emailTrsRef, sbmBtnTrRef] : [sbmBtnTrRef, emailTrsRef, unameTrsRef],
    [0, 0.4, 0.8, 1],
  );

  const onSubmit = (data: any) => {
    dispatch(actions.updateUserRequest(data));
    setEdit(false);
  };

  return (
    <React.Fragment>
      <Flex p={'1rem'} pt={'5rem'} justifyContent={'center'} overflow={'auto'} height={'100%'}>
        <Box width={[1 / 1, 1 / 2, 1 / 2, 1 / 4]}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <Flex
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '50px',
                }}
              >
                {unameTrs.map(({ item, key, props }) =>
                  item ? (
                    <animated.div
                      key={key}
                      style={{
                        opacity: props.opacity,
                        position: props.position,
                        transform: props.transform,
                      }}
                    >
                      <Input
                        ref={register({
                          validate: (value) => value !== 'admin' || 'Nice try!',
                        })}
                        variant={'inputAuto'}
                        placeholder={'Display name'}
                        defaultValue={user.displayName}
                        name={'displayName'}
                      ></Input>
                    </animated.div>
                  ) : (
                    <animated.div
                      key={key}
                      style={{
                        opacity: props.opacity,
                        position: props.position,
                      }}
                    >
                      <Heading color={'primary'} py={1} textAlign={'center'}>
                        {user.displayName}
                      </Heading>
                    </animated.div>
                  ),
                )}
              </Flex>
            </Flex>

            <Box
              variant={'avatar'}
              m={'auto'}
              my={3}
              sx={{
                position: 'relative',
                boxShadow: '20px 20px 60px #d9d9d9,  -20px -20px 60px #ffffff',
              }}
            >
              <Image src={user.photoURL} alt="" variant={'avatar'} />
              <UserControl {...{ setEdit, edit, sbmBtnTrRef }}></UserControl>
            </Box>
            <Flex
              mt={4}
              mb={2}
              minHeight={36}
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={'column'}
              sx={{ position: 'relative' }}
            >
              {emailTrs.map(({ item, key, props }) =>
                item ? (
                  <animated.div
                    key={key}
                    style={{
                      opacity: props.opacity,
                      position: props.position,
                      transform: props.transform,
                    }}
                  >
                    <Input
                      ref={register({
                        required: 'Email is Required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      sx={{
                        borderColor: errors.email ? 'error' : 'secondary',
                      }}
                      name={'email'}
                      variant={'inputAuto'}
                      defaultValue={user.email}
                    ></Input>
                  </animated.div>
                ) : (
                  <animated.div
                    key={key}
                    style={{
                      opacity: props.opacity,
                      position: props.position,
                      transform: props.transform,
                    }}
                  >
                    <Text color={'gray'} py={1} textAlign={'center'}>
                      {user.email}
                    </Text>
                  </animated.div>
                ),
              )}
            </Flex>

            <Flex justifyContent={'space-between'} alignItems={'center'} my={4}>
              <Text>My Devices</Text>

              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddModal(true);
                }}
              >
                Add Device
              </Button>
            </Flex>
            <Box marginBottom={4} variant={'hr'}></Box>
            <Box sx={{ overflowY: 'auto' }}>
              {isLoading && (
                <Flex justifyContent="center" color={'primary'}>
                  <Loader
                    type="BallTriangle"
                    color="#00BFFF"
                    timeout={300} //3 secs
                  />
                </Flex>
              )}
              {userDevices.length <= 0 && !isLoading && <Text>You have no devices added</Text>}
              {userDevices.length > 0 &&
                !isLoading &&
                devicesTrs.map(({ item, props, key }) => (
                  <animated.div key={key} style={props}>
                    <Card
                      m={'auto'}
                      mb={3}
                      p={3}
                      color="white"
                      sx={{
                        position: 'relative',
                        background: mainTheme.blueGradient,
                        boxShadow: 'card',
                        lineHeight: 'body',
                        borderRadius: 7,
                      }}
                    >
                      <Flex mb={[2]} justifyContent={'space-between'} fontSize={3}>
                        <Text variant={'heading'}>{item.brand}</Text>
                        <Box>{item.model}</Box>
                      </Flex>
                      <Text>Type</Text>
                      <Text variant={'heading'}>{item.type}</Text>
                      <Text>Materials</Text>
                      <Text variant={'heading'}>
                        {item.materials.map((material, i) =>
                          i === 0 ? material : `, ${material} `,
                        )}
                      </Text>
                      <Text>Dimensions</Text>
                      <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Box>
                          <Text variant={'heading'}>
                            {item.dimensions.height} / {item.dimensions.width} /{' '}
                            {item.dimensions.depth}
                          </Text>
                        </Box>
                        <Box
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(actions.requestDeleteDevice(item));
                          }}
                        >
                          <Text
                            sx={{
                              textDecoration: 'italic',
                              ':hover': {
                                cursor: 'pointer',
                              },
                            }}
                            fontSize={1}
                            color={'background'}
                          >
                            remove
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  </animated.div>
                ))}
            </Box>
          </form>
        </Box>
      </Flex>

      <Modal {...{ showModal: showAddModal, setShowModal: setShowAddModal }}>
        <AddPrinter
          {...{
            toggleModal: setShowAddModal,
          }}
        />
      </Modal>
    </React.Fragment>
  );
};

export default Profile;

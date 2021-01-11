import React from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@rebass/forms';
import { useTheme } from 'emotion-theming';

import Select from 'react-select';
import { useSpring, animated } from 'react-spring';
import { Box, Link, Button, Flex } from 'rebass';
import { useForm, Controller } from 'react-hook-form';

import { IMapFilter } from '../types';
import { actions } from '../shared/store';

type Props = {
  showFilter: boolean;
};

const types: Array<any> = [
  { value: 'FDM', label: 'FDM' },
  { value: 'SLS', label: 'SLS' },
  { value: 'SLA', label: 'SLA' },
];

export const MapFilter: React.FC<Props> = ({ showFilter }) => {
  const mainTheme = useTheme<any>();

  const { register, handleSubmit, control, reset } = useForm<IMapFilter>();

  const { opacity, transform } = useSpring({
    opacity: showFilter ? 1 : 0,
    transform: `translate3d(${showFilter ? 0 : -150}%,0,0)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const dispatch = useDispatch();

  const filterHandeler = (data: IMapFilter): void => {
    dispatch(actions.setSearchFilter(data));
  };

  const clearFilter = () => {
    reset({ brand: '', model: '', type: '' });

    dispatch(actions.clearFilter());
  };

  const onSubmit = (data: IMapFilter) => filterHandeler(data);

  return (
    <animated.div
      style={{
        opacity: opacity,
        transform: transform.interpolate((tr) => `${tr}`),
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          width={300}
          p={3}
          bg={'background'}
          sx={{
            boxShadow: 'small',
            borderRadius: '7px',
          }}
        >
          <Box my={2}>
            <Input placeholder={'Brand'} name={'brand'} ref={register()} />
          </Box>
          <Box my={2}>
            <Input placeholder={'Model'} name={'model'} ref={register()} />
          </Box>
          <Box my={2}>
            <Controller
              name={'type'}
              control={control}
              defaultValue={''}
              as={
                <Select
                  placeholder={'Type'}
                  options={types}
                  theme={(theme) => ({
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
          <Flex justifyContent={'space-between'} my={2}>
            <Link onClick={clearFilter}>reset filters</Link>
            <Button type={'submit'} variant={'secondary'}>
              Ok
            </Button>
          </Flex>
        </Box>
      </form>
    </animated.div>
  );
};

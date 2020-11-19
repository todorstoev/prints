import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading } from 'rebass';
import { useSpring, animated, config } from 'react-spring';
import { ChevronDown, ChevronUp, Info } from 'react-feather';
import { Device } from '../types';

type Props = {
  streched: boolean;
  setStretched: React.Dispatch<React.SetStateAction<boolean>>;
  device: Device;
};

export const ChatDetailsControls: React.FC<Props> = ({ streched, setStretched, device }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [props, set] = useSpring(() => ({
    opacity: 0,
    transform: `translate3d(0px,0px,0px) scale(0.7)`,
  }));

  useEffect(() => {
    set({
      opacity: showInfo ? 1 : 0,
      transform: `translate3d(${showInfo ? -5 : -5}px,${showInfo ? 60 : -100}px,0px) scale(${
        showInfo ? 1 : 0.6
      })`,
      config: config.stiff,
    });
  }, [showInfo, set]);

  return (
    <Flex
      color={'primary'}
      justifyContent="space-between"
      alignItems={'center'}
      sx={{ position: 'relative' }}
    >
      <Heading color={['primary', 'background']}>
        {device.brand} {device.model}
      </Heading>
      <Flex>
        <Box
          sx={{
            ':hover': {
              color: 'secondary',
              cursor: 'pointer',
            },
            transition: 'all 0.2s linear',
          }}
          color="primary"
          onClick={(e) => {
            setShowInfo(!showInfo);
          }}
        >
          <Info size={21} />
        </Box>

        <Box
          ml={2}
          sx={{
            ':hover': {
              color: 'secondary',
              cursor: 'pointer',
            },
            transition: 'all 0.2s linear',
          }}
        >
          {streched && (
            <ChevronDown onClick={() => setStretched(false)} style={{ cursor: 'pointer' }} />
          )}
          {!streched && (
            <ChevronUp onClick={() => setStretched(true)} style={{ cursor: 'pointer' }} />
          )}
        </Box>
      </Flex>
      <animated.div style={{ ...props, position: 'absolute', right: '0px', zIndex: 1000 }}>
        <Box p={2} bg={'background'} color={'black'} sx={{ boxShadow: 'card', maxWidth: 240 }}>
          You can rate this device's owner. {'\n'} Careful, you can rate only once.
        </Box>
      </animated.div>
    </Flex>
  );
};

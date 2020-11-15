import React, { useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import { useSpring, animated, config } from 'react-spring';
import { ChevronDown, ChevronUp, Info } from 'react-feather';

type Props = {
  streched: boolean;
  setStretched: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatDetailsControls: React.FC<Props> = ({ streched, setStretched }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [props, set] = useSpring(() => ({
    opacity: 0,
    transform: `translate3d(0px,0px,0px) scale(0.7)`,
  }));

  useEffect(() => {
    set({
      opacity: showInfo ? 1 : 0,
      transform: `translate3d(${showInfo ? -65 : 0}px,0px,0px) scale(${showInfo ? 1 : 0.6})`,
      config: config.stiff,
    });
  }, [showInfo, set]);

  return (
    <Flex color={'primary'} justifyContent="flex-end" alignItems={'center'}>
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

      <animated.div style={{ ...props, position: 'absolute', zIndex: 1000 }}>
        <Box p={2} bg={'background'} color={'black'} sx={{ boxShadow: 'card', maxWidth: 240 }}>
          You can rate this device's owner. {'\n'} Careful, you can rate only once.
        </Box>
      </animated.div>
    </Flex>
  );
};

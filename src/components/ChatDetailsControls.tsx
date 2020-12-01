import React from 'react';
import { Box, Flex } from 'rebass';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Device } from '../types';

type Props = {
  streched: boolean;
  setStretched: React.Dispatch<React.SetStateAction<boolean>>;
  device: Device;
};

export const ChatDetailsControls: React.FC<Props> = ({ streched, setStretched }) => {
  return (
    <Flex color={'primary'} justifyContent="space-between" alignItems={'center'}>
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
  );
};

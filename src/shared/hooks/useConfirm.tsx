import React, { useState } from 'react';
import { Box, Button, Flex, Text } from 'rebass';

export const useConfirm = (callback: () => void, message: string) => {
  const [isOpen, setIsOpen] = useState(false);

  const Confirm: React.FC = ({ children }) => (
    <>
      {isOpen && (
        <Flex flexDirection="column">
          <Box>
            {children}
            <Text>{message}</Text>
          </Box>
          <Flex mt={3} alignContent="center" justifyContent="center">
            <Button
              mr={1}
              variant={'primary'}
              onClick={() => {
                setIsOpen(false);
                callback();
              }}
            >
              Yes
            </Button>
            <Button ml={1} variant={'secondary'} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );

  return {
    isOpen,
    setIsOpen,
    Confirm,
  };
};

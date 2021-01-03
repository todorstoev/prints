import React from 'react';

import { Box, Flex, Heading } from 'rebass';

const NoMatch: React.FC<any> = () => (
  <Box pt={['5.5rem', '5rem']} p={5}>
    <Flex alignItems="center" justifyContent="center">
      <Heading>Sorry page not found ! 404</Heading>
    </Flex>
  </Box>
);

export default NoMatch;

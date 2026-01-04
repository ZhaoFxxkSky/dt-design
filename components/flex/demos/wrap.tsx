import React from 'react';
import { Button, Flex } from '@dtjoy/dt-design';

export default () => {
  return (
    <Flex wrap gap="small">
      {Array.from({ length: 24 }, (_, i) => (
        <Button key={i} type="primary">
          Button
        </Button>
      ))}
    </Flex>
  );
};

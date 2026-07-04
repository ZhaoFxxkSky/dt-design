import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { Flex, Splitter } from '@dtjoy/dt-design';

const Counter: React.FC<Readonly<{ label: string }>> = ({ label }) => {
  const [count, setCount] = useState(0);
  return (
    <Flex justify="center" align="center" style={{ height: '100%' }} vertical gap={8}>
      <Typography.Title type="secondary" level={5}>
        {label}: {count}
      </Typography.Title>
      <Button size="small" onClick={() => setCount((c) => c + 1)}>
        +1
      </Button>
    </Flex>
  );
};

const App: React.FC = () => (
  <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
    <Splitter.Panel collapsible destroyOnHidden defaultSize="50%">
      <Counter label="destroyOnHidden" />
    </Splitter.Panel>
    <Splitter.Panel collapsible defaultSize="50%">
      <Counter label="keep" />
    </Splitter.Panel>
  </Splitter>
);

export default App;

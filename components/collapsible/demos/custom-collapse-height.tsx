import React, { useState } from 'react';
import { Button, Collapsible } from '@dtjoy/dt-design';

export default function () {
  const [isOpen, setOpen] = useState(false);
  const maskStyle = isOpen
    ? {}
    : {
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
      };
  const collapsed = (
    <ul>
      <li>
        <p> 捻过花惹了白</p>
      </li>
      <li>
        <p>月下举杯敬沧海</p>
      </li>
      <li>
        <p>憾无穷 人生长恨水长东</p>
      </li>
      <li>
        <p>天涯去后乡关外 听风声诉幽怀</p>
      </li>
      <li>
        <p>繁华落尽终是一场空</p>
      </li>
    </ul>
  );
  const toggle = () => {
    setOpen(!isOpen);
  };
  const linkStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    bottom: -10,
    fontWeight: 700,
    cursor: 'pointer',
  };
  return (
    <>
      <Button onClick={toggle}>Toggle</Button>
      <div style={{ position: 'relative' }}>
        <Collapsible isOpen={isOpen} collapseHeight={60} style={{ ...maskStyle }}>
          {collapsed}
        </Collapsible>
        {isOpen ? null : (
          <a onClick={toggle} style={{ ...linkStyle }}>
            + Show More
          </a>
        )}
      </div>
    </>
  );
}

import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Flex from '../index';

describe('Flex', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    const { getByText } = render(
      <Flex>
        <span>flex content</span>
      </Flex>,
    );
    expect(getByText('flex content')).toBeTruthy();
  });

  it('applies vertical class when vertical is true', () => {
    const { container } = render(<Flex vertical>content</Flex>);
    expect(container.firstChild?.className).toMatch(/vertical/);
  });

  it('applies gap class for preset sizes', () => {
    const { container } = render(<Flex gap="small">content</Flex>);
    expect(container.firstChild?.className).toMatch(/gap-small/);
  });

  it('applies custom style', () => {
    const { container } = render(<Flex style={{ height: 100 }}>content</Flex>);
    expect(container.firstChild).toHaveStyle({ height: '100px' });
  });

  it('applies justify and align classes', () => {
    const { container } = render(
      <Flex justify="center" align="center">
        content
      </Flex>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with custom component', () => {
    const { container } = render(<Flex component="section">content</Flex>);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });
});

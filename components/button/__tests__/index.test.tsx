import fs from 'fs';
import path from 'path';
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Button from '..';

describe('Button', () => {
  it('should support contentLayout success render', () => {
    const wrapper = render(<Button icon={<UploadOutlined />}>Primary</Button>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders text correctly', () => {
    const { getByText } = render(<Button>Hello</Button>);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('renders icon correctly', () => {
    const { container } = render(<Button icon={<UploadOutlined />} />);
    expect(container.querySelector('.anticon')).toBeInTheDocument();
    expect(container.querySelector('.ant-btn-icon-only')).toBeInTheDocument();
    expect(container.textContent).toBe('');
  });

  it('renders icon and text correctly', () => {
    const { getByText, container } = render(<Button icon={<UploadOutlined />}>Search</Button>);
    expect(getByText('Search')).toBeInTheDocument();
    expect(container.querySelector('.anticon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies size className', () => {
    const { container } = render(<Button size="small">Test</Button>);
    expect(container.firstChild).toHaveClass('ant-btn-sm');
  });

  it('passes other props to AntdButton', () => {
    const { getByText } = render(<Button type="primary">Primary</Button>);
    expect(getByText('Primary').parentNode).toHaveClass('ant-btn-primary');
  });

  it('applies size class to icon and text', () => {
    const { container } = render(
      <Button icon={<UploadOutlined />} size="small">
        Test
      </Button>,
    );
    expect(container.firstChild).toHaveClass('ant-btn-sm');
    expect(container.querySelector('.anticon')).toBeInTheDocument();
  });

  it('forwards ref to the native button element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('has a displayName for debugging', () => {
    expect(Button.displayName).toBe('Button');
  });

  it('adds dt-btn marker class for secondary/tertiary types', () => {
    const { container, rerender } = render(<Button type="secondary">Secondary</Button>);
    expect(container.firstChild).toHaveClass('dt-btn-secondary');

    rerender(<Button type="tertiary">Tertiary</Button>);
    expect(container.firstChild).toHaveClass('dt-btn-tertiary');
  });

  it('defines less selectors that match the dt-btn marker classes', () => {
    const stylePath = path.resolve(__dirname, '../style/index.less');
    const lessContent = fs.readFileSync(stylePath, 'utf-8');
    // @btn-prefix-cls 必须与 JS 实际添加的 dt-btn 前缀对齐
    expect(lessContent).toMatch(/@btn-prefix-cls:\s*~'dt-btn'/);
    // secondary/tertiary 规则定义在 .@{btn-prefix-cls} 块下，
    // 编译为 .dt-btn-secondary / .dt-btn-tertiary 才能命中 DOM
    expect(lessContent).toMatch(/\.@\{btn-prefix-cls\}\s*\{[\s\S]*?&-secondary/);
    expect(lessContent).toMatch(/\.@\{btn-prefix-cls\}\s*\{[\s\S]*?&-tertiary/);
  });
});

import React from 'react';
import type { ButtonProps as AntdButtonProps } from 'antd';
import { Button as AntdButton } from 'antd';
import type { ButtonType as AntdButtonType } from 'antd/lib/button';
import clsx from 'clsx';

import './style';

type ButtonType = AntdButtonType | 'secondary' | 'tertiary';

export interface ButtonProps extends Omit<AntdButtonProps, 'type'> {
  type?: ButtonType;
}

/** Map custom types to antd-compatible types */
function mapButtonType(type: ButtonType | undefined): AntdButtonType | undefined {
  if (type === 'secondary' || type === 'tertiary') {
    return 'default';
  }
  return type as AntdButtonType | undefined;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, size = 'middle', type, ...rest }, ref) => {
    return (
      <AntdButton
        ref={ref}
        className={clsx(className, {
          'dt-btn-secondary': type === 'secondary',
          'dt-btn-tertiary': type === 'tertiary',
        })}
        size={size}
        type={mapButtonType(type)}
        {...rest}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;

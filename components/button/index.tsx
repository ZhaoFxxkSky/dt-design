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

function Button({ className, size = 'middle', type, ...rest }: ButtonProps) {
  return (
    <AntdButton
      className={clsx(className, {
        'dt-btn-secondary': type === 'secondary',
        'dt-btn-tertiary': type === 'tertiary',
      })}
      size={size}
      type={mapButtonType(type)}
      {...rest}
    />
  );
}

export default Button as React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
>;

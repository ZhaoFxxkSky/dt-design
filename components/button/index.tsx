import React from 'react';
import type { ButtonProps as AntdButtonProps } from 'antd';
import { Button as AntdButton } from 'antd';
import type { ButtonType as AntdButtonType } from 'antd/es/button';
import clsx from 'clsx';

import './style';

type ButtonType = AntdButtonType | 'secondary' | 'tertiary';

export interface ButtonProps extends Omit<AntdButtonProps, 'type'> {
  type?: ButtonType;
}

function Button({ className, size = 'middle', type, ...rest }: ButtonProps) {
  return (
    <AntdButton className={clsx(className)} size={size} type={type as AntdButtonType} {...rest} />
  );
}

export default Button as React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLElement>
>;

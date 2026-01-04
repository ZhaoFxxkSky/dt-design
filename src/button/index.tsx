import React from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { ButtonType as AntdButtonType } from 'antd/es/button';
import { globalConfig } from 'antd/es/config-provider';
import classNames from 'classnames';
import './style';

type ButtonType = AntdButtonType | 'secondary' | 'tertiary';

export interface ButtonProps extends Omit<AntdButtonProps, 'type'> {
    type?: ButtonType;
}

function Button({ className, size = 'middle', type, ...rest }: ButtonProps) {
    return (
        <AntdButton
            className={classNames(className)}
            size={size}
            type={type as AntdButtonType}
            {...rest}
        />
    );
}

export default Button as React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLElement>
>;

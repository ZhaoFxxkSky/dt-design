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

export default function Button({
    className,
    icon,
    children,
    size = 'middle',
    type,
    ...rest
}: ButtonProps) {
    const prefixCls = globalConfig().getPrefixCls('btn');
    const typeClassName = type ? `${prefixCls}--${type}` : '';

    return (
        <AntdButton
            className={classNames(prefixCls, className, typeClassName)}
            size={size}
            type={type as AntdButtonType}
            {...rest}
        >
            {icon && (
                <span className={`${prefixCls}__icon ${prefixCls}__icon--${size}`}>{icon}</span>
            )}
            {children && (
                <span className={`${prefixCls}__text ${prefixCls}__text--${size}`}>{children}</span>
            )}
        </AntdButton>
    );
}

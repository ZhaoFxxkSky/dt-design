import React, { forwardRef, useContext } from 'react';
import { ConfigContext } from 'antd/es/config-provider';
import classNames from 'classnames';

import { InternalPanelProps, PanelProps } from './interface';

export const InternalPanel = forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<InternalPanelProps>
>((props, ref) => {
    const { prefixCls: customizePrefixCls, className, children, size, style = {} } = props;

    const { getPrefixCls } = useContext(ConfigContext);
    const prefixCls = getPrefixCls('splitter', customizePrefixCls);

    const panelClassName = classNames(
        `${prefixCls}-panel`,
        {
            [`${prefixCls}-panel-hidden`]: size === 0,
        },
        className
    );

    const hasSize = size !== undefined;

    return (
        <div
            ref={ref}
            className={panelClassName}
            style={{
                ...style,
                // Use auto when start from ssr
                flexBasis: hasSize ? size : 'auto',
                flexGrow: hasSize ? 0 : 1,
            }}
        >
            {children}
        </div>
    );
});

if (process.env.NODE_ENV !== 'production') {
    InternalPanel.displayName = 'Panel';
}

const Panel: React.FC<React.PropsWithChildren<PanelProps>> = () => null;

export default Panel;

import React from 'react';
import type { ConfigConsumerProps } from 'antd/es/config-provider';
import { ConfigContext } from 'antd/es/config-provider';
import classNames from 'classnames';
import omit from 'rc-util/lib/omit';

import type { FlexProps } from './interface';
import createFlexClassNames from './utils';
import './style/index.less';

const Flex = React.forwardRef<HTMLElement, FlexProps>((props, ref) => {
    const {
        prefixCls: customizePrefixCls,
        rootClassName,
        className,
        style,
        flex,
        gap,
        vertical = false,
        component: Component = 'div',
        ...othersProps
    } = props;

    const { getPrefixCls, direction: ctxDirection } =
        React.useContext<ConfigConsumerProps>(ConfigContext);

    const prefixCls = getPrefixCls('flex', customizePrefixCls);

    const mergedCls = classNames(
        prefixCls,
        className,
        rootClassName,
        createFlexClassNames(prefixCls, props),
        {
            [`${prefixCls}-rtl`]: ctxDirection === 'rtl',
            [`${prefixCls}-gap-${gap}`]: gap && typeof gap === 'string',
            [`${prefixCls}-vertical`]: vertical, // 仅依赖 props.vertical
        }
    );

    const mergedStyle: React.CSSProperties = {
        ...style,
    };

    if (flex) {
        mergedStyle.flex = flex;
    }

    if (gap && typeof gap !== 'string') {
        mergedStyle.gap = gap;
    }

    return (
        <Component
            ref={ref}
            className={mergedCls}
            style={mergedStyle}
            {...omit(othersProps, ['justify', 'wrap', 'align'])}
        />
    );
});

if (process.env.NODE_ENV !== 'production') {
    Flex.displayName = 'Flex';
}

export default Flex;

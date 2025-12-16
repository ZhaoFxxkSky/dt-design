import React from 'react';
import { ConfigConsumerProps, ConfigContext, globalConfig } from 'antd/es/config-provider';
import { clsx } from 'clsx';
import { omit } from 'lodash-es';
import './style';

import { isPresetSize } from '../_util/gapSize';
import { useOrientation } from '../_util/hooks';
import isNonNullable from '../_util/isNonNullable';
import type { FlexProps } from './interface';
import createFlexClassNames from './utils';

const Flex = React.forwardRef<HTMLElement, React.PropsWithChildren<FlexProps>>((props, ref) => {
    const {
        prefixCls: customizePrefixCls,
        rootClassName,
        className,
        style,
        flex,
        gap,
        vertical,
        orientation,
        component: Component = 'div',
        children,
        ...othersProps
    } = props;

    const { direction: ctxDirection } = React.useContext<ConfigConsumerProps>(ConfigContext);

    const prefixCls = customizePrefixCls || globalConfig().getPrefixCls('flex');

    const [mergedVertical] = useOrientation(orientation, vertical);

    const mergedCls = clsx(
        className,
        rootClassName,
        prefixCls,
        createFlexClassNames(prefixCls, props),
        {
            [`${prefixCls}-rtl`]: ctxDirection === 'rtl',
            [`${prefixCls}-gap-${gap}`]: isPresetSize(gap),
            [`${prefixCls}-vertical`]: mergedVertical === 'vertical',
        }
    );

    const mergedStyle: React.CSSProperties = { ...style };

    if (isNonNullable(flex)) {
        mergedStyle.flex = flex;
    }

    if (isNonNullable(gap) && !isPresetSize(gap)) {
        mergedStyle.gap = gap;
    }

    return (
        <Component
            ref={ref}
            className={mergedCls}
            style={mergedStyle}
            {...omit(othersProps, ['justify', 'wrap', 'align'])}
        >
            {children}
        </Component>
    );
});

if (process.env.NODE_ENV !== 'production') {
    Flex.displayName = 'Flex';
}

export default Flex;

import React, { forwardRef, useContext } from 'react';
import { ConfigContext } from 'antd/es/config-provider';
import clsx from 'clsx';

import type { InternalPanelProps, PanelProps } from './interface';

export const InternalPanel = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<InternalPanelProps>
>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    children,
    size,
    style = {},
    id,
    destroyOnHidden,
    supportMotion,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('splitter', customizePrefixCls);

  const panelClassName = clsx(
    `${prefixCls}-panel`,
    {
      [`${prefixCls}-panel-hidden`]: size === 0,
      [`${prefixCls}-panel-motion`]: supportMotion,
    },
    className,
  );

  const hasSize = size !== undefined;
  const shouldRender = !destroyOnHidden || size !== 0;

  return (
    <div
      ref={ref}
      id={id}
      className={panelClassName}
      style={{
        ...style,
        // Use auto when start from ssr
        flexBasis: hasSize ? size : 'auto',
        flexGrow: hasSize ? 0 : 1,
      }}
    >
      {shouldRender ? children : null}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  InternalPanel.displayName = 'Splitter.Panel';
}

const Panel: React.FC<React.PropsWithChildren<PanelProps>> = () => null;

if (process.env.NODE_ENV !== 'production') {
  Panel.displayName = 'Splitter.Panel';
}

export default Panel;

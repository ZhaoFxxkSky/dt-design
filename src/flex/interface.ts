import type React from 'react';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { AnyObject, CustomComponent } from 'dt-design/_util/type';

export interface FlexProps<P = AnyObject> extends React.HTMLAttributes<HTMLElement> {
    prefixCls?: string;
    rootClassName?: string;
    vertical?: boolean;
    wrap?: boolean | React.CSSProperties['flexWrap'];
    justify?: React.CSSProperties['justifyContent'];
    align?: React.CSSProperties['alignItems'];
    flex?: React.CSSProperties['flex'];
    gap?: React.CSSProperties['gap'] | SizeType;
    component?: CustomComponent<P>;
}

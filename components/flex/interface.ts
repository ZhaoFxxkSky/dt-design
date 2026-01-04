import type React from 'react';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import type { Orientation } from '../_util/hooks';
import type { AnyObject, CustomComponent, LiteralUnion } from '../_util/type';

export interface FlexProps<P = AnyObject> extends React.HTMLAttributes<HTMLElement> {
  prefixCls?: string;
  rootClassName?: string;
  vertical?: boolean;
  orientation?: Orientation;
  wrap?: boolean | React.CSSProperties['flexWrap'];
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  flex?: React.CSSProperties['flex'];
  gap?: LiteralUnion<SizeType, React.CSSProperties['gap']>;
  component?: CustomComponent<P>;
}

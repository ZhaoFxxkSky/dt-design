import type { ShowCollapsibleIconMode } from './SplitBar';

export interface SplitterProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  rootClassName?: string;
  layout?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
  vertical?: boolean;
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onCollapse?: (collapsed: boolean[], sizes: number[]) => void;
  lazy?: boolean;
  destroyOnHidden?: boolean;
  draggerIcon?: React.ReactNode;
  motion?: boolean;
}

export interface PanelProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  min?: number | string;
  max?: number | string;
  size?: number | string;
  collapsible?:
    | boolean
    | {
        start?: boolean;
        end?: boolean;
        showCollapsibleIcon?: ShowCollapsibleIconMode;
        icon?: { start?: React.ReactNode; end?: React.ReactNode };
        motion?: boolean;
      };
  resizable?: boolean;
  defaultSize?: number | string;
  destroyOnHidden?: boolean;
}

export interface InternalPanelProps extends PanelProps {
  className?: string;
  prefixCls?: string;
  id?: string;
  supportMotion?: boolean;
}

// 优化后的代码示例
import React, { useMemo, useState } from 'react';
import { QuestionCircleOutlined, UpOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { globalConfig } from 'antd/lib/config-provider';
import clsx from 'clsx';

import './style';

import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import type { LabelTooltipType } from '../_util';
import { toTooltipProps } from '../_util';
import Collapsible from '../collapsible';

function isControlled(props: IBlockHeaderProps) {
  return props.expand !== undefined;
}

export interface IBlockHeaderProps {
  /** id */
  id?: string;
  /** 标题 */
  title: React.ReactNode;
  /** 标题前的图标，默认是一个色块 */
  addonBefore?: React.ReactNode;
  /** 标题后的提示说明文字 */
  description?: React.ReactNode;
  /** 默认展示为问号的tooltip */
  tooltip?: LabelTooltipType;
  /** 后缀自定义内容块 */
  addonAfter?: React.ReactNode;
  /**
   * 小标题 font-size: 12px; line-height: 32px
   * 中标题 font-size: 14px; line-height: 40px
   * 大标题 font-size: 16px; line-height: 40px
   * 默认 中标题
   */
  size?: SizeType;
  /** 自定义 Bottom 值 */
  spaceBottom?:
    | {
        expand?: number;
        collapse?: number;
      }
    | number;
  /** 标题一行的样式类名 */
  className?: string;
  /** 标题的样式类名 */
  style?: React.CSSProperties;
  /** 展示内容(children)的样式类名 */
  contentClassName?: string;
  /** 展示内容(children)的样式 */
  contentStyle?: React.CSSProperties;
  /** 是否显示背景, 默认 true */
  background?: boolean;
  /** 当前展开状态 */
  expand?: boolean;
  /** 是否可展开, 默认 true */
  expandable?: boolean;
  /** 是否默认展开内容, 默认为 false */
  defaultExpand?: boolean;
  /** 展开/收起的内容 */
  children?: React.ReactNode;
  /** 展开/收起时的回调 */
  onExpand?: (expand: boolean) => void;
  /** 标题的样式 */
  titleStyle?: React.CSSProperties;
  /** 是否保留 DOM 结构, 默认 false */
  keepDOM?: boolean;
  /** 是否懒加载, 默认 false */
  lazy?: boolean;
}

const prefixCls = globalConfig().getPrefixCls('block-header');
const preTitleRowCls = `${prefixCls}__title`;

const BlockHeader: React.FC<IBlockHeaderProps> = (props) => {
  const {
    id,
    title,
    description = '',
    tooltip,
    size = 'middle',
    spaceBottom = { expand: 16, collapse: 16 },
    className = '',
    contentClassName = '',
    style = {},
    contentStyle = {},
    background = true,
    defaultExpand = true,
    addonAfter,
    expand,
    children = '',
    addonBefore = <div className="addon-before--default" />,
    onExpand,
    titleStyle,
    keepDOM = false,
    lazy = false,
    expandable = true,
  } = props;

  const [internalExpand, setInternalExpand] = useState(defaultExpand);

  const currentExpand = isControlled(props) ? (expand ?? false) : internalExpand;

  const showCollapse = expandable && !!children;

  const tooltipProps = toTooltipProps(tooltip);

  const bottomStyle = useMemo<React.CSSProperties>(() => {
    if (typeof spaceBottom === 'number') {
      return { marginBottom: spaceBottom };
    }
    const key = currentExpand ? 'expand' : 'collapse';

    return { marginBottom: spaceBottom[key] ?? 0 };
  }, [spaceBottom, currentExpand]);

  const handleExpand = () => {
    const newExpandState = !currentExpand;
    !isControlled(props) && setInternalExpand(newExpandState);
    onExpand?.(newExpandState);
  };

  return (
    <div id={id} className={clsx(`${prefixCls}`, className)} style={{ ...bottomStyle, ...style }}>
      <div
        className={clsx(preTitleRowCls, `${preTitleRowCls}--${size}`, {
          [`${preTitleRowCls}--background`]: background,
          [`${preTitleRowCls}--pointer`]: showCollapse,
        })}
        style={titleStyle}
        onClick={showCollapse ? handleExpand : undefined}
      >
        <div className="title__box">
          {addonBefore ? (
            <div className={`title__addon-before title__addon-before--${size}`}>{addonBefore}</div>
          ) : null}
          <div className="title__text">{title}</div>
          {tooltipProps?.title ? (
            <div className={`title__tooltip`}>
              <Tooltip {...tooltipProps} className={clsx(tooltipProps?.className)}>
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          ) : null}
          {description ? <div className={`title__description`}>{description}</div> : null}
        </div>
        {addonAfter && <div className={`title__addon-after`}>{addonAfter}</div>}
        {showCollapse && (
          <div className={`title__collapse`}>
            <div className="collapse__text">{currentExpand ? '收起' : '展开'}</div>
            <UpOutlined
              className={clsx('collapse__icon', {
                'collapse__icon--up': currentExpand,
                'collapse__icon--down': !currentExpand,
              })}
            />
          </div>
        )}
      </div>
      <Collapsible isOpen={currentExpand} keepDOM={keepDOM} lazyRender={lazy}>
        <div
          className={clsx(`${prefixCls}__content`, contentClassName, {
            [`${prefixCls}__content--active`]: currentExpand || !showCollapse,
          })}
          style={contentStyle}
        >
          {children}
        </div>
      </Collapsible>
    </div>
  );
};

export default BlockHeader;

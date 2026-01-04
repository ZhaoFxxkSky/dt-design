import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { QuestionCircleOutlined, UpOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { globalConfig } from 'antd/es/config-provider';
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
  /** 标题 */
  title: ReactNode;
  /** 标题前的图标，默认是一个色块 */
  addonBefore?: ReactNode;
  /** 标题后的提示说明文字 */
  description?: ReactNode;
  /** 默认展示为问号的tooltip */
  tooltip?: LabelTooltipType;
  /** 后缀自定义内容块 */
  addonAfter?: ReactNode;
  /**
   * 小标题 font-size: 12px; line-height: 32px
   * 中标题 font-size: 14px; line-height: 40px
   * 大标题 font-size: 16px; line-height: 40px
   * 默认 中标题
   */
  size?: SizeType;
  /** 自定义 Bottom 值 */
  spaceBottom?: number;
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
  /** 是否默认展开内容, 默认为 undefined */
  defaultExpand?: boolean;
  /** 展开/收起的内容 */
  children?: ReactNode;
  /** 展开/收起时的回调 */
  onExpand?: (expand: boolean) => void;
  /** 标题的样式 */
  titleStyle?: React.CSSProperties;
}

const prefixCls = globalConfig().getPrefixCls('block-header');
const preTitleRowCls = `${prefixCls}__title`;

const BlockHeader: React.FC<IBlockHeaderProps> = (props) => {
  const {
    title,
    description = '',
    tooltip,
    size = 'middle',
    spaceBottom = 16,
    className = '',
    contentClassName = '',
    style = {},
    contentStyle = {},
    background = true,
    defaultExpand,
    addonAfter,
    expand,
    children = '',
    addonBefore = <div className="addon-before--default" />,
    onExpand,
    titleStyle,
  } = props;

  const [internalExpand, setInternalExpand] = useState(defaultExpand);

  const currentExpand = isControlled(props) ? expand : internalExpand;

  // 只有在有了 children 并且设置了 expand/defaultExpand 的时候才能够展开收起
  const showCollapse =
    (typeof expand === 'boolean' || typeof defaultExpand === 'boolean') && children;

  const tooltipProps = toTooltipProps(tooltip);

  let bottomStyle: React.CSSProperties = {};
  if (spaceBottom)
    bottomStyle =
      showCollapse && !currentExpand ? { marginBottom: 0 } : { marginBottom: spaceBottom };

  const handleExpand = (expand: boolean) => {
    if (!children) return;
    !isControlled(props) && setInternalExpand(expand);
    onExpand?.(expand);
  };

  return (
    <div className={clsx(`${prefixCls}`, className)} style={{ ...bottomStyle, ...style }}>
      <div
        className={clsx(preTitleRowCls, `${preTitleRowCls}--${size}`, {
          [`${preTitleRowCls}--background`]: background,
          [`${preTitleRowCls}--pointer`]: showCollapse,
        })}
        style={titleStyle}
        onClick={() => showCollapse && handleExpand(!currentExpand)}
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
      {
        <Collapsible isOpen={!currentExpand}>
          <div
            className={clsx(`${prefixCls}__content`, contentClassName, {
              [`${prefixCls}__content--active`]: currentExpand || !showCollapse,
            })}
            style={contentStyle}
          >
            {children}
          </div>
        </Collapsible>
      }
    </div>
  );
};

export default BlockHeader;

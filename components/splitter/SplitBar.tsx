import React, { useState } from 'react';
import { DownOutlined, LeftOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import useEvent from 'rc-util/es/hooks/useEvent';

import useDragListeners from './hooks/useDragListeners';

export type ShowCollapsibleIconMode = boolean | 'auto';

export interface SplitBarProps {
  index: number;
  active: boolean;
  prefixCls: string;
  resizable: boolean;
  startCollapsible: boolean;
  endCollapsible: boolean;
  showStartCollapsibleIcon: ShowCollapsibleIconMode;
  showEndCollapsibleIcon: ShowCollapsibleIconMode;
  draggerIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onOffsetStart: (index: number) => void;
  onOffsetUpdate: (index: number, offsetX: number, offsetY: number, lazyEnd?: boolean) => void;
  onOffsetEnd: (lazyEnd?: boolean) => void;
  onCollapse: (index: number, type: 'start' | 'end') => void;
  vertical: boolean;
  ariaNow: number;
  ariaMin: number;
  ariaMax: number;
  ariaControls: string;
  lazy?: boolean;
  containerSize: number;
}

function getValidNumber(num?: number): number {
  return typeof num === 'number' && !Number.isNaN(num) && Number.isFinite(num)
    ? Math.round(num)
    : 0;
}

const SplitBar: React.FC<SplitBarProps> = (props) => {
  const {
    prefixCls,
    vertical,
    index,
    active,
    ariaNow,
    ariaMin,
    ariaMax,
    ariaControls,
    resizable,
    startCollapsible,
    endCollapsible,
    draggerIcon,
    startIcon,
    endIcon,
    onOffsetStart,
    onOffsetUpdate,
    onOffsetEnd,
    onCollapse,
    lazy,
    containerSize,
    showStartCollapsibleIcon,
    showEndCollapsibleIcon,
  } = props;

  const splitBarPrefixCls = `${prefixCls}-bar`;

  const [startPos, setStartPos] = useState<readonly [number, number] | null>(null);
  const [constrainedOffset, setConstrainedOffset] = useState<number>(0);

  const constrainedOffsetX = vertical ? 0 : constrainedOffset;
  const constrainedOffsetY = vertical ? constrainedOffset : 0;

  const STEP = 10;

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (resizable && e.currentTarget) {
      e.preventDefault();
      setStartPos([e.pageX, e.pageY]);
      onOffsetStart(index);
    }
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (resizable && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setStartPos([touch.pageX, touch.pageY]);
      onOffsetStart(index);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!resizable) {
      return;
    }

    const isHorizontal = !vertical;
    let offsetX = 0;
    let offsetY = 0;

    switch (e.key) {
      case 'ArrowLeft':
        offsetX = isHorizontal ? -STEP : 0;
        break;
      case 'ArrowRight':
        offsetX = isHorizontal ? STEP : 0;
        break;
      case 'ArrowUp':
        offsetY = isHorizontal ? 0 : -STEP;
        break;
      case 'ArrowDown':
        offsetY = isHorizontal ? 0 : STEP;
        break;
      case 'Home':
        onOffsetUpdate(index, isHorizontal ? -containerSize : 0, isHorizontal ? 0 : -containerSize);
        return;
      case 'End':
        onOffsetUpdate(index, isHorizontal ? containerSize : 0, isHorizontal ? 0 : containerSize);
        return;
      default:
        return;
    }

    e.preventDefault();
    onOffsetUpdate(index, offsetX, offsetY);
  };

  const getConstrainedOffset = (rawOffset: number) => {
    const currentPos = (containerSize * ariaNow) / 100;
    const newPos = currentPos + rawOffset;

    const minAllowed = Math.max(0, (containerSize * ariaMin) / 100);
    const maxAllowed = Math.min(containerSize, (containerSize * ariaMax) / 100);

    const clampedPos = Math.max(minAllowed, Math.min(maxAllowed, newPos));
    return clampedPos - currentPos;
  };

  const handleLazyMove = useEvent((offsetX: number, offsetY: number) => {
    const constrainedOffsetValue = getConstrainedOffset(vertical ? offsetY : offsetX);
    setConstrainedOffset(constrainedOffsetValue);
  });

  const handleLazyEnd = useEvent(() => {
    onOffsetUpdate(index, constrainedOffsetX, constrainedOffsetY, true);
    setConstrainedOffset(0);
    onOffsetEnd(true);
  });

  const getVisibilityClass = (mode: ShowCollapsibleIconMode): string => {
    switch (mode) {
      case true:
        return `${splitBarPrefixCls}-collapse-bar-always-visible`;
      case false:
        return `${splitBarPrefixCls}-collapse-bar-always-hidden`;
      case 'auto':
        return `${splitBarPrefixCls}-collapse-bar-hover-only`;
    }
  };

  useDragListeners({
    startPos,
    vertical,
    lazy,
    onOffsetUpdate,
    onOffsetEnd,
    handleLazyMove,
    handleLazyEnd,
    setStartPos,
    index,
  });

  const transformStyle: React.CSSProperties = {
    [`--${splitBarPrefixCls}-preview-offset`]: `${constrainedOffset}px`,
  };

  const startIconNode = startIcon || (vertical ? <UpOutlined /> : <LeftOutlined />);
  const endIconNode = endIcon || (vertical ? <DownOutlined /> : <RightOutlined />);
  const startIconCustomized = startIcon !== undefined;
  const endIconCustomized = endIcon !== undefined;

  return (
    <div
      className={splitBarPrefixCls}
      role="separator"
      tabIndex={resizable ? 0 : -1}
      aria-valuenow={getValidNumber(ariaNow)}
      aria-valuemin={getValidNumber(ariaMin)}
      aria-valuemax={getValidNumber(ariaMax)}
      aria-controls={ariaControls}
      onKeyDown={onKeyDown}
    >
      {lazy && (
        <div
          className={clsx(`${splitBarPrefixCls}-preview`, {
            [`${splitBarPrefixCls}-preview-active`]: !!constrainedOffset,
          })}
          style={transformStyle}
        />
      )}

      <div
        className={clsx(`${splitBarPrefixCls}-dragger`, {
          [`${splitBarPrefixCls}-dragger-disabled`]: !resizable,
          [`${splitBarPrefixCls}-dragger-active`]: active,
          [`${splitBarPrefixCls}-dragger-customize`]: draggerIcon !== undefined,
        })}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {draggerIcon !== undefined && (
          <div className={clsx(`${splitBarPrefixCls}-dragger-icon`)}>{draggerIcon}</div>
        )}
      </div>

      {/* Start Collapsible */}
      {startCollapsible && (
        <div
          className={clsx(
            `${splitBarPrefixCls}-collapse-bar`,
            `${splitBarPrefixCls}-collapse-bar-start`,
            {
              [`${splitBarPrefixCls}-collapse-bar-customize`]: startIconCustomized,
            },
            getVisibilityClass(showStartCollapsibleIcon),
          )}
          onClick={() => onCollapse(index, 'start')}
        >
          <span
            className={clsx(
              `${splitBarPrefixCls}-collapse-icon`,
              `${splitBarPrefixCls}-collapse-start`,
            )}
          >
            {startIconNode}
          </span>
        </div>
      )}

      {endCollapsible && (
        <div
          className={clsx(
            `${splitBarPrefixCls}-collapse-bar`,
            `${splitBarPrefixCls}-collapse-bar-end`,
            {
              [`${splitBarPrefixCls}-collapse-bar-customize`]: endIconCustomized,
            },
            getVisibilityClass(showEndCollapsibleIcon),
          )}
          onClick={() => onCollapse(index, 'end')}
        >
          <span
            className={clsx(
              `${splitBarPrefixCls}-collapse-icon`,
              `${splitBarPrefixCls}-collapse-end`,
            )}
          >
            {endIconNode}
          </span>
        </div>
      )}
    </div>
  );
};

export default SplitBar;

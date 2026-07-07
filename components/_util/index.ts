import React from 'react';
import type { TooltipProps } from 'antd';

export type LabelTooltipType = TooltipProps | TooltipProps['title'];

export function toTooltipProps(tooltip: LabelTooltipType): TooltipProps | null {
  if (tooltip !== null && typeof tooltip === 'object' && !React.isValidElement(tooltip)) {
    return tooltip as TooltipProps;
  }
  return {
    title: tooltip,
  };
}

export * from './is';
export * from './validate';
export * from './scrollbar';
export * from './rcUtil';
export * from './type';
export * from './warning';
export * from './scrollTo';
export * from './getScroll';

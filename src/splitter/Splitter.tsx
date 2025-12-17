import React, { useContext, useState } from 'react';
import { ConfigContext } from 'antd/es/config-provider';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import useEvent from 'rc-util/es/hooks/useEvent';
import warning from 'rc-util/es/warning';

import useItems from './hooks/useItems';
import useResizable from './hooks/useResizable';
import useResize from './hooks/useResize';
import useSizes from './hooks/useSizes';
import type { SplitterProps } from './interface';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';
import './style/index.less';

const Splitter: React.FC<React.PropsWithChildren<SplitterProps>> = (props) => {
    const {
        prefixCls: customizePrefixCls,
        className,
        style,
        layout = 'horizontal',
        children,
        rootClassName,
        onResizeStart,
        onResize,
        onResizeEnd,
        lazy,
    } = props;

    const { getPrefixCls, direction } = useContext(ConfigContext);
    const prefixCls = getPrefixCls('splitter', customizePrefixCls);

    // ======================== Direct ========================
    const isVertical = layout === 'vertical';
    const isRTL = direction === 'rtl';
    const reverse = !isVertical && isRTL;

    // ====================== Items Data ======================
    const items = useItems(children);

    // >>> Warning 适配 v4
    if (process.env.NODE_ENV !== 'production') {
        let existSize = false;
        let existUndefinedSize = false;

        items.forEach((item) => {
            if (item.size !== undefined) {
                existSize = true;
            } else {
                existUndefinedSize = true;
            }
        });

        if (existSize && existUndefinedSize && !onResize) {
            warning(
                false,
                'When part of `Splitter.Panel` has `size`, `onResize` is required or change `size` to `defaultSize`.'
            );
        }
    }

    // ====================== Container =======================
    const [containerSize, setContainerSize] = useState<number | undefined>();

    const onContainerResize = (size: { offsetWidth: number; offsetHeight: number }) => {
        const { offsetWidth, offsetHeight } = size;
        const containerSize = isVertical ? offsetHeight : offsetWidth;
        if (containerSize === 0) {
            return;
        }
        setContainerSize(containerSize);
    };

    // ========================= Size =========================
    const [panelSizes, itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes, updateSizes] =
        useSizes(items, containerSize);

    // ====================== Resizable =======================
    const resizableInfos = useResizable(items, itemPxSizes, isRTL);

    const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(
        items,
        resizableInfos,
        itemPtgSizes,
        containerSize,
        updateSizes,
        isRTL
    );

    // ======================== Events ========================
    const onInternalResizeStart = useEvent((index: number) => {
        onOffsetStart(index);
        onResizeStart?.(itemPxSizes);
    });

    const onInternalResizeUpdate = useEvent((index: number, offset: number, lazyEnd?: boolean) => {
        const nextSizes = onOffsetUpdate(index, offset);

        if (lazyEnd) {
            onResizeEnd?.(nextSizes);
        } else {
            onResize?.(nextSizes);
        }
    });

    const onInternalResizeEnd = useEvent((lazyEnd?: boolean) => {
        onOffsetEnd();

        if (!lazyEnd) {
            onResizeEnd?.(itemPxSizes);
        }
    });

    const onInternalCollapse = useEvent((index: number, type: 'start' | 'end') => {
        const nextSizes = onCollapse(index, type);
        onResize?.(nextSizes);
        onResizeEnd?.(nextSizes);
    });

    const containerClassName = classNames(
        prefixCls,
        className,
        `${prefixCls}-${layout}`,
        {
            [`${prefixCls}-rtl`]: isRTL,
        },
        rootClassName
    );

    // ======================== Render ========================
    const maskCls = `${prefixCls}-mask`;

    const stackSizes = React.useMemo(() => {
        const mergedSizes: number[] = [];

        let stack = 0;
        for (let i = 0; i < items.length; i += 1) {
            stack += itemPtgSizes[i];
            mergedSizes.push(stack);
        }

        return mergedSizes;
    }, [itemPtgSizes]);

    const mergedStyle: React.CSSProperties = { ...style };

    return (
        <ResizeObserver onResize={onContainerResize}>
            <div style={mergedStyle} className={containerClassName}>
                {items.map((item, idx) => {
                    // Panel
                    const panel = (
                        <InternalPanel {...item} prefixCls={prefixCls} size={panelSizes[idx]} />
                    );

                    let splitBar: React.ReactElement | null = null;

                    const resizableInfo = resizableInfos[idx];
                    if (resizableInfo) {
                        const ariaMinStart = (stackSizes[idx - 1] || 0) + itemPtgMinSizes[idx];
                        const ariaMinEnd = (stackSizes[idx + 1] || 100) - itemPtgMaxSizes[idx + 1];

                        const ariaMaxStart = (stackSizes[idx - 1] || 0) + itemPtgMaxSizes[idx];
                        const ariaMaxEnd = (stackSizes[idx + 1] || 100) - itemPtgMinSizes[idx + 1];

                        splitBar = (
                            <SplitBar
                                lazy={lazy}
                                index={idx}
                                active={movingIndex === idx}
                                prefixCls={prefixCls}
                                vertical={isVertical}
                                resizable={resizableInfo.resizable}
                                ariaNow={stackSizes[idx] * 100}
                                ariaMin={Math.max(ariaMinStart, ariaMinEnd) * 100}
                                ariaMax={Math.min(ariaMaxStart, ariaMaxEnd) * 100}
                                startCollapsible={resizableInfo.startCollapsible}
                                endCollapsible={resizableInfo.endCollapsible}
                                showStartCollapsibleIcon={resizableInfo.showStartCollapsibleIcon}
                                showEndCollapsibleIcon={resizableInfo.showEndCollapsibleIcon}
                                onOffsetStart={onInternalResizeStart}
                                onOffsetUpdate={(index, offsetX, offsetY, lazyEnd) => {
                                    let offset = isVertical ? offsetY : offsetX;
                                    if (reverse) {
                                        offset = -offset;
                                    }
                                    onInternalResizeUpdate(index, offset, lazyEnd);
                                }}
                                onOffsetEnd={onInternalResizeEnd}
                                onCollapse={onInternalCollapse}
                                containerSize={containerSize || 0}
                            />
                        );
                    }

                    return (
                        <React.Fragment key={`split-panel-${idx}`}>
                            {panel}
                            {splitBar}
                        </React.Fragment>
                    );
                })}

                {typeof movingIndex === 'number' && (
                    <div aria-hidden className={classNames(maskCls, `${maskCls}-${layout}`)} />
                )}
            </div>
        </ResizeObserver>
    );
};

if (process.env.NODE_ENV !== 'production') {
    Splitter.displayName = 'Splitter';
}

export default Splitter;

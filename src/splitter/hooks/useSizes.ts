import React from 'react';

import { PanelProps } from '../interface';
import { autoPtgSizes } from './sizeUtil';

export function getPtg(str: string) {
    return Number(str.slice(0, -1)) / 100;
}

function isPtg(itemSize: string | number | undefined): itemSize is string {
    return typeof itemSize === 'string' && itemSize.endsWith('%');
}

export default function useSizes(items: PanelProps[], containerSize?: number) {
    const propSizes = items.map((item) => item.size);

    const itemsCount = items.length;

    const mergedContainerSize = containerSize || 0;
    const ptg2px = (ptg: number) => ptg * mergedContainerSize;

    const [innerSizes, setInnerSizes] = React.useState<(string | number | undefined)[]>(() =>
        items.map((item) => item.defaultSize)
    );
    const sizes = React.useMemo(() => {
        const mergedSizes: PanelProps['size'][] = [];

        for (let i = 0; i < itemsCount; i += 1) {
            mergedSizes[i] = propSizes[i] ?? innerSizes[i];
        }

        return mergedSizes;
    }, [itemsCount, innerSizes, propSizes]);

    const postPercentMinSizes = React.useMemo(
        () =>
            items.map((item) => {
                if (isPtg(item.min)) {
                    return getPtg(item.min);
                }
                return (item.min || 0) / mergedContainerSize;
            }),
        [items, mergedContainerSize]
    );

    const postPercentMaxSizes = React.useMemo(
        () =>
            items.map((item) => {
                if (isPtg(item.max)) {
                    return getPtg(item.max);
                }
                return (item.max || mergedContainerSize) / mergedContainerSize;
            }),
        [items, mergedContainerSize]
    );

    const postPercentSizes = React.useMemo(() => {
        const ptgList: (number | undefined)[] = [];

        for (let i = 0; i < itemsCount; i += 1) {
            const itemSize = sizes[i];

            if (isPtg(itemSize)) {
                ptgList[i] = getPtg(itemSize);
            } else if (itemSize || itemSize === 0) {
                const num = Number(itemSize);
                if (!Number.isNaN(num)) {
                    ptgList[i] = num / mergedContainerSize;
                }
            } else {
                ptgList[i] = undefined;
            }
        }

        return autoPtgSizes(ptgList, postPercentMinSizes, postPercentMaxSizes);
    }, [sizes, mergedContainerSize, postPercentMinSizes, postPercentMaxSizes]);

    const postPxSizes = React.useMemo(
        () => postPercentSizes.map(ptg2px),
        [postPercentSizes, mergedContainerSize]
    );

    const panelSizes = React.useMemo(
        () => (containerSize ? postPxSizes : sizes),
        [postPxSizes, containerSize]
    );

    return [
        panelSizes,
        postPxSizes,
        postPercentSizes,
        postPercentMinSizes,
        postPercentMaxSizes,
        setInnerSizes,
    ] as const;
}

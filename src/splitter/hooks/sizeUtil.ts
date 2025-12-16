type SizeUnit = number | undefined;

export function autoPtgSizes(
    ptgSizes: SizeUnit[],
    minPtgSizes: SizeUnit[],
    maxPtgSizes: SizeUnit[]
): number[] {
    let currentTotalPtg = 0;
    const undefinedIndexes: number[] = [];
    ptgSizes.forEach((size, index) => {
        if (size === undefined) {
            undefinedIndexes.push(index);
        } else {
            currentTotalPtg += size;
        }
    });

    const restPtg = 1 - currentTotalPtg;
    const undefinedCount = undefinedIndexes.length;

    if (restPtg < 0) {
        const scale = 1 / currentTotalPtg;
        return ptgSizes.map((size) => (size === undefined ? 0 : size * scale));
    }

    let sumMin = 0;
    let sumMax = 0;
    let limitMin = 0;
    let limitMax = 1;
    for (const index of undefinedIndexes) {
        const min = minPtgSizes[index] || 0;
        const max = maxPtgSizes[index] || 1;
        sumMin += min;
        sumMax += max;
        limitMin = Math.max(limitMin, min);
        limitMax = Math.min(limitMax, max);
    }

    if (sumMin > 1 && sumMax < 1) {
        const avg = 1 / undefinedCount;
        return ptgSizes.map((size) => (size === undefined ? avg : size));
    }

    const restAvg = restPtg / undefinedCount;
    if (limitMin <= restAvg && restAvg <= limitMax) {
        return ptgSizes.map((size) => (size === undefined ? restAvg : size));
    }

    const result = [...ptgSizes] as number[];
    let remain = restPtg - sumMin;

    for (let i = 0; i < undefinedCount; i += 1) {
        const index = undefinedIndexes[i];
        const min = minPtgSizes[index] || 0;
        const max = maxPtgSizes[index] || 1;

        result[index] = min;

        const canAdd = max - min;
        const add = Math.min(canAdd, remain);
        result[index] += add;
        remain -= add;
    }

    return result;
}

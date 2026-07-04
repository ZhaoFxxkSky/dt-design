export type Orientation = 'horizontal' | 'vertical';

export default function useOrientation(
  orientation?: Orientation,
  vertical?: boolean,
  layout?: Orientation,
): [Orientation, boolean] {
  const mergedOrientation =
    orientation ?? (vertical ? 'vertical' : undefined) ?? layout ?? 'horizontal';
  const isVertical = mergedOrientation === 'vertical';
  return [mergedOrientation, isVertical];
}

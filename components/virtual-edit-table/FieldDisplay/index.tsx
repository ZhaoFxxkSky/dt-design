import React from 'react';
import { defaultDisplayRenderers } from './registry';
import type { FieldDisplayProps, FieldDisplayRenderer } from './types';

const FieldDisplay: React.FC<FieldDisplayProps> = ({ field, value, renderers }) => {
  const mergedRenderers: Record<string, FieldDisplayRenderer> = React.useMemo(
    () => ({ ...defaultDisplayRenderers, ...renderers }),
    [renderers],
  );

  const componentType = field.component || 'text';
  const Renderer = mergedRenderers[componentType] || mergedRenderers.text;

  return <Renderer field={field} value={value} />;
};

export default FieldDisplay;
export type { FieldDisplayProps, FieldDisplayRenderer, FieldDisplayRendererProps } from './types';

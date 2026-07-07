import React from 'react';
import { defaultRenderers } from './registry';
import type { FieldEditorProps, FieldRenderer } from './types';

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  value,
  hasError = false,
  disabled,
  readOnly,
  renderers,
  onChange,
}) => {
  const mergedRenderers: Record<string, FieldRenderer> = React.useMemo(
    () => ({ ...defaultRenderers, ...renderers }),
    [renderers],
  );

  const componentType = field.component || 'text';
  const Renderer = mergedRenderers[componentType] || mergedRenderers.text;

  return (
    <Renderer
      field={field}
      value={value}
      hasError={hasError}
      disabled={disabled}
      readOnly={readOnly}
      onChange={onChange}
    />
  );
};

export default FieldEditor;
export type { FieldEditorProps, FieldRenderer, FieldRendererProps } from './types';

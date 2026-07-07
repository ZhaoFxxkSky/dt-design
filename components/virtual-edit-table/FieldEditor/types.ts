import type React from 'react';
import type { TableColumn } from '../VirtualEditTable/types';

export type FieldRendererProps = {
  field: TableColumn;
  value: any;
  hasError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange: (value: any) => void;
};

export type FieldRenderer = React.ComponentType<FieldRendererProps>;

export type FieldEditorProps = {
  field: TableColumn;
  value: any;
  hasError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  renderers?: Record<string, FieldRenderer>;
  onChange: (value: any) => void;
};

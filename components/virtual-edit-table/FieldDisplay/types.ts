import type React from 'react';
import type { TableColumn } from '../VirtualEditTable/types';

export type FieldDisplayRendererProps = {
  field: TableColumn;
  value: any;
};

export type FieldDisplayRenderer = React.ComponentType<FieldDisplayRendererProps>;

export type FieldDisplayProps = {
  field: TableColumn;
  value: any;
  renderers?: Record<string, FieldDisplayRenderer>;
};

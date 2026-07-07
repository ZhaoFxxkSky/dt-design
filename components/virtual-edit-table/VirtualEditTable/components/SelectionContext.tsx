import React from 'react';
import type { RowSelection } from '../types';

export type SelectionContextValue = {
  rowSelection: false | RowSelection;
  selectedRows: Set<number>;
  rows: Record<string, any>[];
  rowsCount: number;
  disabledRows: Set<number>;
  getRowKey: (record: Record<string, any>, index: number) => string;
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  selectAll: () => void;
  invertSelection: () => void;
  clearSelection: () => void;
  setSelectedByKeys: (keys: string[]) => void;
};

const SelectionContext = React.createContext<SelectionContextValue | null>(null);

export const SelectionProvider = SelectionContext.Provider;

export const useSelection = () => {
  const ctx = React.useContext(SelectionContext);
  if (!ctx) {
    throw new Error('useSelection must be used within SelectionProvider');
  }
  return ctx;
};

export default SelectionContext;

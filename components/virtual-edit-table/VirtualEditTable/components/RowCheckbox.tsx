import { Checkbox, Radio } from 'antd';
import React from 'react';
import { useSelection } from './SelectionContext';

export type RowCheckboxProps = {
  rowIndex: number;
};

const RowCheckbox: React.FC<RowCheckboxProps> = ({ rowIndex }) => {
  const { rowSelection, selectedRows, rows, toggleRow } = useSelection();

  if (rowSelection === false) return null;

  const checkboxProps = rowSelection?.getCheckboxProps?.(rows[rowIndex], rowIndex) ?? {};
  const checked = selectedRows.has(rowIndex);

  if (rowSelection?.type === 'radio') {
    return (
      <Radio
        checked={checked}
        disabled={checkboxProps.disabled}
        onChange={() => toggleRow(rowIndex)}
      />
    );
  }

  return (
    <Checkbox
      checked={checked}
      disabled={checkboxProps.disabled}
      onChange={() => toggleRow(rowIndex)}
    />
  );
};

export default RowCheckbox;

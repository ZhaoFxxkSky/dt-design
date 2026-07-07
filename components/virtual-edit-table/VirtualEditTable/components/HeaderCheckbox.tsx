import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';
import { useSelection } from './SelectionContext';
import styles from '../style.less';

const HeaderCheckbox: React.FC = () => {
  const {
    rowSelection,
    selectedRows,
    rows,
    rowsCount,
    disabledRows,
    getRowKey,
    toggleAll,
    selectAll,
    invertSelection,
    clearSelection,
    setSelectedByKeys,
  } = useSelection();

  const changeableRowKeys = React.useMemo(
    () => rows.map((row, i) => getRowKey(row, i)).filter((_, i) => !disabledRows.has(i)),
    [rows, getRowKey, disabledRows],
  );

  const selectedRowKeys = React.useMemo(
    () =>
      rows
        .map((row, i) => (selectedRows.has(i) ? getRowKey(row, i) : null))
        .filter((key): key is string => key !== null),
    [rows, selectedRows, getRowKey],
  );

  if (rowSelection === false) return null;

  const isRadio = rowSelection.type === 'radio';
  const hideSelectAll = rowSelection.hideSelectAll ?? false;
  const selectableCount = rowsCount - disabledRows.size;
  const selectedSelectableCount = Array.from(selectedRows).filter((i) => !disabledRows.has(i)).length;
  const isAllSelected = selectableCount > 0 && selectedSelectableCount === selectableCount;
  const isIndeterminate = selectedSelectableCount > 0 && selectedSelectableCount < selectableCount;

  const defaultItems: MenuProps['items'] = [
    { key: 'all', label: '全选', disabled: selectableCount === 0 },
    { key: 'invert', label: '反选', disabled: selectableCount === 0 },
    { key: 'clear', label: '清除', disabled: selectedRows.size === 0 },
  ];

  const customItems: MenuProps['items'] =
    rowSelection.selections === false
      ? []
      : rowSelection.selections?.map((item) => ({
          key: item.key,
          label: item.text,
          onClick: () => {
            const returned = item.onSelect?.(changeableRowKeys);
            if (returned !== undefined) {
              setSelectedByKeys(returned);
            } else {
              // 未返回值时使用当前已选 key
              setSelectedByKeys(selectedRowKeys);
            }
          },
        }));

  const menuItems: MenuProps['items'] = customItems?.length
    ? [...defaultItems, { type: 'divider' }, ...customItems]
    : defaultItems;

  const menu: MenuProps = {
    onClick: ({ key }) => {
      if (key === 'all') {
        selectAll();
      } else if (key === 'invert') {
        invertSelection();
      } else if (key === 'clear') {
        clearSelection();
      }
    },
    items: menuItems,
  };

  const showCheckbox = !isRadio && !hideSelectAll;
  const showDropdown = !isRadio && (rowSelection.selections !== false || !hideSelectAll);

  if (!showCheckbox && !showDropdown) {
    return null;
  }

  const content = (
    <div className={styles.headerCheckboxCell}>
      {showCheckbox && (
        <div className={styles.headerCheckboxBox}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onClick={(e) => e.stopPropagation()}
            onChange={toggleAll}
          />
        </div>
      )}
      {showDropdown && (
        <div className={showCheckbox ? styles.headerCheckboxArrow : styles.headerCheckboxArrowOnly}>
          <DownOutlined />
        </div>
      )}
    </div>
  );

  return (
    <Dropdown menu={menu} placement="bottomLeft" trigger={['click']}>
      {content}
    </Dropdown>
  );
};

export default HeaderCheckbox;

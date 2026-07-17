import type { ReactNode } from 'react';
import React from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import type { ButtonProps } from '@dtjoy/dt-design';
import { Button } from '@dtjoy/dt-design';
import type { DropDownProps } from 'antd';
import { Divider, Dropdown } from 'antd';
import { globalConfig } from 'antd/lib/config-provider';

import './style';

import clsx from 'clsx';

export type ActionItem = {
  key: React.Key;
  name: ReactNode;
  disabled?: boolean;
  render?: () => ReactNode;
};

interface ICollapsibleActionItems {
  maxCount?: number; // 最多展示数量，超出折叠到下拉菜单中
  actionItems: ActionItem[];
  className?: string;
  divider?: ReactNode; // 分隔符
  collapseIcon?: ReactNode; // 折叠菜单图标
  dropdownProps?: Partial<DropDownProps>;
  buttonProps?: Partial<ButtonProps>;
  style?: React.CSSProperties;

  onItemClick?: (key: React.Key) => void;
}

const CollapsibleActionItems: React.FC<ICollapsibleActionItems> = (props) => {
  const {
    actionItems,
    maxCount = 3,
    className,
    divider = <Divider type="vertical" />,
    collapseIcon = <EllipsisOutlined />,
    dropdownProps,
    buttonProps,
    style,
    onItemClick,
  } = props;
  const isOverMaxCount = actionItems.length > maxCount;

  const prefixCls = globalConfig().getPrefixCls('collapsible-action-items');

  const getActionItemNode = (item: ActionItem) => {
    const customRender = item.render ? item.render() : null;
    return (
      <span
        className={`${prefixCls}__btn`}
        key={item.key}
        onClick={() => !item.disabled && onItemClick?.(item.key)}
      >
        {customRender || (
          <Button type="link" disabled={item.disabled} {...buttonProps}>
            {item.name}
          </Button>
        )}
      </span>
    );
  };

  const displayAction = actionItems
    .slice(0, isOverMaxCount ? maxCount - 1 : maxCount)
    .map((item) => getActionItemNode(item));

  const collapsedItems = isOverMaxCount ? actionItems.slice(maxCount - 1) : [];

  const menuItems = React.useMemo(
    () =>
      collapsedItems.map((item) => ({
        key: item.key,
        disabled: item.disabled,
        label: item.render ? item.render() : item.name,
      })),
    [collapsedItems],
  );

  return (
    <div className={clsx(prefixCls, className)} style={style}>
      {displayAction.map((actionItem, index) => {
        const showDivider = index < actionItems.length - 1;
        return (
          <React.Fragment key={actionItem.key}>
            {actionItem}
            {showDivider && divider}
          </React.Fragment>
        );
      })}
      {collapsedItems.length > 0 && (
        <Dropdown
          placement={'bottomRight'}
          menu={{
            items: menuItems,
            onClick: (info) => onItemClick?.(info.key),
          }}
          getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
          {...dropdownProps}
        >
          {/** biome-ignore lint/a11y/useValidAnchor: it is hard to refactor */}
          <a className={`${prefixCls}__icon`}>{collapseIcon}</a>
        </Dropdown>
      )}
    </div>
  );
};

export default CollapsibleActionItems;

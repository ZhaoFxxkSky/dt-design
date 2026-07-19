export const EXPAND_COLUMN = {} as const;

export const INTERNAL_HOOKS = 'rc-table-internal-hook';

/**
 * 内部列（rowSelection / expand）未显式设置宽度时的首帧提示宽度。
 * 虚拟模式下这些列的真实宽度由 CSS 类驱动（LESS 变量 / 用户覆盖均可生效），
 * 并经测量管线同步进网格计算；此常量仅用于首次渲染与无法测量的环境（如 jsdom、
 * showHeader=false），不是宽度的事实源。
 * 取值需与 style/variables.less 中对应变量保持一致。
 */
export const INTERNAL_COLUMN_DEFAULT_WIDTH: Record<string, number> = {
  // @table-selection-column-width
  SELECTION_COLUMN: 32,
  // @table-expand-column-width
  EXPAND_COLUMN: 48,
};

/**
 * 虚拟模式下未设 width 列的最小填充宽度。
 * antd 原生行为在空间不足时会把无宽列压到 1px（不可用），此处给 60px 保底；
 * 列上显式设置的 minWidth 优先于此值。
 */
export const VIRTUAL_MISSING_WIDTH_COLUMN_MIN = 60;

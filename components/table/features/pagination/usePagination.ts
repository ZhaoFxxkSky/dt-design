import { useState } from 'react';
import { mergeProps } from '../../../_util/rcUtil';

import { isFunction, isPlainObject } from '../../../_util/is';
import type { PaginationProps } from 'antd/lib/pagination';
import type { TablePaginationConfig } from '../../interface';

export const DEFAULT_PAGE_SIZE = 10;

export function getPaginationParam(
  mergedPagination: TablePaginationConfig,
  pagination?: TablePaginationConfig | boolean,
) {
  const param: any = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize,
  };

  const paginationObj = isPlainObject(pagination) ? pagination : {};

  Object.keys(paginationObj).forEach((pageProp) => {
    const value = mergedPagination[pageProp as keyof typeof paginationObj];
    if (!isFunction(value)) {
      param[pageProp] = value;
    }
  });

  return param;
}

function usePagination(
  total: number,
  onChange: (current: number, pageSize: number) => void,
  pagination?: TablePaginationConfig | false,
): readonly [TablePaginationConfig, (current?: number, pageSize?: number) => void] {
  // 从用户传入的 pagination 中分离出 current/pageSize 和其余配置。
  // current/pageSize 均为受控值：传入时每次渲染都以 props 为准（见下方 merge 处注释）；
  // 未传入时作为初始值，后续由 innerPagination 管理（showSizeChanger 才能正常工作）
  const {
    total: paginationTotal = 0,
    current: userCurrent,
    pageSize: userPageSize,
    ...restPaginationObj
  } = isPlainObject(pagination) ? (pagination as any) : {};

  const [innerPagination, setInnerPagination] = useState<{ current?: number; pageSize?: number }>(
    () => ({
      current: userCurrent ?? restPaginationObj.defaultCurrent ?? 1,
      pageSize: userPageSize ?? restPaginationObj.defaultPageSize ?? DEFAULT_PAGE_SIZE,
    }),
  );

  // merge 时：restPaginationObj（showSizeChanger, pageSizeOptions 等）在外层
  // innerPagination（current, pageSize）覆盖 restPaginationObj 中的同名字段
  // 受控语义（对齐 antd）：props.pagination.current / pageSize 每次渲染都生效，覆盖内部值；
  // mergeProps 跳过 undefined — 未受控的字段回退到 innerPagination 对应值
  const mergedPagination = mergeProps(restPaginationObj as any, innerPagination as any, {
    total: paginationTotal > 0 ? paginationTotal : total,
    current: userCurrent,
    pageSize: userPageSize,
  }) as any;

  const maxPage = Math.ceil((paginationTotal || total) / mergedPagination.pageSize!);
  if (mergedPagination.current! > maxPage) {
    mergedPagination.current = maxPage || 1;
  }

  const refreshPagination = (current?: number, pageSize?: number) => {
    setInnerPagination({
      current: current ?? 1,
      pageSize: pageSize || mergedPagination.pageSize,
    });
  };

  const onInternalChange: PaginationProps['onChange'] = (current, pageSize) => {
    if (pagination) {
      pagination.onChange?.(current, pageSize);
    }
    refreshPagination(current, pageSize);
    onChange(current, pageSize || mergedPagination?.pageSize!);
  };

  if (pagination === false) {
    return [{}, () => {}] as const;
  }

  return [
    {
      ...mergedPagination,
      onChange: onInternalChange,
    },
    refreshPagination,
  ] as const;
}

export default usePagination;

import * as React from 'react';
import { render } from '@testing-library/react';
import * as fs from 'fs';
import * as path from 'path';

import '@testing-library/jest-dom/extend-expect';

import { INTERNAL_COLUMN_DEFAULT_WIDTH } from '../constant';
import { Table } from '../index';

const generateData = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ key: i, name: `Row ${i}`, value: i }));

const columns = [
  { key: 'name', dataIndex: 'name', title: 'Name', width: 200 },
  { key: 'value', dataIndex: 'value', title: 'Value', width: 100 },
];

/**
 * 虚拟模式下内部列（rowSelection / expand）未显式设置宽度时：
 * - 表头 / summary 的 `<col>` 不得写内联宽度（交由 CSS 类驱动，支持 LESS 变量与用户覆盖）
 * - body 单元格使用首帧提示值（选择列 32 / 展开列 48），真实宽度由测量管线接管
 */
describe('VirtualTable — auto width internal columns', () => {
  it('rowSelection without columnWidth: header col has no inline width, body cell uses hint width', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 2000, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
      />,
    );

    const selectionCol = container.querySelector('.ant-table-header col.ant-table-selection-col');
    expect(selectionCol).toBeTruthy();
    expect((selectionCol as HTMLElement).style.width).toBe('');

    const selectionCell = container.querySelector<HTMLElement>(
      '[data-row-key] .ant-table-selection-column',
    );
    expect(selectionCell).toBeTruthy();
    expect(selectionCell!.style.width).toBe('32px');
  });

  it('rowSelection without columnWidth: narrow scroll.x should not crush selection column', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 250, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
      />,
    );

    const selectionCell = container.querySelector<HTMLElement>(
      '[data-row-key] .ant-table-selection-column',
    );
    expect(selectionCell).toBeTruthy();
    expect(selectionCell!.style.width).toBe('32px');
  });

  it('rowSelection with explicit columnWidth: wins over hint, col keeps inline width', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 300, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox', columnWidth: 48 }}
      />,
    );

    const selectionCol = container.querySelector<HTMLElement>(
      '.ant-table-header col.ant-table-selection-col',
    );
    expect(selectionCol).toBeTruthy();
    expect(selectionCol!.style.width).toBe('48px');

    const selectionCell = container.querySelector<HTMLElement>(
      '[data-row-key] .ant-table-selection-column',
    );
    expect(selectionCell!.style.width).toBe('48px');
  });

  it('expandedRowRender without columnWidth: header col has no inline width, body cell uses hint width', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 2000, y: 400 }}
        pagination={false}
        expandable={{ expandedRowRender: () => <p>extra</p> }}
      />,
    );

    const expandCol = container.querySelector<HTMLElement>(
      '.ant-table-header col.ant-table-expand-icon-col',
    );
    expect(expandCol).toBeTruthy();
    expect(expandCol!.style.width).toBe('');

    const expandCell = container.querySelector<HTMLElement>(
      '[data-row-key] .ant-table-row-expand-icon-cell',
    );
    expect(expandCell).toBeTruthy();
    expect(expandCell!.style.width).toBe('48px');
  });

  it('expandable with explicit columnWidth: wins over hint', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 300, y: 400 }}
        pagination={false}
        expandable={{ expandedRowRender: () => <p>extra</p>, columnWidth: 64 }}
      />,
    );

    const expandCol = container.querySelector<HTMLElement>(
      '.ant-table-header col.ant-table-expand-icon-col',
    );
    expect(expandCol!.style.width).toBe('64px');

    const expandCell = container.querySelector<HTMLElement>(
      '[data-row-key] .ant-table-row-expand-icon-cell',
    );
    expect(expandCell!.style.width).toBe('64px');
  });

  it('fixed summary: selection col has no inline width, merged cell renders across it', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 2000, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                合计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>100</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />,
    );

    const summaryCol = container.querySelector<HTMLElement>(
      '.ant-table-summary col.ant-table-selection-col',
    );
    expect(summaryCol).toBeTruthy();
    expect(summaryCol!.style.width).toBe('');

    const mergedCell = container.querySelector('.ant-table-summary td[colspan="2"]');
    expect(mergedCell).toBeTruthy();
  });

  it('fixed selection column: following fixed cell offset uses hint width', () => {
    const fixedColumns = [
      { key: 'name', dataIndex: 'name', title: 'Name', width: 200, fixed: 'start' as const },
      { key: 'value', dataIndex: 'value', title: 'Value', width: 100 },
    ];
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={fixedColumns as any}
        rowKey="key"
        virtual
        scroll={{ x: 2000, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox', fixed: 'start' }}
      />,
    );

    // 选择列与 name 列均 fixed start；name 列的偏移 = 选择列宽（提示值 32）
    const fixedCells = container.querySelectorAll<HTMLElement>(
      '[data-row-key] .ant-table-cell-fix-start',
    );
    expect(fixedCells.length).toBeGreaterThanOrEqual(2);
    expect(fixedCells[1]!.style.insetInlineStart).toBe('32px');
  });

  it('reserves auto column width when distributing space to no-width columns', () => {
    const cols = [
      { key: 'name', dataIndex: 'name', title: 'Name', width: 200 },
      { key: 'value', dataIndex: 'value', title: 'Value' }, // 无 width → 弹性列
    ];
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={cols as any}
        rowKey="key"
        virtual
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
      />,
    );

    // 弹性列 = 1000 - 32（选择列预留）- 200（显式列）= 768
    const cells = container.querySelectorAll<HTMLElement>('[data-row-key]')[0]!.children;
    expect((cells[2] as HTMLElement).style.width).toBe('768px');
  });

  it('scales up proportionally (grow-only) when all columns have explicit width', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
      />,
    );

    // 显式列总和 300，可用空间 1000 - 32 = 968，等比放大（只增不减）：
    // name = floor(200 * 968 / 300) = 645，value = 968 - 645 = 323
    const cells = container.querySelectorAll<HTMLElement>('[data-row-key]')[0]!.children;
    expect((cells[1] as HTMLElement).style.width).toBe('645px');
    expect((cells[2] as HTMLElement).style.width).toBe('323px');
    // 选择列不受 scale-up 影响
    expect((cells[0] as HTMLElement).style.width).toBe('32px');
  });

  it('showHeader=false: renders hidden probe carrying CSS width hooks for measurement', () => {
    const { container } = render(
      <Table
        dataSource={generateData(50)}
        columns={columns as any}
        rowKey="key"
        virtual
        showHeader={false}
        scroll={{ x: 2000, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
      />,
    );

    // 无表头时渲染隐藏探针（col 带 -selection-col 类，承载 CSS 宽度供测量）
    const probeCol = container.querySelector('table[aria-hidden="true"] col.ant-table-selection-col');
    expect(probeCol).toBeTruthy();
    expect(probeCol!.closest('table')!.style.visibility).toBe('hidden');

    // body 单元格使用首帧提示值（jsdom 测量为 0，保留提示值）
    const selectionCell = container.querySelector<HTMLElement>(
      '[data-row-key] .ant-table-selection-column',
    );
    expect(selectionCell!.style.width).toBe('32px');
  });

  it('hint widths stay in sync with LESS variables', () => {
    const less = fs.readFileSync(path.join(__dirname, '../style/variables.less'), 'utf-8');

    expect(less).toContain(
      `@table-selection-column-width: ${INTERNAL_COLUMN_DEFAULT_WIDTH.SELECTION_COLUMN}px`,
    );
    expect(less).toContain(
      `@table-expand-column-width: ${INTERNAL_COLUMN_DEFAULT_WIDTH.EXPAND_COLUMN}px`,
    );
  });
});

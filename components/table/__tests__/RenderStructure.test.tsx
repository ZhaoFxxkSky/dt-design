import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';

// ============================================================
// Table rendering structure snapshots
// ============================================================
describe('table rendering structure snapshots', () => {
  const data = [
    { key: '1', name: 'Alice', age: 30 },
    { key: '2', name: 'Bob', age: 25 },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
  ];

  it('basic table renders expected DOM structure', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );

    // Snapshot the key structural elements (not full HTML to avoid fragility)
    const wrapper = container.querySelector('.ant-table-wrapper');
    expect(wrapper).toBeInTheDocument();

    const table = container.querySelector('.ant-table');
    expect(table).toBeInTheDocument();

    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead?.querySelectorAll('th').length).toBe(2);

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody?.querySelectorAll('tr').length).toBe(2);

    // Snapshot the class names of key structural elements
    const structure = {
      wrapperClass: wrapper?.className,
      tableClass: table?.className,
      headerRowCount: thead?.querySelectorAll('tr').length,
      bodyRowCount: tbody?.querySelectorAll('tr').length,
      columnCount: thead?.querySelectorAll('th').length,
    };
    expect(structure).toMatchSnapshot('basic-table-structure');
  });

  it('table with scroll.y renders split header/body', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        scroll={{ y: 200 }}
      />,
    );

    const structure = {
      hasHeader: !!container.querySelector('.ant-table-header'),
      hasBody: !!container.querySelector('.ant-table-body'),
      tableCount: container.querySelectorAll('table').length,
    };
    expect(structure).toMatchSnapshot('scroll-y-structure');
  });

  it('table with bordered renders border classes', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        bordered
      />,
    );

    const table = container.querySelector('.ant-table');
    expect(table?.className).toContain('ant-table-bordered');
  });

  it('table with size variations', () => {
    const { container: smallContainer } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" size="small" />,
    );
    expect(
      smallContainer.querySelector('.ant-table-small') ||
      smallContainer.querySelector('.ant-table-wrapper')?.querySelector('.ant-table-small'),
    ).toBeTruthy();

    const { container: middleContainer } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" size="middle" />,
    );
    expect(
      middleContainer.querySelector('.ant-table-middle') ||
      middleContainer.querySelector('.ant-table-wrapper')?.querySelector('.ant-table-middle'),
    ).toBeTruthy();
  });

  it('table with resizable renders resize elements', () => {
    const cols = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, resizable: true, minWidth: 60 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, resizable: true, minWidth: 60 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols as any} rowKey="key" resizable />,
    );

    const structure = {
      hasResizeLine: !!container.querySelector('.ant-table-resize-line'),
      resizeHandleCount: container.querySelectorAll('thead .ant-table-resize-handle').length,
    };
    expect(structure).toMatchSnapshot('resizable-structure');
  });

  it('table with selection renders checkbox column', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        rowSelection={{}}
      />,
    );

    const structure = {
      checkboxCount: container.querySelectorAll('input[type="checkbox"]').length,
      hasSelectionCol: !!container.querySelector('.ant-table-selection-column'),
    };
    expect(structure).toMatchSnapshot('selection-structure');
  });

  it('table with empty data renders placeholder', () => {
    const { container } = render(
      <Table
        dataSource={[]}
        columns={columns as any}
        rowKey="key"
        locale={{ emptyText: 'No Data' }}
      />,
    );

    const structure = {
      hasPlaceholder: !!container.querySelector('.ant-table-placeholder'),
      bodyRowCount: container.querySelectorAll('tbody tr').length,
    };
    expect(structure).toMatchSnapshot('empty-structure');
  });

  it('table with loading renders spin', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        loading
      />,
    );

    const structure = {
      hasSpin: !!container.querySelector('.ant-spin'),
    };
    expect(structure).toMatchSnapshot('loading-structure');
  });

  it('table with virtual renders virtual body', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      key: String(i),
      name: `Row ${i}`,
      age: i,
    }));
    const { container } = render(
      <Table
        dataSource={largeData}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
      />,
    );

    const structure = {
      hasVirtualBody: !!container.querySelector('[data-row-key]') || !!container.querySelector('.ant-table-tbody'),
      virtualRowCount: container.querySelectorAll('[data-row-key]').length,
    };
    // Virtual rows should be less than total data
    expect(structure.virtualRowCount).toBeLessThan(100);
    expect(structure).toMatchSnapshot('virtual-structure');
  });
});

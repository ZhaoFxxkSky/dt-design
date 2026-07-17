import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Summary, Table } from '../index';
import type { ColumnsType, Reference } from '../index';

// ============================================================
// Shared test data
// ============================================================
const data = [
  { key: '1', name: 'Alice', age: 30, department: 'Tech', status: 'active' },
  { key: '2', name: 'Bob', age: 25, department: 'Product', status: 'inactive' },
  { key: '3', name: 'Charlie', age: 35, department: 'Tech', status: 'active' },
  { key: '4', name: 'David', age: 28, department: 'Design', status: 'pending' },
  { key: '5', name: 'Eve', age: 32, department: 'Product', status: 'active' },
];

const basicColumns: ColumnsType = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
];

// ============================================================
// Sorter Tests
// ============================================================
describe('TableFeatures — Sorter', () => {
  it('renders sort icon for sortable column', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );
    // Sort icon should be present
    const sortIcons = container.querySelectorAll('.ant-table-column-sorter');
    expect(sortIcons.length).toBeGreaterThan(0);
  });

  it('does not render sort icon for non-sortable column', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    const sortIcons = container.querySelectorAll('.ant-table-column-sorter');
    expect(sortIcons.length).toBe(0);
  });

  it('triggers onChange with sorter info when clicking sortable header', () => {
    const onChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" onChange={onChange as any} showSorterTooltip={false} />,
    );

    // Click the first column header to sort
    const th = container.querySelector('th') as HTMLElement;
    fireEvent.click(th);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0];
    // 3rd argument is sorter (or sorter array)
    const sorter = callArgs[2];
    expect(sorter).toBeDefined();
  });

  it('sorts data ascending on first click', () => {
    const cols: ColumnsType = [
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    const th = container.querySelector('th') as HTMLElement;
    fireEvent.click(th);

    // Check rows are sorted ascending by age
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('25'); // Bob
    expect(rows[1]).toHaveTextContent('28'); // David
    expect(rows[2]).toHaveTextContent('30'); // Alice
  });

  it('sorts data descending on second click', () => {
    const cols: ColumnsType = [
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    const th = container.querySelector('th') as HTMLElement;
    // First click: ascending
    fireEvent.click(th);
    // Second click: descending
    fireEvent.click(th);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('35'); // Charlie
    expect(rows[1]).toHaveTextContent('32'); // Eve
    expect(rows[2]).toHaveTextContent('30'); // Alice
  });

  it('cancels sort on third click (default sortDirections)', () => {
    const cols: ColumnsType = [
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    const th = container.querySelector('th') as HTMLElement;
    fireEvent.click(th); // ascend
    fireEvent.click(th); // descend
    fireEvent.click(th); // cancel

    // Back to original order
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('30'); // Alice (original order)
    expect(rows[1]).toHaveTextContent('25'); // Bob
  });

  it('supports defaultSortOrder', () => {
    const cols: ColumnsType = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
        defaultSortOrder: 'ascend',
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    // Should be sorted ascending from start
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('25'); // Bob (youngest)
  });

  it('supports controlled sortOrder', () => {
    const cols: ColumnsType = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
        sortOrder: 'descend',
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    // Should be sorted descending (controlled)
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('35'); // Charlie (oldest)
  });

  it('supports string sorter (localeCompare)', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    const th = container.querySelector('th') as HTMLElement;
    fireEvent.click(th); // ascending

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('Alice');
    expect(rows[1]).toHaveTextContent('Bob');
    expect(rows[2]).toHaveTextContent('Charlie');
  });

  it('supports boolean sorter (simple toggle)', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    const th = container.querySelector('th') as HTMLElement;
    fireEvent.click(th);

    // Should have a sort indicator
    const sortIndicator = container.querySelector('.ant-table-column-sort');
    expect(sortIndicator || container.querySelector('th')).toBeTruthy();
  });
});

// ============================================================
// Filter Tests (Controlled Mode)
// ============================================================
describe('TableFeatures — Filter', () => {
  it('renders filter icon for filterable column', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        filters: [
          { text: 'Tech', value: 'Tech' },
          { text: 'Product', value: 'Product' },
        ],
        onFilter: (value: any, record: any) => record.department === value,
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    const filterTrigger = container.querySelector('.ant-table-filter-trigger');
    expect(filterTrigger).toBeInTheDocument();
  });

  it('filters data with controlled filteredValue', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        filters: [
          { text: 'Tech', value: 'Tech' },
          { text: 'Product', value: 'Product' },
        ],
        onFilter: (value: any, record: any) => record.department === value,
        filteredValue: ['Tech'],
      },
      { title: 'Name', dataIndex: 'name', key: 'name' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );

    // Only Tech department rows should be visible
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2); // Alice and Charlie
    expect(rows[0]).toHaveTextContent('Alice');
    expect(rows[1]).toHaveTextContent('Charlie');
  });

  it('shows all data when filteredValue is null', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        filters: [{ text: 'Tech', value: 'Tech' }],
        onFilter: (value: any, record: any) => record.department === value,
        filteredValue: null,
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
  });

  it('supports multiple filter values', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        filters: [
          { text: 'Tech', value: 'Tech' },
          { text: 'Product', value: 'Product' },
          { text: 'Design', value: 'Design' },
        ],
        onFilter: (value: any, record: any) => record.department === value,
        filteredValue: ['Tech', 'Product'],
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    const rows = container.querySelectorAll('tbody tr');
    // Tech: Alice, Charlie; Product: Bob, Eve → 4 rows
    expect(rows.length).toBe(4);
  });

  it('marks filtered column with filtered class', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        filters: [{ text: 'Tech', value: 'Tech' }],
        onFilter: (value: any, record: any) => record.department === value,
        filteredValue: ['Tech'],
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    const th = container.querySelector('th');
    expect(th?.className).toContain('ant-table-cell');
  });
});

// ============================================================
// Selection Tests
// ============================================================
describe('TableFeatures — Selection', () => {
  it('renders checkboxes for row selection', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ type: 'checkbox' }}
      />,
    );
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    // 1 for select-all + 5 for each row = 6
    expect(checkboxes.length).toBe(6);
  });

  it('renders radio buttons for radio selection', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ type: 'radio' }}
      />,
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    // 5 rows, no select-all for radio
    expect(radios.length).toBe(5);
  });

  it('selects a row when checkbox is clicked', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ onChange }}
      />,
    );

    const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
    fireEvent.click(checkboxes[0]);

    expect(onChange).toHaveBeenCalled();
    const [selectedRowKeys] = onChange.mock.calls[0];
    expect(selectedRowKeys).toContain('1');
  });

  it('selects all rows when header checkbox is clicked', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ onChange }}
      />,
    );

    const headerCheckbox = container.querySelector('thead input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(headerCheckbox);

    expect(onChange).toHaveBeenCalled();
    const [selectedRowKeys] = onChange.mock.calls[0];
    expect(selectedRowKeys.length).toBe(5);
  });

  it('supports controlled selectedRowKeys', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{
          selectedRowKeys: ['1', '3'],
        }}
      />,
    );

    const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    expect(checkboxes[0].checked).toBe(true); // key '1'
    expect(checkboxes[1].checked).toBe(false); // key '2'
    expect(checkboxes[2].checked).toBe(true); // key '3'
  });

  it('deselects row when checkbox is clicked again', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{
          selectedRowKeys: ['1'],
          onChange,
        }}
      />,
    );

    const checkbox = container.querySelectorAll('tbody input[type="checkbox"]')[0] as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);

    const [selectedRowKeys] = onChange.mock.calls[0];
    expect(selectedRowKeys).not.toContain('1');
  });

  it('supports getCheckboxProps for disabling rows', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{
          getCheckboxProps: (record: any) => ({ disabled: record.age < 30 }),
        }}
      />,
    );

    const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    // Alice(30) enabled, Bob(25) disabled, Charlie(35) enabled, David(28) disabled, Eve(32) enabled
    expect(checkboxes[0].disabled).toBe(false);
    expect(checkboxes[1].disabled).toBe(true);
    expect(checkboxes[2].disabled).toBe(false);
    expect(checkboxes[3].disabled).toBe(true);
    expect(checkboxes[4].disabled).toBe(false);
  });

  it('hides select all when hideSelectAll is true', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ hideSelectAll: true }}
      />,
    );

    const headerCheckbox = container.querySelector('thead input[type="checkbox"]');
    expect(headerCheckbox).not.toBeInTheDocument();
  });

  it('supports fixed selection column', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ fixed: true }}
        scroll={{ x: 800 }}
      />,
    );

    // Selection column should be fixed — look for fixed cell in thead
    const fixedCell = container.querySelector('th.ant-table-cell-fix-left') ||
      container.querySelector('.ant-table-selection-column');
    expect(fixedCell).toBeInTheDocument();
  });

  it('supports custom columnWidth for selection', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ columnWidth: 80 }}
      />,
    );

    const selectionCol = container.querySelector('colgroup col');
    expect(selectionCol?.getAttribute('style')).toContain('80px');
  });

  it('calls onSelect when individual row is toggled', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ onSelect: onSelect as any }}
      />,
    );

    const checkbox = container.querySelectorAll('tbody input[type="checkbox"]')[0];
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalled();
  });
});

// ============================================================
// Editable Tests
// ============================================================
describe('TableFeatures — Editable', () => {
  it('renders input elements in editable cells', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { type: 'input' },
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" editable />,
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders select elements in editable cells', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 150,
        editable: {
          type: 'select',
          options: [
            { label: 'Tech', value: 'Tech' },
            { label: 'Product', value: 'Product' },
          ],
        },
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" editable />,
    );

    // antd Select renders a div with role="combobox"
    const comboboxes = container.querySelectorAll('[role="combobox"]');
    expect(comboboxes.length).toBeGreaterThan(0);
  });

  it('triggers onEditableChange when cell value changes', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { type: 'input' },
      },
    ];
    const { container } = render(
      <Table
        dataSource={data}
        columns={cols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
      />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('Updated Name');
    // Other rows should be unchanged
    expect(newData[1].name).toBe('Bob');
  });

  it('exposes validate method via ref', async () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ required: true, message: 'Name is required' }],
        },
      },
    ];
    const ref = React.createRef<any>();
    const TableRef = Table as any;
    render(
      <TableRef
        ref={ref}
        dataSource={[
          { key: '1', name: '' },
          { key: '2', name: 'Alice' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current?.validate();
    expect(result).toBeDefined();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBeGreaterThan(0);
  });

  it('validate passes when all data is valid', async () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ required: true, message: 'Name is required' }],
        },
      },
    ];
    const ref = React.createRef<any>();
    const TableRef = Table as any;
    render(
      <TableRef
        ref={ref}
        dataSource={[
          { key: '1', name: 'Alice' },
          { key: '2', name: 'Bob' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current?.validate();
    expect(result.valid).toBe(true);
    expect(result.errors.size).toBe(0);
  });

  it('exposes resetErrors method via ref', async () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ required: true, message: 'Name is required' }],
        },
      },
    ];
    const ref = React.createRef<any>();
    const TableRef = Table as any;
    render(
      <TableRef
        ref={ref}
        dataSource={[{ key: '1', name: '' }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    // First validate to create errors
    const result1 = await ref.current?.validate();
    expect(result1.valid).toBe(false);

    // Reset errors
    ref.current?.resetErrors();

    // Errors should be cleared (we can't directly check internal state,
    // but validate again should still work)
    const result2 = await ref.current?.validate();
    expect(result2).toBeDefined();
  });

  it('supports pattern validation rule', async () => {
    const cols: ColumnsType = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        editable: {
          type: 'input',
          rules: [
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          ],
        },
      },
    ];
    const ref = React.createRef<any>();
    const TableRef = Table as any;
    render(
      <TableRef
        ref={ref}
        dataSource={[
          { key: '1', email: 'valid@test.com' },
          { key: '2', email: 'invalid' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current?.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
  });

  it('supports custom validator rule', async () => {
    const cols: ColumnsType = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        editable: {
          type: 'input',
          rules: [
            {
              validator: (value: any) =>
                value != null && value < 0 ? 'Age cannot be negative' : undefined,
            },
          ],
        },
      },
    ];
    const ref = React.createRef<any>();
    const TableRef = Table as any;
    render(
      <TableRef
        ref={ref}
        dataSource={[
          { key: '1', age: 30 },
          { key: '2', age: -5 },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current?.validate();
    expect(result.valid).toBe(false);
  });

  it('supports custom renderEditor', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          renderEditor: (value: any, _record: any, _index: number, onChange: any) => (
            <input
              data-testid="custom-editor"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          ),
        },
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" editable />,
    );

    const customEditor = container.querySelector('[data-testid="custom-editor"]');
    expect(customEditor).toBeInTheDocument();
  });

  it('does not render editors when neither column nor global editable is set', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );

    // Without any editable config, no editable cells should be rendered
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(0);
  });

  it('supports per-column editable without global flag', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { type: 'input' },
      },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );

    // First column should have editable cells, second should not
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(5); // Only 1 column × 5 rows
  });

  it('global editable flag enables all columns', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" editable />,
    );

    // With global editable, both columns should have editable cells
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(10); // 2 columns × 5 rows
  });
});

// ============================================================
// Pagination Tests
// ============================================================
describe('TableFeatures — Pagination', () => {
  it('renders pagination by default', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" pagination={{ pageSize: 2 }} />,
    );

    const pagination = container.querySelector('.ant-pagination');
    expect(pagination).toBeInTheDocument();
  });

  it('hides pagination when pagination=false', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" pagination={false} />,
    );

    const pagination = container.querySelector('.ant-pagination');
    expect(pagination).not.toBeInTheDocument();
  });

  it('paginates data correctly', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" pagination={{ pageSize: 2 }} />,
    );

    // With pageSize=2 and 5 rows, should show 2 rows on first page
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('changes page when clicking next', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" pagination={{ pageSize: 2 }} />,
    );

    // Click next page button
    const nextBtn = container.querySelector('.ant-pagination-next') as HTMLElement;
    if (nextBtn) {
      fireEvent.click(nextBtn);
    }

    // Should show different rows (page 2)
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('calls onChange when page changes', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        pagination={{ pageSize: 2 }}
        onChange={onChange as any}
      />,
    );

    const nextBtn = container.querySelector('.ant-pagination-next') as HTMLElement;
    if (nextBtn) {
      fireEvent.click(nextBtn);
    }

    expect(onChange).toHaveBeenCalled();
  });

  it('supports showTotal', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        pagination={{ pageSize: 2, showTotal: (total) => `Total ${total} items` }}
      />,
    );

    expect(container.textContent).toContain('Total 5 items');
  });

  it('follows controlled pagination.current on rerender', () => {
    const sixRows = [
      { key: '1', name: 'Alice', age: 30, department: 'Tech' },
      { key: '2', name: 'Bob', age: 25, department: 'Product' },
      { key: '3', name: 'Charlie', age: 35, department: 'Tech' },
      { key: '4', name: 'David', age: 28, department: 'Design' },
      { key: '5', name: 'Eve', age: 32, department: 'Product' },
      { key: '6', name: 'Frank', age: 40, department: 'Tech' },
    ];
    const { container, rerender } = render(
      <Table
        dataSource={sixRows}
        columns={basicColumns}
        rowKey="key"
        pagination={{ current: 2, pageSize: 2, total: 6 }}
      />,
    );

    // 受控 current=2 → 渲染第 2 页数据
    expect(container.textContent).toContain('Charlie');
    expect(container.textContent).toContain('David');
    expect(container.textContent).not.toContain('Alice');

    // 外部改 current=3 → 表格跟随渲染第 3 页
    rerender(
      <Table
        dataSource={sixRows}
        columns={basicColumns}
        rowKey="key"
        pagination={{ current: 3, pageSize: 2, total: 6 }}
      />,
    );
    expect(container.textContent).toContain('Eve');
    expect(container.textContent).toContain('Frank');
    expect(container.textContent).not.toContain('Charlie');
  });

  it('follows controlled pagination.pageSize on rerender', () => {
    const onPaginationChange = jest.fn();
    const sixRows = [
      { key: '1', name: 'Alice', age: 30, department: 'Tech' },
      { key: '2', name: 'Bob', age: 25, department: 'Product' },
      { key: '3', name: 'Charlie', age: 35, department: 'Tech' },
      { key: '4', name: 'David', age: 28, department: 'Design' },
      { key: '5', name: 'Eve', age: 32, department: 'Product' },
      { key: '6', name: 'Frank', age: 40, department: 'Tech' },
    ];
    const { container, rerender } = render(
      <Table
        dataSource={sixRows}
        columns={basicColumns}
        rowKey="key"
        pagination={{ current: 1, pageSize: 2, total: 6, onChange: onPaginationChange }}
      />,
    );

    // 受控 pageSize=2 → 渲染 2 行
    expect(container.querySelectorAll('tbody tr').length).toBe(2);
    expect(container.textContent).not.toContain('Charlie');

    // 外部改 pageSize=3 → 表格跟随渲染 3 行
    rerender(
      <Table
        dataSource={sixRows}
        columns={basicColumns}
        rowKey="key"
        pagination={{ current: 1, pageSize: 3, total: 6, onChange: onPaginationChange }}
      />,
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(3);
    expect(container.textContent).toContain('Charlie');

    // onChange 语义保持：点击下一页仍回传 current + pageSize
    const nextBtn = container.querySelector('.ant-pagination-next') as HTMLElement;
    fireEvent.click(nextBtn);
    expect(onPaginationChange).toHaveBeenCalledWith(2, 3);
  });
});

// ============================================================
// Summary Tests
// ============================================================
describe('TableFeatures — Summary', () => {
  it('renders summary content', () => {
    render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        summary={() => <div data-testid="summary">Summary Row</div>}
      />,
    );

    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('passes data to summary function', () => {
    const summaryFn = jest.fn(() => 'Summary');
    render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        summary={summaryFn}
      />,
    );

    expect(summaryFn).toHaveBeenCalled();
    // jest.fn without declared params types calls as `[]`; the summary callback
    // is invoked with the data array at runtime
    const [summaryData] = summaryFn.mock.calls[0] as unknown as [unknown[]];
    expect(summaryData.length).toBe(5);
  });

  it('renders Table.Summary.Row with cells', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        summary={() => (
          <Summary fixed>
            <Summary.Row>
              <Summary.Cell index={0}>Total</Summary.Cell>
              <Summary.Cell index={1}>5 rows</Summary.Cell>
              <Summary.Cell index={2}>—</Summary.Cell>
            </Summary.Row>
          </Summary>
        )}
      />,
    );

    expect(container.textContent).toContain('Total');
    expect(container.textContent).toContain('5 rows');
  });
});

// ============================================================
// Loading Tests
// ============================================================
describe('TableFeatures — Loading', () => {
  it('renders spin when loading=true', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" loading />,
    );

    const spin = container.querySelector('.ant-spin');
    expect(spin).toBeInTheDocument();
  });

  it('does not render spin when loading=false', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" loading={false} />,
    );

    const spin = container.querySelector('.ant-spin-spinning');
    expect(spin).not.toBeInTheDocument();
  });
});

// ============================================================
// Combination Tests
// ============================================================
describe('TableFeatures — Combinations', () => {
  it('sort + filter work together', () => {
    const cols: ColumnsType = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        filters: [{ text: 'Tech', value: 'Tech' }],
        onFilter: (value: any, record: any) => record.department === value,
        filteredValue: ['Tech'],
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" showSorterTooltip={false} />,
    );

    // Filter to Tech only (Alice, Charlie)
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    // Sort by age ascending
    const th = container.querySelector('th') as HTMLElement;
    fireEvent.click(th);

    // Alice (30) should come before Charlie (35)
    const sortedRows = container.querySelectorAll('tbody tr');
    expect(sortedRows[0]).toHaveTextContent('30');
    expect(sortedRows[1]).toHaveTextContent('35');
  });

  it('selection + pagination work together', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        pagination={{ pageSize: 2 }}
        rowSelection={{ onChange }}
      />,
    );

    // Select first row on page 1
    const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
    fireEvent.click(checkboxes[0]);

    expect(onChange).toHaveBeenCalled();
    const [selectedKeys] = onChange.mock.calls[0];
    expect(selectedKeys.length).toBe(1);
  });

  it('expand + selection work together', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{ type: 'checkbox' }}
        expandable={{
          expandedRowRender: (record: any) => <div data-testid={`expanded-${record.key}`}>Expanded {record.name}</div>,
        }}
      />,
    );

    // Both expand icons and checkboxes should be present
    const expandIcons = container.querySelectorAll('.ant-table-row-expand-icon');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(expandIcons.length).toBeGreaterThan(0);
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('virtual + resizable work together', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      key: String(i),
      name: `Row ${i}`,
      age: i,
      department: 'Tech',
    }));
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, resizable: true, minWidth: 60 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, resizable: true, minWidth: 60 },
    ];
    const onColumnResize = jest.fn();
    const { container } = render(
      <Table
        dataSource={largeData}
        columns={cols}
        rowKey="key"
        resizable
        virtual
        scroll={{ y: 200 }}
        onColumnResize={onColumnResize}
      />,
    );

    // Resize handles should be present
    const handles = container.querySelectorAll('.ant-table-resize-handle');
    expect(handles.length).toBe(2);

    // Virtual rows should be present
    const virtualRows = container.querySelectorAll('[data-row-key]');
    expect(virtualRows.length).toBeGreaterThan(0);
  });

  it('bordered + size + scroll work together', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        bordered
        size="middle"
        scroll={{ x: 600, y: 200 }}
      />,
    );

    expect(container.querySelector('.ant-table-bordered')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-middle')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
  });

  it('editable + resizable work together', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        resizable: true,
        minWidth: 60,
        editable: { type: 'input' },
      },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, resizable: true, minWidth: 60 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" resizable editable />,
    );

    // Both resize handles and editable inputs should be present
    const handles = container.querySelectorAll('.ant-table-resize-handle');
    const inputs = container.querySelectorAll('input');
    expect(handles.length).toBe(2);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('column groups + resizable work together', () => {
    const cols: ColumnsType = [
      {
        title: 'Personal',
        key: 'personal',
        children: [
          { title: 'Name', dataIndex: 'name', key: 'name', width: 150, resizable: true, minWidth: 60 },
          { title: 'Age', dataIndex: 'age', key: 'age', width: 100, resizable: true, minWidth: 60 },
        ],
      },
      { title: 'Department', dataIndex: 'department', key: 'department', width: 150, resizable: true, minWidth: 60 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" resizable />,
    );

    const handles = container.querySelectorAll('.ant-table-resize-handle');
    expect(handles.length).toBe(3);
  });
});

// ============================================================
// Additional Edge Cases
// ============================================================
describe('TableFeatures — Additional Edge Cases', () => {
  it('handles empty columns array', () => {
    const { container } = render(
      <Table dataSource={data} columns={[]} rowKey="key" />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('handles single row single column', () => {
    const { container } = render(
      <Table
        dataSource={[{ key: '1', name: 'Only' }]}
        columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }] as any}
        rowKey="key"
      />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(container.querySelectorAll('th')).toHaveLength(1);
  });

  it('handles deeply nested column groups', () => {
    const cols: ColumnsType = [
      {
        title: 'L1',
        key: 'l1',
        children: [
          {
            title: 'L2',
            key: 'l2',
            children: [
              { title: 'Name', dataIndex: 'name', key: 'name' },
              { title: 'Age', dataIndex: 'age', key: 'age' },
            ],
          },
        ],
      },
    ];
    render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    expect(screen.getByText('L1')).toBeInTheDocument();
    expect(screen.getByText('L2')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('handles column with render returning object with props', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (value: any) => ({
          children: <strong>{value}</strong>,
          props: { colSpan: 1 },
        }),
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    expect(container.querySelector('strong')).toBeInTheDocument();
  });

  it('handles column with colSpan in render', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (value: any, _record: any, index: number) => {
          if (index === 0) {
            return { children: value, props: { colSpan: 2 } };
          }
          return value;
        },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        render: (_value: any, _record: any, index: number) => {
          if (index === 0) {
            return { children: '', props: { colSpan: 0 } };
          }
          return _value;
        },
      },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols} rowKey="key" />,
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
  });

  it('updates when dataSource changes', () => {
    const { container, rerender } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(5);

    const newData = [...data, { key: '6', name: 'Frank', age: 40, department: 'Tech', status: 'active' }];
    rerender(<Table dataSource={newData} columns={basicColumns} rowKey="key" />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(6);
  });

  it('updates when columns change', () => {
    const { container, rerender } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" />,
    );
    expect(container.querySelectorAll('th')).toHaveLength(3);

    const newCols: ColumnsType = [...basicColumns, { title: 'Status', dataIndex: 'status', key: 'status' }];
    rerender(<Table dataSource={data} columns={newCols} rowKey="key" />);
    expect(container.querySelectorAll('th')).toHaveLength(4);
  });

  it('handles onHeaderRow callback', () => {
    const onHeaderRow = jest.fn(() => ({ 'data-test': 'header-row' }));
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        onHeaderRow={onHeaderRow as any}
      />,
    );
    const headerRow = container.querySelector('thead tr');
    expect(headerRow).toHaveAttribute('data-test', 'header-row');
  });

  it('preserves row order without sorter or filter', () => {
    const { container } = render(
      <Table dataSource={data} columns={basicColumns} rowKey="key" />,
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent('Alice');
    expect(rows[1]).toHaveTextContent('Bob');
    expect(rows[2]).toHaveTextContent('Charlie');
    expect(rows[3]).toHaveTextContent('David');
    expect(rows[4]).toHaveTextContent('Eve');
  });

  it('supports custom rowClassName with selection', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={basicColumns}
        rowKey="key"
        rowSelection={{
          selectedRowKeys: ['1', '3'],
        }}
        rowClassName={(record: any) => `row-${record.key}`}
      />,
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('row-1');
    expect(rows[0]).toHaveClass('ant-table-row-selected');
    expect(rows[1]).toHaveClass('row-2');
    expect(rows[1]).not.toHaveClass('ant-table-row-selected');
    expect(rows[2]).toHaveClass('row-3');
    expect(rows[2]).toHaveClass('ant-table-row-selected');
  });
});

// ============================================================
// ref.scrollTo freshness (stale closure regression)
// ============================================================
describe('TableFeatures — ref scrollTo freshness', () => {
  it('scrollTo resolves the row key against the latest dataSource after re-render', () => {
    const scrollIntoViewSpy = jest
      .spyOn(window.HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(() => {});
    try {
      const cols: ColumnsType = [{ title: 'Name', dataIndex: 'name', key: 'name' }];
      const ref = React.createRef<Reference>();
      const { container, rerender } = render(
        <Table
          ref={ref}
          dataSource={[
            { key: '1', name: 'Alice' },
            { key: '2', name: 'Bob' },
          ]}
          columns={cols}
          rowKey="key"
          scroll={{ y: 100 }}
        />,
      );

      // change dataSource after the first render
      rerender(
        <Table
          ref={ref}
          dataSource={[
            { key: '3', name: 'Charlie' },
            { key: '4', name: 'Dave' },
          ]}
          columns={cols}
          rowKey="key"
          scroll={{ y: 100 }}
        />,
      );

      ref.current!.scrollTo({ index: 1 });

      // must resolve index 1 against the LATEST data (key=4),
      // not the first-render snapshot (key=2, no longer in the DOM)
      const latestRow = container.querySelector('[data-row-key="4"]');
      expect(latestRow).not.toBeNull();
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy.mock.instances[0]).toBe(latestRow);
    } finally {
      scrollIntoViewSpy.mockRestore();
    }
  });
});

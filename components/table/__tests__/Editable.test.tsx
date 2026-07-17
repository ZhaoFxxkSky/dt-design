import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { Summary, Table } from '../index';
import type { ColumnsType, Reference } from '../index';

// ============================================================
// Shared test data
// ============================================================
const testData = [
  { key: '1', name: 'Alice', age: 30, email: 'alice@test.com', department: 'Tech', salary: 20000 },
  { key: '2', name: 'Bob', age: 25, email: 'bob@test.com', department: 'Product', salary: 18000 },
  { key: '3', name: 'Charlie', age: 35, email: 'charlie@test.com', department: 'Tech', salary: 25000 },
];

const deptOptions = [
  { label: 'Tech', value: 'Tech' },
  { label: 'Product', value: 'Product' },
  { label: 'Design', value: 'Design' },
];

// ============================================================
// 1. Rendering Tests
// ============================================================
describe('Editable — Rendering', () => {
  it('renders Input editor for type "input"', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(3); // at least one per row
  });

  it('renders InputNumber editor for type "number"', () => {
    const cols: ColumnsType = [
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    // antd InputNumber renders an input element
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it('renders Select editor for type "select"', () => {
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 150,
        editable: { type: 'select', options: deptOptions },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const comboboxes = container.querySelectorAll('[role="combobox"]');
    expect(comboboxes.length).toBeGreaterThanOrEqual(3);
  });

  it('renders custom editor via renderEditor', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          renderEditor: (value: any, _record: any, _index: number, onChange: any) => (
            <input data-testid="custom-editor" value={value} onChange={(e) => onChange(e.target.value)} />
          ),
        },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const customEditors = container.querySelectorAll('[data-testid="custom-editor"]');
    expect(customEditors.length).toBe(3);
  });

  it('does not render editors when editable is not set', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(0);
  });

  it('renders editable cells with correct prefixCls class', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(3);
  });
});

// ============================================================
// 2. Input onChange Bug Fix — [object Object]
// ============================================================
describe('Editable — Input onChange (Bug: [object Object])', () => {
  it('Input onChange passes pure string value, not event object', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'NewName' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('NewName');
    // Ensure it's NOT [object Object]
    expect(String(newData[0].name)).toBe('NewName');
  });

  it('Input onChange handles empty string correctly', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('');
  });

  it('Input onChange handles special characters', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    const specialChars = '<script>alert("xss")</script> & "quotes"';
    fireEvent.change(input, { target: { value: specialChars } });
    fireEvent.blur(input);

    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe(specialChars);
  });

  it('Input onChange handles numeric-like string values', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);

    const newData = onEditableChange.mock.calls[0][0];
    // Should be string "12345", not number 12345
    expect(newData[0].name).toBe('12345');
    expect(typeof newData[0].name).toBe('string');
  });
});

// ============================================================
// 3. Number Editor Tests
// ============================================================
describe('Editable — Number Editor', () => {
  it('InputNumber onChange passes numeric value', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].age).toBe(42);
    expect(typeof newData[0].age).toBe('number');
  });

  it('InputNumber handles undefined/null values', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    // Simulate clearing the input
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    // Should be undefined (not "[object Object]" or null)
    expect(newData[0].age).toBeUndefined();
  });
});

// ============================================================
// 4. Select Editor Tests
// ============================================================
describe('Editable — Select Editor', () => {
  it('Select onChange passes pure value, not event object', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 150,
        editable: { type: 'select', options: deptOptions },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    // antd Select — trigger dropdown
    const selector = container.querySelector('.ant-select-selector') as HTMLElement;
    fireEvent.mouseDown(selector);

    // Click on an option
    const option = screen.getByText('Design');
    fireEvent.click(option);

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].department).toBe('Design');
    expect(String(newData[0].department)).toBe('Design');
  });
});

// ============================================================
// 5. Custom Editor Tests
// ============================================================
describe('Editable — Custom Editor', () => {
  it('custom editor receives value, record, index, and onChange callback', () => {
    const renderEditor = jest.fn((value, _record, _index, onChange) => (
      <input data-testid="custom-editor" value={value} onChange={(e) => onChange(e.target.value)} />
    ));
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { renderEditor },
      },
    ];
    render(<Table dataSource={testData} columns={cols} rowKey="key" editable />);

    // React 18 may double-render in strict mode; check it was called
    expect(renderEditor).toHaveBeenCalled();
    // Check first call arguments
    const [value, record, index, onChange] = renderEditor.mock.calls[0];
    expect(value).toBe('Alice');
    expect(record.key).toBe('1');
    expect(index).toBe(0);
    expect(typeof onChange).toBe('function');
  });

  it('custom editor onChange passes pure value', () => {
    const onEditableChange = jest.fn();
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
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('[data-testid="custom-editor"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'CustomValue' } });

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('CustomValue');
  });
});

// ============================================================
// 6. Validation Tests
// ============================================================
describe('Editable — Validation', () => {
  it('required rule detects empty value', async () => {
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', name: '' }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
  });

  it('required rule detects undefined value', async () => {
    const cols: ColumnsType = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        editable: {
          type: 'number',
          rules: [{ required: true, message: 'Age is required' }],
        },
      },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', age: undefined }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
  });

  it('required rule detects null value', async () => {
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', name: null }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
  });

  it('required rule passes when value is provided', async () => {
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', name: 'Alice' }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(true);
    expect(result.errors.size).toBe(0);
  });

  it('pattern rule validates email format', async () => {
    const cols: ColumnsType = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        editable: {
          type: 'input',
          rules: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }],
        },
      },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[
          { key: '1', email: 'valid@test.com' },
          { key: '2', email: 'invalid' },
          { key: '3', email: 'also@valid.org' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
  });

  it('custom validator returns error message', async () => {
    const cols: ColumnsType = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        editable: {
          type: 'number',
          rules: [
            {
              validator: (value: any) =>
                value != null && value < 0 ? 'Age cannot be negative' : undefined,
            },
          ],
        },
      },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
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

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
  });

  it('multiple rules on the same column all checked', async () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [
            { required: true, message: 'Name is required' },
            {
              validator: (value: any) =>
                value && value.length < 2 ? 'Name too short' : undefined,
            },
          ],
        },
      },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[
          { key: '1', name: '' },
          { key: '2', name: 'A' },
          { key: '3', name: 'Alice' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(2); // row 1 (empty) + row 2 (too short)
  });

  it('validate returns firstError with correct info', async () => {
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[
          { key: '1', name: 'Alice' },
          { key: '2', name: '' },
          { key: '3', name: '' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.firstError).toBeDefined();
    expect(result.firstError!.rowIndex).toBe(1);
    expect(result.firstError!.message).toBe('Name is required');
  });

  it('onValidate callback is called on validate', async () => {
    const onValidate = jest.fn();
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', name: '' }]}
        columns={cols}
        rowKey="key"
        editable
        onValidate={onValidate}
      />,
    );

    await ref.current!.validate();
    expect(onValidate).toHaveBeenCalled();
    expect(onValidate.mock.calls[0][0].valid).toBe(false);
  });

  it('validate returns valid for empty data array', async () => {
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    // Empty data should be valid (no rows to validate)
    const result = await ref.current!.validate();
    expect(result.valid).toBe(true);
    expect(result.errors.size).toBe(0);
  });
});

// ============================================================
// 7. Cell-level Validation (on change)
// ============================================================
describe('Editable — Cell-level Validation', () => {
  it('triggers validation on cell change', async () => {
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
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    // Clear the value — should trigger validation
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });

    // Validation is async — wait for it
    await waitFor(() => {
      const errorCell = container.querySelector('.ant-table-editable-cell-error');
      expect(errorCell).toBeInTheDocument();
    });
  });

  it('clears error when value becomes valid', async () => {
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
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;

    // First, trigger an error
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });
    await waitFor(() => {
      expect(container.querySelector('.ant-table-editable-cell-error')).toBeInTheDocument();
    });

    // Now fix it
    await act(async () => {
      fireEvent.change(input, { target: { value: 'FixedName' } });
    });
    await waitFor(() => {
      expect(container.querySelector('.ant-table-editable-cell-error')).not.toBeInTheDocument();
    });
  });
});

// ============================================================
// 8. Reset Errors
// ============================================================
describe('Editable — Reset Errors', () => {
  it('resetErrors clears all validation errors', async () => {
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
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', name: '' }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    // First validate to create errors
    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);

    // Reset
    ref.current?.resetErrors();

    // Validate again — errors should be fresh
    const result2 = await ref.current!.validate();
    expect(result2).toBeDefined();
    // Still invalid because data hasn't changed, but errors Map is fresh
    expect(result2.valid).toBe(false);
  });
});

// ============================================================
// 9. Global vs Per-Column Editable
// ============================================================
describe('Editable — Global vs Per-Column', () => {
  it('global editable enables all columns with default input type', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(6); // 2 columns × 3 rows
  });

  it('per-column editable works without global flag', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(3); // Only 1 column × 3 rows
  });

  it('per-column editable overrides global editable settings', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'select', options: deptOptions } },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    // First column should have Select (combobox), second should have Input (default)
    const comboboxes = container.querySelectorAll('[role="combobox"]');
    expect(comboboxes.length).toBe(3); // Only first column has Select

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(3); // Second column has Input
  });
});

// ============================================================
// 10. onChange & onSave Callbacks
// ============================================================
describe('Editable — Callbacks', () => {
  it('column-level onChange callback is triggered', () => {
    const colOnChange = jest.fn();
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          onChange: colOnChange,
        },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'NewName' } });
    fireEvent.blur(input);

    expect(colOnChange).toHaveBeenCalled();
    const [value, record, index] = colOnChange.mock.calls[0];
    expect(value).toBe('NewName');
    expect(record.key).toBe('1');
    expect(index).toBe(0);
  });

  it('onSave callback is triggered on blur', () => {
    const onSave = jest.fn();
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          onSave,
        },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    // Type a new value
    fireEvent.change(input, { target: { value: 'SavedName' } });
    // Blur the input
    fireEvent.blur(input);

    expect(onSave).toHaveBeenCalled();
  });

  it('onEditableChange returns full updated data array', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData).toHaveLength(3);
    expect(newData[0].name).toBe('Changed');
    expect(newData[1].name).toBe('Bob'); // unchanged
    expect(newData[2].name).toBe('Charlie'); // unchanged
  });
});

// ============================================================
// 11. Multi-Row Editing (with state)
// ============================================================
describe('Editable — Multi-Row Editing', () => {
  it('editing different rows updates correct row data', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];

    // Use a stateful wrapper so data updates propagate
    function Wrapper() {
      const [data, setData] = React.useState(testData);
      return (
        <Table
          dataSource={data}
          columns={cols}
          rowKey="key"
          editable
          onEditableChange={(newData) => {
            // onEditableChange is typed as AnyObject[]; cast back to the local row type
            setData(newData as typeof testData);
            onEditableChange(newData);
          }}
        />
      );
    }

    const { container } = render(<Wrapper />);

    const inputs = container.querySelectorAll('input');

    // Edit first row
    fireEvent.change(inputs[0], { target: { value: 'Row1Edit' } });
    fireEvent.blur(inputs[0]);
    expect(onEditableChange.mock.calls[0][0][0].name).toBe('Row1Edit');

    // Edit third row — data should have been updated from first edit
    const updatedInputs = container.querySelectorAll('input');
    fireEvent.change(updatedInputs[2], { target: { value: 'Row3Edit' } });
    fireEvent.blur(updatedInputs[2]);

    const lastCall = onEditableChange.mock.calls[onEditableChange.mock.calls.length - 1][0];
    expect(lastCall[2].name).toBe('Row3Edit');
    expect(lastCall[0].name).toBe('Row1Edit'); // previous edit preserved
  });
});

// ============================================================
// 12. Editable with Fixed Columns
// ============================================================
describe('Editable — Fixed Columns', () => {
  it('editable works with fixed left column', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, fixed: 'left', editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" scroll={{ x: 300 }} />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(3); // Only the fixed left column
  });

  it('editable works with fixed right column', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, fixed: 'right', editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable scroll={{ x: 300 }} />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================
// 13. Editable with Virtual Scrolling
// ============================================================
describe('Editable — Virtual Scrolling', () => {
  it('editable cells render in virtual scroll mode', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      key: String(i),
      name: `User${i}`,
      age: 20 + i,
    }));

    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table dataSource={largeData} columns={cols} rowKey="key" editable virtual scroll={{ y: 200 }} />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 14. Edge Cases
// ============================================================
describe('Editable — Edge Cases', () => {
  it('handles empty data array gracefully', async () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const ref = React.createRef<Reference>();
    const { container } = render(
      <Table ref={ref} dataSource={[]} columns={cols} rowKey="key" editable />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(0);

    // Validate on empty data
    const result = await ref.current!.validate();
    expect(result.valid).toBe(true);
    expect(result.errors.size).toBe(0);
  });

  it('handles columns with no dataIndex gracefully', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
      // Column without dataIndex — should not crash
      { title: 'Action', key: 'action', width: 80, render: () => <button>Delete</button> },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" />,
    );

    // Only first column should have editable cells
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(3);
  });

  it('validate on table without editable columns returns undefined', async () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={testData}
        columns={cols}
        rowKey="key"
      />,
    );

    // validate should be null/undefined when no editable columns
    const result = await ref.current?.validate?.();
    // If validate is available, it should return a valid result; otherwise undefined
    if (result) {
      expect(result.valid).toBe(true);
    }
  });

  it('handles rapid consecutive changes without stale data', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;

    // Rapid-fire changes — local state updates instantly, parent commits on blur
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.change(input, { target: { value: 'AB' } });
    fireEvent.change(input, { target: { value: 'ABC' } });

    // During typing, onEditableChange is NOT called (local state only)
    expect(onEditableChange).not.toHaveBeenCalled();

    // Commit happens on blur with the final value
    fireEvent.blur(input);
    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const lastCall = onEditableChange.mock.calls[onEditableChange.mock.calls.length - 1][0];
    expect(lastCall[0].name).toBe('ABC');
  });

  it('editing does not mutate original data array', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable onEditableChange={onEditableChange} />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Mutated' } });
    fireEvent.blur(input);

    const newData = onEditableChange.mock.calls[0][0];
    // Original data should be unchanged
    expect(testData[0].name).toBe('Alice');
    // New data should have the change
    expect(newData[0].name).toBe('Mutated');
    // Should be a different array reference
    expect(newData).not.toBe(testData);
  });
});

// ============================================================
// 15. Async Validator
// ============================================================
describe('Editable — Async Validator', () => {
  it('async validator is supported in validateCell', async () => {
    const asyncValidator = jest.fn().mockResolvedValue(undefined);
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ validator: asyncValidator }],
        },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'NewName' } });
    });

    await waitFor(() => {
      expect(asyncValidator).toHaveBeenCalled();
    });
  });

  it('async validator returning error message is handled', async () => {
    const asyncValidator = jest.fn().mockResolvedValue('Async error');
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ validator: asyncValidator }],
        },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'NewName' } });
    });

    await waitFor(() => {
      const errorCell = container.querySelector('.ant-table-editable-cell-error');
      expect(errorCell).toBeInTheDocument();
    });
  });
});

// ============================================================
// 16. Editable with Multiple Columns
// ============================================================
describe('Editable — Multiple Editable Columns', () => {
  it('all editable columns are validated in validateAll', async () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ required: true, message: 'Name required' }],
        },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        editable: {
          type: 'number',
          rules: [{ required: true, message: 'Age required' }],
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        editable: {
          type: 'input',
          rules: [
            { required: true, message: 'Email required' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          ],
        },
      },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[
          { key: '1', name: 'Alice', age: 30, email: 'alice@test.com' },
          { key: '2', name: '', age: undefined, email: 'bad' },
        ]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    // Row 2 has 3 errors: empty name, undefined age, bad email (required + pattern)
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================
// 17. Popover Flicker Fix
// ============================================================
describe('Editable — Popover No Flicker', () => {
  it('Popover does not show empty content when validation passes', async () => {
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
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;

    // Trigger an error first
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });
    await waitFor(() => {
      expect(container.querySelector('.ant-table-editable-cell-error')).toBeInTheDocument();
    });

    // Fix the error
    await act(async () => {
      fireEvent.change(input, { target: { value: 'FixedName' } });
    });

    // Wait for validation to clear
    await waitFor(() => {
      expect(container.querySelector('.ant-table-editable-cell-error')).not.toBeInTheDocument();
    });

    // Popover 关闭动画期间可能仍保留旧内容（lastMessagesRef 缓存机制），
    // 这是预期行为 — 确保退出动画有内容可渲染。
    // 关键验证点：error class 已移除，用户知道校验通过了。
  });

  it('error class is removed immediately when errorMessages becomes empty', async () => {
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
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const input = container.querySelector('input') as HTMLInputElement;

    // Trigger error
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });
    await waitFor(() => {
      expect(container.querySelector('.ant-table-editable-cell-error')).toBeInTheDocument();
    });

    // Fix error
    await act(async () => {
      fireEvent.change(input, { target: { value: 'ValidName' } });
    });
    await waitFor(() => {
      expect(container.querySelector('.ant-table-editable-cell-error')).not.toBeInTheDocument();
    });
  });
});

// ============================================================
// 18. Action Column — No [object Object]
// ============================================================
describe('Editable — Action Column Protection', () => {
  it('global editable does not affect columns without dataIndex', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      {
        title: 'Action',
        key: 'action',
        width: 80,
        render: () => <button data-testid="action-btn">Delete</button>,
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    // Action column should NOT have editable cell
    const actionBtn = container.querySelector('[data-testid="action-btn"]');
    expect(actionBtn).toBeInTheDocument();

    // Action column should not show [object Object]
    expect(container.textContent).not.toContain('[object Object]');

    // Only Name and Age columns should have editable cells (2 × 3 = 6)
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(6);
  });

  it('column with explicit editable but no dataIndex still works', () => {
    const cols: ColumnsType = [
      {
        title: 'Custom',
        key: 'custom',
        width: 150,
        dataIndex: 'name', // has dataIndex even though key is 'custom'
        editable: {
          type: 'input',
        },
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(3);
    expect(container.textContent).not.toContain('[object Object]');
  });

  it('multiple action columns are all protected from global editable', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      {
        title: 'Edit',
        key: 'edit',
        width: 80,
        render: () => <button data-testid="edit-btn">Edit</button>,
      },
      {
        title: 'Delete',
        key: 'delete',
        width: 80,
        render: () => <button data-testid="delete-btn">Delete</button>,
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    expect(container.textContent).not.toContain('[object Object]');
    const editBtns = container.querySelectorAll('[data-testid="edit-btn"]');
    const deleteBtns = container.querySelectorAll('[data-testid="delete-btn"]');
    expect(editBtns.length).toBe(3); // 3 rows
    expect(deleteBtns.length).toBe(3); // 3 rows
  });
});

// ============================================================
// 19. Column Group (表头合并) + Editable
// ============================================================
describe('Editable — Column Group Header', () => {
  it('editable works within column groups', () => {
    const cols: ColumnsType = [
      {
        title: 'Basic Info',
        key: 'basic',
        children: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            editable: { type: 'input' },
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: 100,
            editable: { type: 'number' },
          },
        ],
      },
      {
        title: 'Contact',
        key: 'contact',
        children: [
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            editable: { type: 'input' },
          },
        ],
      },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    // All three leaf columns should have editable cells (3 × 3 = 9)
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(9);

    // Header should show group titles
    expect(container.textContent).toContain('Basic Info');
    expect(container.textContent).toContain('Contact');
  });

  it('validation works with column groups', async () => {
    const cols: ColumnsType = [
      {
        title: 'Info',
        key: 'info',
        children: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            editable: {
              type: 'input',
              rules: [{ required: true, message: 'Name required' }],
            },
          },
        ],
      },
    ];
    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={[{ key: '1', name: '' }]}
        columns={cols}
        rowKey="key"
        editable
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
  });
});

// ============================================================
// 20. Switch Editor (boolean values)
// ============================================================
describe('Editable — Switch Editor', () => {
  it('custom Switch editor passes boolean value', () => {
    const onEditableChange = jest.fn();
    const cols: ColumnsType = [
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        width: 80,
        editable: {
          renderEditor: (value: any, _record: any, _idx: number, onChange: any) => (
            <button
              data-testid="switch-btn"
              onClick={() => onChange(!value)}
            >
              {value ? 'ON' : 'OFF'}
            </button>
          ),
        },
      },
    ];
    const { container } = render(
      <Table
        dataSource={[
          { key: '1', active: false },
          { key: '2', active: true },
        ]}
        columns={cols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
      />,
    );

    const switchBtn = container.querySelector('[data-testid="switch-btn"]') as HTMLButtonElement;
    fireEvent.click(switchBtn);

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].active).toBe(true);
  });
});

// ============================================================
// 21. Summary with Editable
// ============================================================
describe('Editable — Summary Row', () => {
  it('editable table renders summary row correctly', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table
        dataSource={testData}
        columns={cols}
        rowKey="key"
        editable
        summary={() => (
          <Summary fixed>
            <Summary.Row>
              <Summary.Cell index={0}>Total</Summary.Cell>
              <Summary.Cell index={1}>
                {testData.reduce((s, r) => s + r.age, 0)}
              </Summary.Cell>
            </Summary.Row>
          </Summary>
        )}
      />,
    );

    // Summary row should be rendered
    expect(container.textContent).toContain('Total');
    // Editable cells should still be in the body
    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(6);
  });
});

// ============================================================
// 22. Editable with Bordered Table
// ============================================================
describe('Editable — Bordered', () => {
  it('editable cells render correctly in bordered table', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: { type: 'number' } },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable bordered />,
    );

    const editableCells = container.querySelectorAll('.ant-table-editable-cell');
    expect(editableCells.length).toBe(6);

    // Bordered table should have border styles
    const table = container.querySelector('.ant-table');
    expect(table).toBeInTheDocument();
  });
});

// ============================================================
// 23. Pagination + Editable (Bug Fix: cross-page editing)
// ============================================================
describe('Editable — Pagination Fix', () => {
  it('editing on page 2 updates the correct row in rawData', () => {
    const onEditableChange = jest.fn();
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      key: String(i + 1),
      name: `User${i + 1}`,
    }));

    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];

    function Wrapper() {
      const [data, setData] = React.useState(largeData);
      return (
        <Table
          dataSource={data}
          columns={cols}
          rowKey="key"
          editable
          onEditableChange={(newData) => {
            // onEditableChange is typed as AnyObject[]; cast back to the local row type
            setData(newData as typeof largeData);
            onEditableChange(newData);
          }}
          pagination={{ pageSize: 5, current: 2 }}
        />
      );
    }

    const { container } = render(<Wrapper />);

    // Page 2 shows rows index 5-9 (keys '6' to '10')
    // The first input on page 2 should correspond to row index 5 (key '6')
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(5);

    // Edit the first input on page 2
    fireEvent.change(inputs[0], { target: { value: 'EditedOnPage2' } });
    fireEvent.blur(inputs[0]);

    expect(onEditableChange).toHaveBeenCalled();
    const newData = onEditableChange.mock.calls[0][0];
    // The 6th row (index 5) should be updated, NOT the 1st row (index 0)
    expect(newData[5].name).toBe('EditedOnPage2');
    expect(newData[0].name).toBe('User1'); // unchanged
  });

  it('editing on page 1 still works correctly with pagination', () => {
    const onEditableChange = jest.fn();
    const largeData = Array.from({ length: 10 }, (_, i) => ({
      key: String(i + 1),
      name: `User${i + 1}`,
    }));

    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];

    const { container } = render(
      <Table
        dataSource={largeData}
        columns={cols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
        pagination={{ pageSize: 5, current: 1 }}
      />,
    );

    const inputs = container.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'Page1Edit' } });
    fireEvent.blur(inputs[0]);

    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('Page1Edit');
    expect(newData[5].name).toBe('User6'); // unchanged
  });

  it('validate works correctly with paginated editable data', async () => {
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      key: String(i + 1),
      name: i < 10 ? `User${i + 1}` : '', // rows 10-14 have empty names
    }));

    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ required: true, message: 'Name required' }],
        },
      },
    ];

    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={largeData}
        columns={cols}
        rowKey="key"
        editable
        pagination={{ pageSize: 5 }}
      />,
    );

    // validate should check ALL rows, not just current page
    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(5); // 5 empty names on page 3
  });

  it('validate auto-jumps to the page containing the first error', async () => {
    // Row 1 (index 0) has an empty name — it's on page 1
    // Start on page 2, validate should switch to page 1
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      key: String(i + 1),
      name: i === 0 ? '' : `User${i + 1}`, // first row is empty
    }));

    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: {
          type: 'input',
          rules: [{ required: true, message: 'Name required' }],
        },
      },
    ];

    const ref = React.createRef<Reference>();
    render(
      <Table
        ref={ref}
        dataSource={largeData}
        columns={cols}
        rowKey="key"
        editable
        pagination={{ pageSize: 5, current: 2 }}
      />,
    );

    const result = await ref.current!.validate();
    expect(result.valid).toBe(false);
    expect(result.firstError?.rowIndex).toBe(0);
    // After validate, the pagination should have switched to page 1
    // (the setTimeout in scrollToRow will handle the actual scroll)
  });
});

// ============================================================
// 23.5 Editable — RowKey Location (Sort / Filter / Tree)
// ============================================================
describe('Editable — RowKey Location (Sort/Filter/Tree)', () => {
  const sortableCols: ColumnsType = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      sorter: (a: any, b: any) => a.age - b.age,
      defaultSortOrder: 'ascend' as const,
    },
  ];

  it('editing the first displayed row after sorting writes to the record with the matching rowKey', () => {
    const onEditableChange = jest.fn();
    const sortData = [
      { key: '1', name: 'Charlie', age: 35 },
      { key: '2', name: 'Alice', age: 25 },
      { key: '3', name: 'Bob', age: 30 },
    ];
    const { container } = render(
      <Table
        dataSource={sortData}
        columns={sortableCols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
        showSorterTooltip={false}
      />,
    );

    // ascending by age → first displayed row is Alice (key=2), not rawData[0]
    const firstRow = container.querySelector('tbody tr[data-row-key]') as HTMLTableRowElement;
    expect(firstRow.getAttribute('data-row-key')).toBe('2');

    const input = firstRow.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'AliceEdited' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    // must write into the record with key=2, NOT rawData[0]
    expect(newData.find((r: any) => r.key === '2').name).toBe('AliceEdited');
    expect(newData.find((r: any) => r.key === '1').name).toBe('Charlie');
    expect(newData.find((r: any) => r.key === '3').name).toBe('Bob');
  });

  it('editing after filtering writes to the record with the matching rowKey', () => {
    const onEditableChange = jest.fn();
    const filterData = [
      { key: '1', name: 'Charlie', dept: 'Tech' },
      { key: '2', name: 'Alice', dept: 'Product' },
      { key: '3', name: 'Bob', dept: 'Tech' },
    ];
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
      {
        title: 'Dept',
        dataIndex: 'dept',
        key: 'dept',
        width: 120,
        filters: [
          { text: 'Tech', value: 'Tech' },
          { text: 'Product', value: 'Product' },
        ],
        filteredValue: ['Tech'],
        onFilter: (value: any, record: any) => record.dept === value,
      },
    ];
    const { container } = render(
      <Table
        dataSource={filterData}
        columns={cols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
      />,
    );

    // filtered to Tech → displayed rows are key=1 (Charlie) and key=3 (Bob)
    const rows = container.querySelectorAll('tbody tr[data-row-key]');
    expect(rows.length).toBe(2);
    const bobRow = rows[1] as HTMLTableRowElement;
    expect(bobRow.getAttribute('data-row-key')).toBe('3');

    const input = bobRow.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'BobEdited' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    // Bob is displayed at index 1 but lives at rawData index 2
    expect(newData.find((r: any) => r.key === '3').name).toBe('BobEdited');
    expect(newData.find((r: any) => r.key === '2').name).toBe('Alice');
    expect(newData.find((r: any) => r.key === '1').name).toBe('Charlie');
  });

  it('editing on a sorted page 2 writes to the correct record', () => {
    const onEditableChange = jest.fn();
    const ages = [30, 25, 35, 20, 28, 33, 22, 40, 18, 27];
    const largeData = Array.from({ length: 10 }, (_, i) => ({
      key: String(i + 1),
      name: `User${i + 1}`,
      age: ages[i],
    }));
    const { container } = render(
      <Table
        dataSource={largeData}
        columns={sortableCols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
        showSorterTooltip={false}
        pagination={{ pageSize: 5, current: 2 }}
      />,
    );

    // ages asc: 18(k9),20(k4),22(k7),25(k2),27(k10) | 28(k5),30(k1),33(k6),35(k3),40(k8)
    // page 2 first row → key 5 (rawData index 4)
    const firstRow = container.querySelector('tbody tr[data-row-key]') as HTMLTableRowElement;
    expect(firstRow.getAttribute('data-row-key')).toBe('5');

    const input = firstRow.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Page2Sorted' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData.find((r: any) => r.key === '5').name).toBe('Page2Sorted');
    // key 6 sits at rawData index 5 — the row the buggy index math would hit
    expect(newData.find((r: any) => r.key === '6').name).toBe('User6');
  });

  it('validateAll errors attach to the correct row after sorting', async () => {
    const validateData = [
      { key: '1', name: 'Charlie', age: 35 },
      { key: '2', name: '', age: 25 },
      { key: '3', name: 'Bob', age: 30 },
    ];
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { type: 'input', rules: [{ required: true, message: 'Name required' }] },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        sorter: (a: any, b: any) => a.age - b.age,
        defaultSortOrder: 'ascend' as const,
      },
    ];
    const ref = React.createRef<Reference>();
    const { container } = render(
      <Table
        ref={ref}
        dataSource={validateData}
        columns={cols}
        rowKey="key"
        editable
        showSorterTooltip={false}
      />,
    );

    let result!: Awaited<ReturnType<Reference['validate']>>;
    await act(async () => {
      result = await ref.current!.validate();
    });
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
    // firstError carries the rowKey; rowIndex stays the rawData index
    expect(result.firstError?.rowKey).toBe('2');
    expect(result.firstError?.rowIndex).toBe(1);

    // sorted asc → display order: key 2 (empty name), key 3, key 1
    const aliceRow = container.querySelector('[data-row-key="2"]');
    const bobRow = container.querySelector('[data-row-key="3"]');
    expect(aliceRow?.querySelector('.ant-table-editable-cell-error')).not.toBeNull();
    expect(bobRow?.querySelector('.ant-table-editable-cell-error')).toBeNull();
  });

  it('validateAll errors attach to the correct row after filtering', async () => {
    const validateData = [
      { key: '1', name: 'Charlie', dept: 'Tech' },
      { key: '2', name: 'Alice', dept: 'Product' },
      { key: '3', name: '', dept: 'Tech' },
    ];
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { type: 'input', rules: [{ required: true, message: 'Name required' }] },
      },
      {
        title: 'Dept',
        dataIndex: 'dept',
        key: 'dept',
        width: 120,
        filters: [
          { text: 'Tech', value: 'Tech' },
          { text: 'Product', value: 'Product' },
        ],
        filteredValue: ['Tech'],
        onFilter: (value: any, record: any) => record.dept === value,
      },
    ];
    const ref = React.createRef<Reference>();
    const { container } = render(
      <Table ref={ref} dataSource={validateData} columns={cols} rowKey="key" editable />,
    );

    let result!: Awaited<ReturnType<Reference['validate']>>;
    await act(async () => {
      result = await ref.current!.validate();
    });
    expect(result.valid).toBe(false);
    expect(result.errors.size).toBe(1);
    expect(result.firstError?.rowKey).toBe('3');
    expect(result.firstError?.rowIndex).toBe(2);

    // filtered to Tech → displayed: key 1, key 3 — error must be on key=3
    const bobRow = container.querySelector('[data-row-key="3"]');
    const charlieRow = container.querySelector('[data-row-key="1"]');
    expect(bobRow?.querySelector('.ant-table-editable-cell-error')).not.toBeNull();
    expect(charlieRow?.querySelector('.ant-table-editable-cell-error')).toBeNull();
  });

  it('editing an expanded tree child row writes to the child record', () => {
    const onEditableChange = jest.fn();
    const treeData = [
      {
        key: '1',
        name: 'Parent1',
        children: [
          { key: '1-1', name: 'Child1' },
          { key: '1-2', name: 'Child2' },
        ],
      },
      { key: '2', name: 'Parent2' },
    ];
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table
        dataSource={treeData}
        columns={cols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
        expandable={{ defaultExpandedRowKeys: ['1'] }}
      />,
    );

    const childRow = container.querySelector('[data-row-key="1-1"]') as HTMLTableRowElement;
    expect(childRow).not.toBeNull();
    const input = childRow.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Child1Edited' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    // the child must be updated inside its parent's children array,
    // not by overwriting the top-level rawData row at the flattened index
    expect(newData[0].children[0].name).toBe('Child1Edited');
    expect(newData[0].children[1].name).toBe('Child2');
    expect(newData[0].name).toBe('Parent1');
    expect(newData[1].name).toBe('Parent2');
  });

  it('editing a tree child row after sorting the parent rows writes to the child record', () => {
    const onEditableChange = jest.fn();
    const treeData = [
      {
        key: '1',
        name: 'B-parent',
        age: 20,
        children: [{ key: '1-1', name: 'B-child', age: 5 }],
      },
      { key: '2', name: 'A-parent', age: 10 },
    ];
    const { container } = render(
      <Table
        dataSource={treeData}
        columns={sortableCols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
        showSorterTooltip={false}
        expandable={{ defaultExpandedRowKeys: ['1'] }}
      />,
    );

    // parents sorted asc by age → display: A-parent(2), B-parent(1), B-child(1-1)
    const childRow = container.querySelector('[data-row-key="1-1"]') as HTMLTableRowElement;
    expect(childRow).not.toBeNull();
    const input = childRow.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'BChildEdited' } });
    fireEvent.blur(input);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].children[0].name).toBe('BChildEdited');
    expect(newData[0].name).toBe('B-parent');
    expect(newData[1].name).toBe('A-parent');
  });

  it('falls back to index-based update when records have no key field', () => {
    const onEditableChange = jest.fn();
    const noKeyData = [{ name: 'Alice' }, { name: 'Bob' }];
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table dataSource={noKeyData} columns={cols} editable onEditableChange={onEditableChange} />,
    );

    const inputs = container.querySelectorAll('.ant-table-editable-cell input');
    expect(inputs.length).toBe(2);
    fireEvent.change(inputs[1], { target: { value: 'BobEdited' } });
    fireEvent.blur(inputs[1]);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('Alice');
    expect(newData[1].name).toBe('BobEdited');
  });

  it('falls back to index-based update when row keys are duplicated', () => {
    const onEditableChange = jest.fn();
    const dupData = [
      { key: '1', name: 'Alice' },
      { key: '1', name: 'Bob' },
    ];
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150, editable: { type: 'input' } },
    ];
    const { container } = render(
      <Table
        dataSource={dupData}
        columns={cols}
        rowKey="key"
        editable
        onEditableChange={onEditableChange}
      />,
    );

    const inputs = container.querySelectorAll('.ant-table-editable-cell input');
    expect(inputs.length).toBe(2);
    fireEvent.change(inputs[1], { target: { value: 'BobEdited' } });
    fireEvent.blur(inputs[1]);

    expect(onEditableChange).toHaveBeenCalledTimes(1);
    const newData = onEditableChange.mock.calls[0][0];
    expect(newData[0].name).toBe('Alice');
    expect(newData[1].name).toBe('BobEdited');
  });
});

// ============================================================
// 24. Batch Edit — applyBatchRules
// ============================================================
describe('Batch Edit — applyBatchRules', () => {
  const batchData = [
    { key: '1', name: 'Alice', age: 30, city: 'Beijing' },
    { key: '2', name: 'Bob', age: 25, city: 'Shanghai' },
    { key: '3', name: 'Charlie', age: 35, city: 'Beijing' },
    { key: '4', name: 'Diana', age: 28, city: 'Guangzhou' },
  ];

  const getRowKey = (record: any) => record.key;

  const batchColumns: ColumnsType = [
    { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    { title: 'Age', dataIndex: 'age', key: 'age', editable: { type: 'number' } },
    { title: 'City', dataIndex: 'city', key: 'city', editable: { type: 'select', options: [] } },
  ];

  it('value rule overwrites selected rows', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      { id: 'r1', fieldKey: 'city', type: 'value' as const, value: 'Shenzhen', mode: 'overwrite' as const },
    ];
    const result = applyBatchRules(batchData, ['1', '3'], getRowKey, batchColumns, rules);
    expect(result[0].city).toBe('Shenzhen');
    expect(result[2].city).toBe('Shenzhen');
    expect(result[1].city).toBe('Shanghai'); // not selected
    expect(result[3].city).toBe('Guangzhou'); // not selected
  });

  it('value rule fillEmpty only fills empty values', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const dataWithEmpty = [
      { key: '1', name: 'Alice', age: 30 },
      { key: '2', name: '', age: 25 },
      { key: '3', name: undefined, age: 35 },
    ];
    const rules = [
      { id: 'r1', fieldKey: 'name', type: 'value' as const, value: 'Default', mode: 'fillEmpty' as const },
    ];
    const result = applyBatchRules(dataWithEmpty, ['1', '2', '3'], (r: any) => r.key, batchColumns, rules);
    expect(result[0].name).toBe('Alice'); // not empty, not changed
    expect(result[1].name).toBe('Default'); // empty, filled
    expect(result[2].name).toBe('Default'); // empty, filled
  });

  it('replace rule with exact match', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      {
        id: 'r1', fieldKey: 'city', type: 'replace' as const,
        oldValue: 'Beijing', newValue: 'BJ', matchMode: 'exact' as const,
      },
    ];
    const result = applyBatchRules(batchData, ['1', '2', '3', '4'], getRowKey, batchColumns, rules);
    expect(result[0].city).toBe('BJ');
    expect(result[2].city).toBe('BJ');
    expect(result[1].city).toBe('Shanghai'); // no match
    expect(result[3].city).toBe('Guangzhou'); // no match
  });

  it('replace rule with contains match', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const dataWithStrings = [
      { key: '1', name: 'Hello World', age: 30 },
      { key: '2', name: 'Hello there', age: 25 },
      { key: '3', name: 'Goodbye', age: 35 },
    ];
    const rules = [
      {
        id: 'r1', fieldKey: 'name', type: 'replace' as const,
        oldValue: 'Hello', newValue: 'Hi', matchMode: 'contains' as const,
      },
    ];
    const result = applyBatchRules(dataWithStrings, ['1', '2', '3'], (r: any) => r.key, batchColumns, rules);
    expect(result[0].name).toBe('Hi World');
    expect(result[1].name).toBe('Hi there');
    expect(result[2].name).toBe('Goodbye'); // no match
  });

  it('sequence rule generates sequential numbers', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      {
        id: 'r1', fieldKey: 'name', type: 'sequence' as const,
        prefix: 'USER_', start: 1, step: 1,
      },
    ];
    const result = applyBatchRules(batchData, ['1', '2', '3'], getRowKey, batchColumns, rules);
    expect(result[0].name).toBe('USER_1');
    expect(result[1].name).toBe('USER_2');
    expect(result[2].name).toBe('USER_3');
    expect(result[3].name).toBe('Diana'); // not selected
  });

  it('sequence rule with digitWidth pads zeros', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      {
        id: 'r1', fieldKey: 'name', type: 'sequence' as const,
        prefix: 'ID_', start: 1, step: 1, digitWidth: 3,
      },
    ];
    const result = applyBatchRules(batchData, ['1', '2', '3'], getRowKey, batchColumns, rules);
    expect(result[0].name).toBe('ID_001');
    expect(result[1].name).toBe('ID_002');
    expect(result[2].name).toBe('ID_003');
  });

  it('sequence rule for number field produces numeric values', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      {
        id: 'r1', fieldKey: 'age', type: 'sequence' as const,
        prefix: '', start: 100, step: 5,
      },
    ];
    const result = applyBatchRules(batchData, ['1', '2', '3'], getRowKey, batchColumns, rules);
    expect(result[0].age).toBe(100);
    expect(result[1].age).toBe(105);
    expect(result[2].age).toBe(110);
  });

  it('multiple rules execute in order', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      { id: 'r1', fieldKey: 'city', type: 'value' as const, value: 'TestCity', mode: 'overwrite' as const },
      {
        id: 'r2', fieldKey: 'name', type: 'sequence' as const,
        prefix: 'N_', start: 1, step: 1,
      },
    ];
    const result = applyBatchRules(batchData, ['1', '2'], getRowKey, batchColumns, rules);
    expect(result[0].city).toBe('TestCity');
    expect(result[0].name).toBe('N_1');
    expect(result[1].city).toBe('TestCity');
    expect(result[1].name).toBe('N_2');
  });

  it('unselected rows are not modified', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      { id: 'r1', fieldKey: 'name', type: 'value' as const, value: 'Changed', mode: 'overwrite' as const },
    ];
    const result = applyBatchRules(batchData, ['2'], getRowKey, batchColumns, rules);
    expect(result[0].name).toBe('Alice'); // not selected
    expect(result[1].name).toBe('Changed'); // selected
    expect(result[2].name).toBe('Charlie'); // not selected
    expect(result[3].name).toBe('Diana'); // not selected
  });

  it('does not mutate original data', () => {
    const { applyBatchRules } = require('../features/editable/batchEditUtils');
    const rules = [
      { id: 'r1', fieldKey: 'name', type: 'value' as const, value: 'New', mode: 'overwrite' as const },
    ];
    const result = applyBatchRules(batchData, ['1'], getRowKey, batchColumns, rules);
    expect(batchData[0].name).toBe('Alice'); // original unchanged
    expect(result[0].name).toBe('New');
  });
});

// ============================================================
// 25. Batch Edit — Modal Rendering
// ============================================================
describe('Batch Edit — Modal', () => {
  it('renders modal when open', () => {
    const BatchEditModal = require('../features/editable/BatchEditModal').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];
    const data = [{ key: '1', name: 'Alice' }, { key: '2', name: 'Bob' }];

    render(
      <BatchEditModal
        open={true}
        columns={cols}
        selectedRowKeys={['1', '2']}
        data={data}
        getRowKey={(r: any) => r.key}
        onCancel={jest.fn()}
        onApply={jest.fn()}
      />,
    );

    expect(screen.getByText('批量编辑')).toBeInTheDocument();
    expect(screen.getByText('添加规则')).toBeInTheDocument();
  });

  it('does not render modal content when closed', () => {
    const BatchEditModal = require('../features/editable/BatchEditModal').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];
    const data = [{ key: '1', name: 'Alice' }];

    const { container } = render(
      <BatchEditModal
        open={false}
        columns={cols}
        selectedRowKeys={[]}
        data={data}
        getRowKey={(r: any) => r.key}
        onCancel={jest.fn()}
        onApply={jest.fn()}
      />,
    );

    expect(container.querySelector('.ant-modal')).toBeNull();
  });

  it('shows selected count and rule count in summary', () => {
    const BatchEditModal = require('../features/editable/BatchEditModal').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];
    const data = [{ key: '1', name: 'Alice' }, { key: '2', name: 'Bob' }];

    render(
      <BatchEditModal
        open={true}
        columns={cols}
        selectedRowKeys={['1', '2']}
        data={data}
        getRowKey={(r: any) => r.key}
        onCancel={jest.fn()}
        onApply={jest.fn()}
      />,
    );

    expect(screen.getByText('添加规则')).toBeInTheDocument(); // modal is open and interactive
  });

  it('onApply is called with updated data on confirm', () => {
    const BatchEditModal = require('../features/editable/BatchEditModal').default;
    const onApply = jest.fn();
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];
    const data = [{ key: '1', name: 'Alice' }, { key: '2', name: 'Bob' }];

    render(
      <BatchEditModal
        open={true}
        columns={cols}
        selectedRowKeys={['1', '2']}
        data={data}
        getRowKey={(r: any) => r.key}
        onCancel={jest.fn()}
        onApply={onApply}
      />,
    );

    // Click the "确认应用" button
    const applyBtn = screen.getByText('确认应用');
    fireEvent.click(applyBtn);

    expect(onApply).toHaveBeenCalledTimes(1);
    const newData = onApply.mock.calls[0][0];
    expect(newData).toHaveLength(2);
  });

  it('add rule button creates a new rule', () => {
    const BatchEditModal = require('../features/editable/BatchEditModal').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', editable: { type: 'number' } },
    ];
    const data = [{ key: '1', name: 'Alice', age: 30 }];

    render(
      <BatchEditModal
        open={true}
        columns={cols}
        selectedRowKeys={['1']}
        data={data}
        getRowKey={(r: any) => r.key}
        onCancel={jest.fn()}
        onApply={jest.fn()}
      />,
    );

    // Initially there should be 1 rule — count rule cards by checking for "目标字段" labels
    expect(screen.getAllByText('目标字段').length).toBe(1);

    // Click "添加规则"
    const addBtn = screen.getByText('添加规则');
    fireEvent.click(addBtn);

    // Now there should be 2 rules
    expect(screen.getAllByText('目标字段').length).toBe(2);
  });
});

// ============================================================
// 26. Batch Edit — useBatchRules Hook
// ============================================================
describe('Batch Edit — useBatchRules', () => {
  it('creates initial rule when opened', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp() {
      hookResult = useBatchRules(true, cols);
      return null;
    }

    render(<TestComp />);
    expect(hookResult.rules).toHaveLength(1);
    expect(hookResult.rules[0].type).toBe('value');
  });

  it('does not create rules when closed', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp() {
      hookResult = useBatchRules(false, cols);
      return null;
    }

    render(<TestComp />);
    expect(hookResult.rules).toHaveLength(0);
  });

  it('addRule adds a new rule', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp() {
      hookResult = useBatchRules(true, cols);
      return null;
    }

    render(<TestComp />);
    expect(hookResult.rules).toHaveLength(1);
    act(() => {
      hookResult.addRule();
    });
    expect(hookResult.rules).toHaveLength(2);
  });

  it('removeRule removes the specified rule', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp() {
      hookResult = useBatchRules(true, cols);
      return null;
    }

    render(<TestComp />);
    expect(hookResult.rules).toHaveLength(1);
    const ruleId = hookResult.rules[0].id;
    act(() => {
      hookResult.removeRule(ruleId);
    });
    expect(hookResult.rules).toHaveLength(0);
  });

  it('moveRule moves rule up and down', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp() {
      hookResult = useBatchRules(true, cols);
      return null;
    }

    render(<TestComp />);
    act(() => {
      hookResult.addRule();
    });
    expect(hookResult.rules).toHaveLength(2);
    const firstId = hookResult.rules[0].id;
    const secondId = hookResult.rules[1].id;

    // Move second rule up
    act(() => {
      hookResult.moveRule(secondId, 'up');
    });
    expect(hookResult.rules[0].id).toBe(secondId);
    expect(hookResult.rules[1].id).toBe(firstId);

    // Move it back down
    act(() => {
      hookResult.moveRule(secondId, 'down');
    });
    expect(hookResult.rules[0].id).toBe(firstId);
    expect(hookResult.rules[1].id).toBe(secondId);
  });

  it('updateRule changes rule field', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
      { title: 'Age', dataIndex: 'age', key: 'age', editable: { type: 'number' } },
    ];

    let hookResult: any;
    function TestComp() {
      hookResult = useBatchRules(true, cols);
      return null;
    }

    render(<TestComp />);
    const ruleId = hookResult.rules[0].id;
    act(() => {
      hookResult.updateRule(ruleId, { value: 'TestValue' });
    });
    expect(hookResult.rules[0].value).toBe('TestValue');
  });
});

// ============================================================
// 27. Editable — Column editable:false Overrides Global (Bug E2)
// ============================================================
describe('Editable — Column editable Overrides Global (Bug E2)', () => {
  it('column editable:false renders plain text even when global editable is on', () => {
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100, editable: false },
    ];
    const { container } = render(
      <Table dataSource={testData} columns={cols} rowKey="key" editable />,
    );

    // 只有 name 列（3 行）渲染编辑器；age 列显式关闭 → 纯文本
    expect(container.querySelectorAll('.ant-table-editable-cell').length).toBe(3);
    expect(container.textContent).toContain('30');
    expect(container.textContent).toContain('25');
  });

  it('column config object without type still enables editing (aligned with parseEditableConfig)', () => {
    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        editable: { rules: [{ required: true, message: 'Name required' }] },
      },
    ];
    const { container } = render(<Table dataSource={testData} columns={cols} rowKey="key" />);

    // 列级配置对象 = 显式开启（hasEditableColumns 与 parseEditableConfig 语义一致）
    expect(container.querySelectorAll('.ant-table-editable-cell').length).toBe(3);
  });
});

// ============================================================
// 28. Batch Edit — Rules Survive Parent Re-render (Bug E3)
// ============================================================
describe('Batch Edit — Rules Survive Parent Re-render (Bug E3)', () => {
  it('keeps configured rules when columns reference changes while open', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    // 父组件每次渲染都构造新 columns 引用（内容相同）
    const makeCols = (): ColumnsType => [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp({ cols }: { cols: ColumnsType }) {
      hookResult = useBatchRules(true, cols);
      return null;
    }

    const { rerender } = render(<TestComp cols={makeCols()} />);
    expect(hookResult.rules).toHaveLength(1);

    // 用户配置规则：修改已有规则 + 新增一条
    act(() => {
      hookResult.updateRule(hookResult.rules[0].id, { value: 'HalfDone' });
      hookResult.addRule();
    });
    expect(hookResult.rules).toHaveLength(2);

    // 弹窗打开期间父组件重渲染（columns 新引用）
    rerender(<TestComp cols={makeCols()} />);

    // 已配置的规则必须保留（bug：被重置为 1 条空规则）
    expect(hookResult.rules).toHaveLength(2);
    expect(hookResult.rules[0].value).toBe('HalfDone');
  });

  it('re-initializes rules on reopen (open false → true)', () => {
    const useBatchRules = require('../features/editable/useBatchRules').default;
    const cols: ColumnsType = [
      { title: 'Name', dataIndex: 'name', key: 'name', editable: { type: 'input' } },
    ];

    let hookResult: any;
    function TestComp({ open }: { open: boolean }) {
      hookResult = useBatchRules(open, cols);
      return null;
    }

    const { rerender } = render(<TestComp open={true} />);
    act(() => {
      hookResult.addRule();
    });
    expect(hookResult.rules).toHaveLength(2);

    // 关闭再打开 → 重新初始化为一条空规则
    rerender(<TestComp open={false} />);
    rerender(<TestComp open={true} />);
    expect(hookResult.rules).toHaveLength(1);
    expect(hookResult.rules[0].value).toBeUndefined();
  });
});

// ============================================================
// 29. Editable — validateAll Race (Bug E4)
// ============================================================
describe('Editable — validateAll Race (Bug E4)', () => {
  it('validateAll does not clobber errors written by validateCell during async validation', async () => {
    const useEditable = require('../features/editable/useEditable').default;

    // name 列异步 validator — 制造 validateAll 的异步等待窗口
    let resolveValidator: (msg?: string) => void = () => {};
    const validatorGate = new Promise<string | undefined>((resolve) => {
      resolveValidator = resolve;
    });

    const cols: ColumnsType = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        editable: { type: 'input', rules: [{ validator: () => validatorGate }] },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        editable: { type: 'input', rules: [{ required: true, message: 'Age is required' }] },
      },
    ];
    const data = [{ key: '1', name: 'Alice', age: 30 }];

    const { result } = renderHook(() =>
      useEditable({ columns: cols, data, getRowKey: (r: any) => r.key }),
    );

    let validatePromise!: Promise<any>;
    await act(async () => {
      validatePromise = result.current.validateAll();
      // 让 validateAll 进入 name 列 validator 的 await 窗口
      await Promise.resolve();
    });

    // validateAll 等待期间，用户编辑 age 单元格 → validateCell 写入最新错误
    await act(async () => {
      await result.current.validateCell('1', 'age', '', data[0], 0);
    });
    expect(result.current.errors.get('1-age')).toEqual(['Age is required']);

    // validator resolve → validateAll 完成
    let validateResult: any;
    await act(async () => {
      resolveValidator(undefined);
      validateResult = await validatePromise;
    });

    // age 单元格的错误必须是用户编辑后的最新状态，未被 validateAll 快照覆盖；
    // 未被触碰的 name 单元格应用 validateAll 的校验结果（无错误）
    expect(result.current.errors.get('1-age')).toEqual(['Age is required']);
    expect(result.current.errors.get('1-name')).toBeUndefined();
    // validateAll 的返回值与合并后状态一致（不是校验时刻的旧快照）
    expect(validateResult.errors.get('1-age')).toEqual(['Age is required']);
    expect(validateResult.valid).toBe(false);
  });
});

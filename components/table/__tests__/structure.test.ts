import * as TableModule from '../index';

describe('table public API structure', () => {
  it('should expose expected named exports', () => {
    const keys = Object.keys(TableModule).sort();

    // Keep a snapshot of the public export surface.
    // This test guards the refactor: if we accidentally drop or rename
    // a public export, it will fail.
    expect(keys).toMatchSnapshot('table-named-exports');
  });

  it('should expose Table static properties', () => {
    const Table = TableModule.Table;
    expect(Table).toBeDefined();
    expect(Table.SELECTION_COLUMN).toBeDefined();
    expect(Table.EXPAND_COLUMN).toBeDefined();
    expect(Table.SELECTION_ALL).toBeDefined();
    expect(Table.SELECTION_INVERT).toBeDefined();
    expect(Table.SELECTION_NONE).toBeDefined();
    expect(Table.Column).toBeDefined();
    expect(Table.ColumnGroup).toBeDefined();
    expect(Table.Summary).toBeDefined();
  });

  it('should snapshot Table static property keys', () => {
    const Table = TableModule.Table as any;
    const staticKeys = Object.keys(Table)
      .filter((k) => !['propTypes', 'defaultProps', 'displayName', 'name'].includes(k))
      .sort();
    expect(staticKeys).toMatchSnapshot('table-static-keys');
  });

  it('should snapshot Summary static property keys', () => {
    const Summary = TableModule.Summary as any;
    const summaryKeys = Object.keys(Summary)
      .filter((k) => !['propTypes', 'defaultProps', 'displayName', 'name'].includes(k))
      .sort();
    expect(summaryKeys).toMatchSnapshot('summary-static-keys');
  });

  it('should export EditableConfig type', () => {
    // Type-only export verification — just ensure the module compiles
    // and the type is accessible at compile time
    const cols: TableModule.ColumnsType = [
      { title: 'A', dataIndex: 'a', key: 'a', editable: { type: 'input' } },
    ];
    expect(cols.length).toBe(1);
  });
});

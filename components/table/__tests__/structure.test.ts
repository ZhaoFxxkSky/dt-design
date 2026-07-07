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
});

import { Button, Divider, Input, Radio, Select, Space } from 'antd';
import type { InputRef } from 'antd';
import classNames from 'classnames';
import React from 'react';
import type { TableColumn } from '../../VirtualEditTable/types';
import FieldEditor from '../../FieldEditor';
import type { ReplaceRuleFormProps } from '../types';
import styles from '../style.less';

type OptionLike = { label?: React.ReactNode; value?: any; options?: OptionLike[] };

const flattenOptions = (options?: OptionLike[]): OptionLike[] => {
  if (!Array.isArray(options)) return [];
  const result: OptionLike[] = [];
  options.forEach((opt) => {
    if (opt.options) {
      result.push(...flattenOptions(opt.options));
    } else {
      result.push(opt);
    }
  });
  return result;
};

const buildSelectLabelMap = (field?: TableColumn): Record<string, string> => {
  if (field?.component !== 'select') return {};
  const options = (field.fieldProps as any)?.options ?? [];
  const map: Record<string, string> = {};
  flattenOptions(options).forEach((opt) => {
    if (opt.value !== undefined) {
      map[String(opt.value)] = String(opt.label ?? opt.value);
    }
  });
  return map;
};

const TagNewValueSelect: React.FC<{
  options: { label: string; value: any }[];
  value?: any;
  onChange: (v: any) => void;
}> = ({ options, value, onChange }) => {
  const [custom, setCustom] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<InputRef>(null);

  React.useEffect(() => {
    if (!open) {
      setCustom('');
    }
  }, [open]);

  const handleConfirm = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    const trimmed = custom.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setCustom('');
    setOpen(false);
  };

  const handleSelect = (v: any) => {
    onChange(v);
    setCustom('');
    setOpen(false);
  };

  return (
    <Select
      style={{ width: '100%' }}
      allowClear
      showSearch
      placeholder="选择或输入新标签"
      value={value}
      onChange={handleSelect}
      open={open}
      onDropdownVisibleChange={setOpen}
      options={options}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space
            style={{ padding: '0 8px 4px', display: 'flex' }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              ref={inputRef}
              placeholder="输入新标签"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
              style={{ flex: 1 }}
            />
            <Button type="primary" size="small" onClick={handleConfirm}>
              确认
            </Button>
          </Space>
        </>
      )}
    />
  );
};

const ReplaceRuleForm: React.FC<ReplaceRuleFormProps> = ({
  rule,
  field,
  columns,
  data,
  selectedRows,
  onUpdate,
}) => {
  const fieldOptions = columns.map((c) => ({ label: c.name, value: c.key }));
  const typeOptions = [
    { label: '固定值填充', value: 'value' },
    { label: '查找替换', value: 'replace' },
    ...(field?.component === 'text' || field?.component === 'digit'
      ? [{ label: '序列生成', value: 'sequence' }]
      : []),
  ];

  const isSelectField = field?.component === 'select';
  const selectMode = (field?.fieldProps as any)?.mode;
  const isTags = isSelectField && selectMode === 'tags';
  const isMultiple = isSelectField && selectMode === 'multiple';
  const selectLabelMap = React.useMemo(() => buildSelectLabelMap(field), [field]);
  const allSelectOptions = React.useMemo(
    () => flattenOptions((field?.fieldProps as any)?.options ?? []),
    [field],
  );

  // select 字段保留原始值类型，以便和 options 的 value 匹配，label 才能正常显示
  const distinctRawValues = React.useMemo(() => {
    if (!isSelectField) return [];
    const set = new Set<any>();
    data.forEach((row, i) => {
      if (!selectedRows.has(i)) return;
      const v = row[rule.fieldKey];
      if (Array.isArray(v)) {
        v.forEach((item) => set.add(item === undefined || item === null ? '' : item));
      } else {
        set.add(v === undefined || v === null ? '' : v);
      }
    });
    return Array.from(set).slice(0, 50);
  }, [data, isSelectField, rule.fieldKey, selectedRows]);

  const distinctStringValues = React.useMemo(() => {
    if (isSelectField) return [];
    const set = new Set<string>();
    data.forEach((row, i) => {
      if (!selectedRows.has(i)) return;
      const v = row[rule.fieldKey];
      set.add(v === undefined || v === null ? '' : String(v));
    });
    return Array.from(set).slice(0, 50);
  }, [data, isSelectField, rule.fieldKey, selectedRows]);

  const oldValueSelectOptions = React.useMemo(
    () =>
      distinctRawValues.map((v) => ({
        label: v === '' ? '（空）' : String(selectLabelMap[String(v)] ?? v),
        value: v,
      })),
    [distinctRawValues, selectLabelMap],
  );

  const newValueOptions = React.useMemo(
    () =>
      allSelectOptions.map((opt) => ({
        label: String(opt.label ?? opt.value),
        value: opt.value,
      })),
    [allSelectOptions],
  );

  const oldValueOptions = distinctStringValues.map((o) => ({
    label: o === '' ? '（空）' : selectLabelMap[o] ?? o,
    value: o,
  }));

  const matchHint = isTags
    ? '替换标签'
    : isMultiple
    ? '替换其中选项'
    : isSelectField
    ? '替换整值'
    : undefined;

  return (
    <>
      <div className={styles.batchEditRow}>
        <div className={classNames(styles.batchEditControl, styles.batchEditControlFixed)}>
          <label>目标字段</label>
          <Select
            style={{ width: '100%' }}
            value={rule.fieldKey}
            onChange={(v) => onUpdate(rule.id, { fieldKey: v })}
            options={fieldOptions}
          />
        </div>
        <div className={classNames(styles.batchEditControl, styles.batchEditControlFixed)}>
          <label>规则类型</label>
          <Select
            style={{ width: '100%' }}
            value={rule.type}
            onChange={(v) => onUpdate(rule.id, { type: v })}
            options={typeOptions}
          />
        </div>
        <div className={styles.batchEditControl}>
          <label>匹配方式</label>
          {isSelectField ? (
            <div style={{ color: '#595959', fontSize: 13, lineHeight: '32px' }}>{matchHint}</div>
          ) : (
            <Radio.Group
              value={rule.matchMode}
              onChange={(e) => onUpdate(rule.id, { matchMode: e.target.value })}
            >
              <Radio value="exact">精确匹配</Radio>
              <Radio value="contains">包含匹配</Radio>
            </Radio.Group>
          )}
        </div>
      </div>
      <div className={styles.batchEditRow}>
        <div className={classNames(styles.batchEditControl, styles.batchEditControlFill)}>
          <label>查找内容</label>
          {isSelectField ? (
            <Select
              style={{ width: '100%' }}
              allowClear
              showSearch
              placeholder={isTags ? '选择要替换的标签' : '选择要查找的选项'}
              value={rule.oldValue}
              onChange={(v) => onUpdate(rule.id, { oldValue: v })}
              options={oldValueSelectOptions}
            />
          ) : (
            <Select
              style={{ width: '100%' }}
              allowClear
              placeholder="选择或输入旧值"
              value={rule.oldValue}
              onChange={(v) => onUpdate(rule.id, { oldValue: v })}
              options={oldValueOptions}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
                    <Input
                      size="small"
                      placeholder="输入自定义旧值"
                      value={rule.oldValue}
                      onChange={(e) => onUpdate(rule.id, { oldValue: e.target.value })}
                    />
                  </div>
                </>
              )}
            />
          )}
        </div>
        <div className={classNames(styles.batchEditControl, styles.batchEditControlFill)}>
          <label>替换为</label>
          <div className={styles.batchEditReplaceTarget}>
            {isSelectField ? (
              isTags ? (
                <TagNewValueSelect
                  options={newValueOptions}
                  value={rule.newValue}
                  onChange={(v) => onUpdate(rule.id, { newValue: v })}
                />
              ) : (
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  placeholder="选择替换值"
                  value={rule.newValue}
                  onChange={(v) => onUpdate(rule.id, { newValue: v })}
                  options={newValueOptions}
                />
              )
            ) : (
              <FieldEditor
                field={field}
                value={rule.newValue}
                onChange={(v) => onUpdate(rule.id, { newValue: v })}
              />
            )}
            <Button type="link" size="small" onClick={() => onUpdate(rule.id, { newValue: undefined })}>
              清空字段
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplaceRuleForm;

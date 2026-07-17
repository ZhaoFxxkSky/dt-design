import React from 'react';
import { render } from '@testing-library/react';
import { Form, Input } from 'antd';

import '@testing-library/jest-dom/extend-expect';

import FormList from '..';

describe('FormList', () => {
  it('renders required mark in column header when rules contain required', () => {
    const { container } = render(
      <Form>
        <FormList
          name="data"
          initialValue={[{ name: '' }]}
          columns={[
            {
              key: 'name',
              title: 'Name',
              dataIndex: 'name',
              rules: [{ required: true, message: 'Please Input Name!' }],
              render: () => <Input />,
            },
            {
              key: 'address',
              title: 'Address',
              dataIndex: 'address',
              render: () => <Input />,
            },
          ]}
        />
      </Form>,
    );

    // 必填列表头应渲染与 less 中 .ant-form-list__column--required 对应的类
    const requiredMarks = container.querySelectorAll('.ant-form-list__column--required');
    expect(requiredMarks.length).toBe(1);
  });
});

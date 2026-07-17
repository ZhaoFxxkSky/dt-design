import React, { useEffect, useState } from 'react';
import { FormList } from '@dtjoy/dt-design';
import { Button, Form, Input, message, Space } from 'antd';

import getMockData from './data';

export default () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    getMockData()
      .then((values) => {
        form.setFieldValue('data', values);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {});
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Space direction="vertical" size={8} align="center" style={{ marginBottom: 8 }}>
      <Form form={form} layout="vertical">
        <FormList
          name="data"
          loading={loading}
          scroll={{
            y: 280,
          }}
          columns={[
            {
              key: 'name',
              title: 'Name',
              dataIndex: 'name',
              required: true,
              rules: [
                {
                  required: true,
                  message: 'Please Input Name!',
                },
              ],
              render: () => <Input placeholder="Name" />,
            },
            {
              key: 'gender',
              title: 'gender',
              dataIndex: 'gender',
              render: () => {
                return <Input disabled />;
              },
            },
            {
              key: 'address',
              title: 'Address',
              dataIndex: 'address',
              render: () => <Input placeholder="Address" />,
            },
            {
              key: 'company',
              title: 'Company',
              dataIndex: 'company',
              render: () => <Input placeholder="Company" />,
            },
            {
              key: 'op',
              title: 'Configuration',
              render: ({ name }) => (
                <Button
                  type="link"
                  onClick={() => message.info(JSON.stringify(form.getFieldValue(['data', name])))}
                >
                  Configuration
                </Button>
              ),
            },
          ]}
        />
      </Form>
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Space>
  );
};

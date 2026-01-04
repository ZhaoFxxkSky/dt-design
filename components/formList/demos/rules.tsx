import React, { useEffect, useState } from 'react';
import { FormList } from '@dtjoy/dt-design';
import { Button, Form, Input, message } from 'antd';

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <Form form={form} layout="vertical" style={{ height: 400 }}>
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
            render: (_, namePath, formInstance) => (
              <span>{formInstance?.getFieldValue(['data', ...namePath]) || '-'}</span>
            ),
          },
          {
            key: 'address',
            title: 'Address',
            dataIndex: 'address',
            required: true,
            rules: [
              ({ getFieldValue }, [name]) => ({
                required: getFieldValue(['data', name, 'gender']) === 'male',
                message: 'address is Required for male',
              }),
            ],
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
  );
};

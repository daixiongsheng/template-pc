/*
Date: 2022-05-07
Time: 23:23:45 Saturday
Author: XiongSheng Dai

*/
import { useMemoizedFn, useMount } from 'ahooks'
import { Button, Form, Input, Table } from 'antd'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getStatutes, createStatute, removeStatute } from '../api/statute'

export type StatuteAddProps = {}

const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 32 },
}

const StatuteAdd: React.FC<StatuteAddProps> = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation('statute')
  const [statues, setStatutes] = useState([])
  const update = useMemoizedFn(() => {
    getStatutes().then((res) => {
      setStatutes(res.list)
    })
  })
  useMount(update)
  const columns = useMemo(
    () => [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: t('title'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: t('remove'),
        key: 'operation',
        render: (_, record) => {
          return (
            <Button
              size="small"
              danger
              onClick={async () => {
                await removeStatute(record.id)
                update()
              }}
            >
              {t('remove')}
            </Button>
          )
        },
      },
    ],
    []
  )
  const onFinish = async ({ title }: any) => {
    await createStatute(title)
    update()
    form.resetFields()
  }
  return (
    <Container>
      <Form
        name="statute"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        {...layout}
        form={form}
      >
        <Form.Item
          rules={[{ required: true, message: t('titleError') }]}
          {...layout}
          label={t('title')}
          name="title"
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t('submit')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={statues} />
    </Container>
  )
}

const Container = styled.div``

export default StatuteAdd

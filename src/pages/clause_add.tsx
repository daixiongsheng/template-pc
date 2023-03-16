/*
Date: 2022-05-07
Time: 23:23:45 Saturday
Author: XiongSheng Dai

*/
import { useMemoizedFn, useMount } from 'ahooks'
import { Button, Form, Input, Select, Table } from 'antd'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  getClauses,
  createClause,
  removeClause,
  findClause,
} from '../api/clause'
import { getAllStatutes } from '../api/statute'

export type ClauseAddProps = {}

const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 8 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
}

const ClauseAdd: React.FC<ClauseAddProps> = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation('clause')
  const [statues, setStatues] = useState<
    Awaited<ReturnType<typeof getAllStatutes>>
  >([])
  const [clause, setClause] = useState<Awaited<ReturnType<typeof getClauses>>>(
    []
  )

  clause
  // ^?
  console.log('update', clause)
  const update = useMemoizedFn(() => {
    getClauses().then(setClause)
  })
  useMount(() => {
    update()
    getAllStatutes().then((res) => {
      setStatues(res)
    })
  })
  const columns = useMemo(
    () => [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: t('title'),
        dataIndex: 'statuteId',
        key: 'statuteId',
      },
      {
        title: t('part'),
        dataIndex: 'part',
        key: 'part',
      },
      {
        title: t('chapter'),
        dataIndex: 'chapter',
        key: 'chapter',
      },
      {
        title: t('item'),
        dataIndex: 'item',
        key: 'item',
      },
      {
        title: t('content'),
        dataIndex: 'content',
        key: 'content',
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
                await removeClause(record.id)
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
  const onFinish = async (res) => {
    res.item = +res.item
    await createClause(res)
    update()
    form.setFields([{ name: 'item', value: +res.item + 1 }])
    // form.resetFields()
  }
  return (
    <Container>
      <Form
        name="clause"
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
          name="statuteId"
        >
          <Select defaultActiveFirstOption>
            {statues.map((statue) => {
              return (
                <Select.Option key={statue.id} value={statue.id}>
                  {statue.title}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: t('partError') }]}
          {...layout}
          label={t('part')}
          name="part"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: t('partError') }]}
          {...layout}
          label={t('chapter')}
          name="chapter"
        >
          <Input />
        </Form.Item>
        <Form.Item {...layout} label={t('item')} name="item">
          <Input type="number" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: t('partError') }]}
          {...layout}
          label={t('content')}
          name="content"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item {...layout} label={t('search')} name="search">
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t('submit')}
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              const { search } = form.getFieldsValue()
              if (!search) {
                return
              }
              const res = await findClause(search)
              setClause(res)
            }}
          >
            {t('search')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={clause} />
    </Container>
  )
}

const Container = styled.div``

export default ClauseAdd

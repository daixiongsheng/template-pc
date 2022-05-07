import React from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'
import MyHeader from '../components/MyHeader'
import { useTranslation } from 'react-i18next'
import { login, logout, createUser } from '../api/user'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const Layout = styled.div`
  position: relative;
  margin: 0 auto;
  width: 452px;
  background: #fff;
  padding: 94px 40px 40px 40px;
  height: 354px;
  margin-top: 40px;
`

const Title = styled.button`
  width: 70px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 16px;
  background-color: #788878;
  color: #fff;
  outline: none;
  border: none;
`

export type LoginProps = {}

const layout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 32 },
}

const Login: React.FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation('login')
  const to = useNavigate()
  const [params] = useSearchParams()
  const onFinish = ({ username, password }: any) => {
    login(username, password)
      .then(() => {
        to(params.get('redirectUrl') || '/admin')
      })
      .catch(message.error)
  }
  return (
    <>
      <MyHeader />
      <Title
        onClick={() => {
          logout().then(console.log)
        }}
      >
        logout
      </Title>
      <Layout>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          {...layout}
          form={form}
        >
          <Form.Item
            {...layout}
            label={t('username')}
            name="username"
            rules={[{ required: true, message: t('usernameError') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            {...layout}
            label={t('password')}
            name="password"
            rules={[{ required: true, message: t('passwordError') }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {t('submit')}
            </Button>
            <Button
              onClick={() => {
                const { username, password } = form.getFieldsValue()
                createUser(username, password)
              }}
              type="primary"
            >
              {t('signUp')}
            </Button>
          </Form.Item>{' '}
        </Form>
      </Layout>
    </>
  )
}

export default Login

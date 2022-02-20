import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Form, Input, Button, message } from 'antd'
import MyHeader from '../components/MyHeader'
import { useTranslation } from 'react-i18next'
import { login, logout } from '../api/user'
import { useLocation, useNavigate } from 'react-router'
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

const Title = styled.div``

export type LoginProps = {}

const Login = () => {
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
        hello
      </Title>
      <Layout>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 8 }}
            label={t('username')}
            name="username"
            rules={[{ required: true, message: t('usernameError') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            label={t('password')}
            name="password"
            rules={[{ required: true, message: t('passwordError') }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit">
              {t('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </>
  )
}

export default Login

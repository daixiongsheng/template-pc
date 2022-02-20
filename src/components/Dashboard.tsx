import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import { Layout } from 'antd'
import React, { useContext, useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { globalContext } from '../globalContext'
import Loading from './Loading'
import MenuBoard from './MenuBoard'

const { Content, Footer, Header, Sider } = Layout

export type DashboardProps = {}

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, loadUserInfo } = useContext(globalContext)
  const [collapsed, { toggle }] = useToggle()
  const to = useNavigate()
  useLayoutEffect(() => {
    loadUserInfo()
      .then((user) => {
        if (!user) {
          to('/login')
        }
      })
      .catch((e) => {
        to('/login')
      })
  }, [])
  if (!user) {
    return <Loading />
  }

  return (
    <Layout>
      <Sider
        collapsible
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        width="240"
        theme="light"
        collapsed={collapsed}
        onCollapse={toggle}
      >
        <Logo>Logo</Logo>
        <MenuBoard />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            paddingLeft: 0,
          }}
        ></Header>
        <Content style={{ minHeight: '100vh' }}>
          <Outlet />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}

export default Dashboard

import { Menu, MenuProps } from 'antd'
import React, { useEffect } from 'react'
import {
  matchRoutes,
  RouteObject,
  useLocation,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import styled from 'styled-components'
import { t } from 'i18next'

import { AppstoreOutlined } from '@ant-design/icons'
import * as Icon from '@ant-design/icons'

import { adminRoutes, routes } from '../routes'

const { SubMenu } = Menu

const Layout = styled.div``

function renderSubMenu(menus: RouteObject[], parentPath = ['admin']) {
  return menus.map((route) => {
    const keys = parentPath.concat(route.path)
    const title = t(keys.join('_'), { ns: 'menu' })
    const Ic = Icon[t(keys.join('_'), { ns: 'icon', lng: 'en' })]
    if (Array.isArray(route.children) && route.children.length > 0) {
      return (
        <SubMenu
          key={route.path}
          icon={Ic ? <Ic /> : <AppstoreOutlined />}
          title={title}
        >
          {renderSubMenu(route.children, parentPath.concat([route.path]))}
        </SubMenu>
      )
    }
    return (
      <Menu.Item key={route.path} icon={Ic && <Ic />}>
        {title}
      </Menu.Item>
    )
  })
}

const MenuBoard: React.FC = () => {
  const to = useNavigate()
  const location = useLocation()
  const match = useMatch(location.pathname)
  const matchs = matchRoutes(routes, location)
  const handleClick: MenuProps['onClick'] = ({ keyPath }) => {
    const toPath = [...keyPath, '/admin'].reverse().join('/')
    to(toPath)
  }
  useEffect(() => {
    console.log(match, matchs)
  }, [match])

  return (
    <Layout>
      <Menu
        onClick={handleClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        {renderSubMenu(adminRoutes)}
      </Menu>
    </Layout>
  )
}

export default MenuBoard

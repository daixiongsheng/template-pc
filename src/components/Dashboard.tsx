import { Layout, message } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { globalContext } from '../globalContext';
import MenuBoard from './MenuBoard';

const { Content, Footer, Header } = Layout;

export type DashboardProps = {};
// const Layout = styled.main``;
const Dashboard: React.FC<DashboardProps> = () => {
  const { loadUserInfo } = useContext(globalContext);
  useEffect(() => {
    loadUserInfo()
      .then((user) => {
        if (!user) {
          to('/login');
        }
      })
      .catch((e) => {
        message.warning(e);
        to('/login');
      });
  }, []);
  const to = useNavigate();
  return (
    <Layout>
      <Header></Header>
      <Layout>
        <Sider>
          <MenuBoard />
        </Sider>
        <Layout>
          <Content>
            <Outlet />
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Dashboard;

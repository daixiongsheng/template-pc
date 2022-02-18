import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styled, { createGlobalStyle, CSSProperties } from 'styled-components';
const Style = createGlobalStyle`
	body {
		background: #f2f4f8;
	}
`;
export type HeaderProps = {
  style?: CSSProperties;
};

const Layout = styled.div`
  display: flex;
  height: 76px;
  background: #fff;
  display: flex;
  align-items: center;
  padding-left: 100px;
`;
const Home = styled(Link)`
  position: relative;
  height: 38px;
  font-size: 18px;
  color: #2c2950;
  line-height: 38px;
`;
const ContactUs = styled(Home)`
  margin-left: 20px;
`;
const MyHeader: React.FC<HeaderProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Layout {...props}>
      <Style />
      <Home to="/">{t('home')}</Home>
      <ContactUs to="/about">{t('contactUs')}</ContactUs>
    </Layout>
  );
};

export default MyHeader;

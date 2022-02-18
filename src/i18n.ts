import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      contactUs: 'Aoubt',
      home: 'Home',
    },
    login: {
      submit: 'login',
      password: 'password',
      passwordError: 'Please input your password!',
      username: 'username',
      userNameError: 'Please input your username!',
    },
  },
  zh_CN: {
    translation: {
      home: '首页',
      contactUs: '联系我们',
    },
    login: {
      username: '用户名',
      submit: '登录',
      passwordError: '请输入用户名！',
      password: '密码',
      userNameError: '请输入密码！',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh_CN', //设置当前语言
  keySeparator: false,
  interpolation: {
    escapeValue: true,
  },
});

export default i18n;

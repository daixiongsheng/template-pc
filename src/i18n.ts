import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  en: {
    icon: {
      admin_cache: 'AppstoreOutlined',
    },
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
    menu: {
      admin_dashboard: '看版',
      admin_dashboard_all: '全部',
      admin_member: '会员',
      admin_member_info: '会员信息',
      admin_member_find: '会员路径',
      admin_cache: '缓存',
    },
    login: {
      username: '用户名',
      submit: '登录',
      passwordError: '请输入用户名！',
      password: '密码',
      userNameError: '请输入密码！',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh_CN', //设置当前语言
  keySeparator: false,
  interpolation: {
    escapeValue: true,
  },
})

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  en: {
    icon: {
      admin_cache: 'AppstoreOutlined',
    },
    translation: {
      contactUs: 'About',
      home: 'Home',
    },
    login: {
      submit: 'sign in',
      signUp: 'sign up',
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
      admin_statute: '法案',
      admin_statute_statute_add: '添加',
      admin_clause: '法条',
      admin_clause_clause_add: '添加',
    },
    login: {
      username: '用户名',
      submit: '登录',
      signUp: '注册',
      passwordError: '请输入用户名！',
      password: '密码',
      userNameError: '请输入密码！',
    },
    statute: {
      submit: '添加',
      title: '法案',
      remove: '删除',
      titleError: '法案不能为空',
    },
    clause: {
      submit: '添加',
      title: '法案',
      part: '编/章',
      chapter: '章/节',
      item: '条/目',
      content: '内容',
      statuteId: '法案ID',
      remove: '删除',
      statuteIdError: '法案ID不能为空',
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

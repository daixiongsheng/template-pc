import React from 'react'
import ReactDOM from 'react-dom'
import { setupHttpClient } from '@midwayjs/rpc'
import 'antd/dist/antd.css'
import './i18n'
import App from './app'
import { handleRequest, handleResponse } from './middleware/handleRequest'
import { BrowserRouter } from 'react-router-dom'

setupHttpClient({
  middleware: [handleRequest, handleResponse],
  withCredentials: true,
})

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)

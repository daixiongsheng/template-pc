import React from 'react';
import ReactDOM from 'react-dom';
import { setupHttpClient } from '@midwayjs/rpc';
import 'antd/dist/antd.css';
import './i18n';
import App from './app';
import { handleRequest, handleResponse } from './middleware/handleRequest';

setupHttpClient({
  middleware: [handleRequest, handleResponse],
  withCredentials: true,
});

ReactDOM.render(<App />, document.getElementById('root'));

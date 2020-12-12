import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { HashRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <HashRouter>
    <App />
    <ToastContainer />
  </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

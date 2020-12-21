import React from 'react';
import Login from './pages/login/Login';
import Main from './Main';
import { Route, Switch, Redirect } from 'react-router-dom';
import './mock/UserApi';
import './mock/CaseApi';
import './mock/BugApi';
import './App.css';

function App() {
  const isLogin = sessionStorage.getItem("user") ? true : false;
  return (
    <Switch>
      <Route path="/login" component={Login} />
      {
        isLogin?
          <Route path="/" component={Main} />
        :
          <Redirect to="/login" />
      }
    </Switch>
  );
}

export default App;

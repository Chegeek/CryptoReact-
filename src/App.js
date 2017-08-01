import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MainPage from './components/mainPage/MainPage';
import CoinDescription from './components/coinDescription/CoinDetails';
import NotFound from './components/notFound/NotFound';
import Header from './components/header/Header';

import './App.css';

const repo = `/${window.location.pathname.split('/')[1]}`;

class App extends Component {
  render() {
    return (
      <Router basename={repo}>
        <div>
          <section className="hero is-medium is-dark is-bold is-fullheight">
            <Route component={Header} />
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route path="/coin/:coin_id" component={CoinDescription} />
              <Route component={NotFound} />
            </Switch>
          </section>
        </div>
      </Router>
    );
  }
}

export default App;

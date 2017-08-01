import React, {Component} from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'

import MainPage from './components/mainPage/MainPage'
import CoinDescription from './components/coinDescription/CoinDetails'
import NotFound from './components/notFound/NotFound'

import './App.css';


class App extends Component {



    render() {
        return(
            <Router>
                <div>
                    <Route exact path="/" component={MainPage}/>
                    <Route path="/coin/:coin_id" component={CoinDescription}/>
                    {/*<Route path="*" component={NotFound}/>*/}
                </div>
            </Router>
        )
    }
}

export default App;

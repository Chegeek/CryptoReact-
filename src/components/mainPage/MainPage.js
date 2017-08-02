import React, { Component } from 'react';
import axios from 'axios';

import CoinTiles from './coinTiles/CoinTiles';
import Loader from '../loader/Loader';

import { fixSymbol } from '../../helpers/helpers';

import '../../styles/animations.css';
import 'bulma/css/bulma.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      coinsTick: [],
      coinsImgs: [],
      loading: true,
      intervalId: null,
    };
  }

  renderTiles = () => {
    if (!this.state.loading && !this.state.failed)
      return (
        <CoinTiles
          coins={this.state.coinsTick}
          coinsImg={this.state.coinsImgs}
        />
      );
    return null;
  };

  renderFail = () => {
    if (this.state.failed)
      return (
        <div className="hero-body is-paddingless">
          <div className="container">
            <h2 className="title has-text-1 has-text-centered has-text-warning">
              Oh no! Seems like that internet or Coinmarketcap is not working{' '}
              <span role="img" aria-label="Sad">
                😒
              </span>
            </h2>
          </div>
        </div>
      );
    return null;
  };

  getSetCoins = async loadAll => {
    let responseCCcoins, baseImageUrl, coinsImgs, coinsTick;

    //get the top 120 coins
    let responseCMC = await axios
      .get('https://api.coinmarketcap.com/v1/ticker/?limit=120')
      .catch(function(error) {
        console.log(error);
      });

    if (!responseCMC) return this.setState({ failed: true, loading: false });

    if (loadAll) {
      //get the images and IDs for CryptoCompare
      responseCCcoins = await axios
        .get('https://www.cryptocompare.com/api/data/coinlist/')
        .catch(error => {
          console.log(error);
          return this.setState({ failed: true, loading: false });
        });
      baseImageUrl = responseCCcoins.data.BaseImageUrl;
      responseCCcoins = responseCCcoins.data.Data;
      coinsImgs = {};
    }

    coinsTick = responseCMC.data;

    if (loadAll)
      coinsTick.forEach(tick => {
        if (responseCCcoins[tick.symbol])
          coinsImgs[tick.symbol] =
            baseImageUrl + responseCCcoins[tick.symbol].ImageUrl;
        else if (responseCCcoins[fixSymbol[tick.symbol]])
          coinsImgs[tick.symbol] =
            baseImageUrl + responseCCcoins[fixSymbol[tick.symbol]].ImageUrl ||
            '';
        else coinsImgs[tick.symbol] = '';
      });

    if (loadAll)
      this.setState({ coinsTick, coinsImgs, loading: false, failed: false });
    else this.setState({ coinsTick });
  };

  componentDidMount() {
    this.getSetCoins(true);
    let intervalId = setInterval(this.getSetCoins, 2500);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  render() {
    return (
      <div className="hero-body ">
        <div className="container">
          <Loader loading={this.state.loading} />
          {this.renderTiles()}
          {this.renderFail()}
        </div>
      </div>
    );
  }
}

export default App;

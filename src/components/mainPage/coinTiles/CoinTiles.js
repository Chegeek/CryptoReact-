import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

import '../../../styles/bulma-helpers.css';
import './CoinTiles.css';

class CoinTiles extends Component {
  render() {
    return (
      <div className="columns is-multiline">
        {this.props.coins.map(coin => {
          const coinImg = this.props.coinsImg[coin.symbol];
          return <Tile key={coin.symbol} coin={coin} coinImg={coinImg} />;
        })}
      </div>
    );
  }
}

class Tile extends Component {
  handleClick = () => {
    this.context.router.history.push(`/coin/${this.props.coin.symbol}`);
  };

  render() {
    const coin = this.props.coin;
    const coinImage = this.props.coinImg;
    const upOrDown = coin.percent_change_1h.includes('-') ? 'has-text-danger' : 'has-text-success';

    return (
      <div className="column is-one-quarter has-text-centered notification is-dark background-color-initial">
        <div
          className="card background-color-initial"
          onClick={this.handleClick}
        >
          <div className="columns">
            <div className="column">
              <figure className="image is-64x64 is-centered-image">
                <img src={coinImage} alt={this.props.coinName} />
              </figure>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <h1 className="title is-5">
                {' '}{coin.name || 'Coin Name'}{' '}
              </h1>
              <CSSTransitionGroup
                transitionName="count"
                transitionLeave={false}
                transitionEnterTimeout={1000}
                transitionAppearTimeout={1000}
                transitionAppear={true}
              >
                <h2 className="subtitle is-4" key={coin.price_usd || '$noData'}>
                  ${coin.price_usd || '$noData'}{' '}
                  <span className={upOrDown}>
                    {' '}({coin.percent_change_1h || '2'} %)
                  </span>
                </h2>
              </CSSTransitionGroup>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

Tile.contextTypes = {
  router: PropTypes.object.isRequired,
  key: PropTypes.string,
  coin: PropTypes.object,
  coinImg: PropTypes.string,
};

export default CoinTiles;

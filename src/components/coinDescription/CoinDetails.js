import React, { Component } from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import { cryptoCompareIds, fixSymbol, getCMCId } from '../../helpers/helpers';
import PropTypes from 'prop-types';

import Loader from '../loader/Loader';

import '../../styles/animations.css';
import 'bulma/css/bulma.css';
import './CoinDetails.css';

class CoinDetails extends Component {
  constructor(props) {
    super();

    this.state = {
      description: {},
      coinData: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.getSetCoins();
  }

  getSetCoins = async () => {
    let self = this;
    let responseCC;

    let coin_id = this.props.match.params.coin_id.toUpperCase();
    const sanitizedCoin_symbol = (function(coin_id) {
      if (fixSymbol[coin_id]) return fixSymbol[coin_id];
      else return coin_id;
    })(coin_id);

    let coin_id_CC = cryptoCompareIds[sanitizedCoin_symbol];

    let description;
    let tickerResponse = { data: {} };

    if (coin_id_CC)
      responseCC = await axios
        .get(
          `https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=${coin_id_CC}`,
        )
        .catch(function(error) {
          console.error(error);
        });

    if (
      responseCC &&
      responseCC.status === 200 &&
      responseCC.data.Data &&
      !responseCC.data.Error
    ) {
      description = responseCC.data.Data;
      let name = getCMCId(description.General.Id, description.General.Name);
      tickerResponse = await axios
        .get(`https://api.coinmarketcap.com/v1/ticker/${name}/`)
        .catch(error => {
          console.error(
            'not found for: ',
            description.General.Name.toLowerCase(),
          );
        });

      if (!tickerResponse) {
        // retrying with the symbol
        tickerResponse = await axios
          .get(
            `https://api.coinmarketcap.com/v1/ticker/${description.General.Symbol.toLowerCase()}/`,
          )
          .catch(async function(error) {
            return self.setState({
              loading: false,
              errors: true,
            });
          });
      }
    } else
      return self.setState({
        loading: false,
        errors: true,
      });

    if (tickerResponse)
      this.setState({
        description,
        coinData: tickerResponse && tickerResponse.data[0],
        loading: false,
      });
  };

  getWebsite = () => {
    if (
      this.state.description.General &&
      this.state.description.General.Website
    ) {
      //todo fix this:
      return this.state.description.General.AffiliateUrl;
    } else return '#';
  };

  upOrDown() {
    //if the coin is up show a green label, else red
    let upOrDown = '';
    if (
      this.state &&
      this.state.coinData &&
      this.state.coinData.percent_change_1h
    )
      upOrDown = this.state.coinData.percent_change_1h.includes('-')
        ? 'has-text-danger'
        : 'has-text-success';
    return upOrDown;
  }

  goHome = () => {
    this.context.router.history.push('/');
  };

  getDescription = () => {
    if (this.state.description.General)
      return this.state.description.General.Description
        .replace(/<\/?[^>]+(>|$)/g, '')
        .substring(0, 300);
    return '';
  };

  renderDetails = () => {
    if (!this.state.loading && !this.state.errors)
      return (
        <div className="columns">
          <div className="column is-1 vertical-align">
            <a className="big-arrow" onClick={this.goHome}>
              ←
            </a>
          </div>
          <div className="column is-10">
            <div className="columns has-text-centered">
              <div className="column is-6">
                <figure className="image is-128x128 is-centered-image">
                  <img
                    src={
                      this.state.description.General &&
                      `https://www.cryptocompare.com${this.state.description
                        .General.ImageUrl}`
                    }
                    alt={
                      this.state.description.General &&
                      this.state.description.General.Name
                    }
                  />
                </figure>
                <h1 className="title is-3">
                  {this.state.description.General &&
                    this.state.description.General.Name}
                </h1>
                <span className="tag is-primary">
                  Rank {this.state.coinData.rank}
                </span>
                <p className="is-size-7">
                  {this.getDescription()}{' '}
                  <a
                    target="_blank"
                    href={`https://en.wikipedia.org/wiki/${this.state
                      .description.General &&
                      this.state.description.General.Name}`}
                    className="has-text-primary"
                  >
                    ...
                  </a>
                </p>
              </div>
              <div className="column is-6 vertical-align">
                <h1 className="title is-6">Current Price</h1>
                <h1 className="title is-3">
                  USD {this.state.coinData.price_usd} (<span
                    className={this.upOrDown() + ''}
                  >
                    {this.state.coinData.percent_change_1h}%
                  </span>)
                </h1>
                <h1 className="title is-6">Circulating Supply</h1>
                <h1 className="title is-3">
                  {this.state.coinData.available_supply}{' '}
                  {this.state.coinData.symbol}
                </h1>
                <h1 className="title is-6">Market Cap</h1>
                <h1 className="title is-3">
                  USD {this.state.coinData.market_cap_usd}
                </h1>
                <h1 className="title is-6">
                  Proof type:{' '}
                  <span className="tag is-warning">
                    {this.state.description.General &&
                      this.state.description.General.ProofType}
                  </span>
                </h1>
                <a target="_blank" href={this.getWebsite()}>
                  <FontAwesome
                    className="super-crazy-colors"
                    name="link"
                    size="2x"
                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    else if (!this.state.loading && this.state.errors)
      return (
        <div className="columns">
          <div className="column is-1 vertical-align">
            <a className="big-arrow" onClick={this.goHome}>
              ←
            </a>
          </div>
          <div className="column is-10 has-text-centered">
            <h1 className="title has-text-1">Description not found...</h1>
            <h2 className="subtitle has-text-2">
              Unfortunately we didn't manage to get the description for this
              coin. Please try with another one.
            </h2>
          </div>
        </div>
      );

    return null;
  };

  render() {
    return (
      <div className="hero-body is-paddingless">
        <div className="container">
          <Loader loading={this.state.loading} />
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}

CoinDetails.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default CoinDetails;

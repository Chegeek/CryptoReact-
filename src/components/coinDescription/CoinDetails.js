import React, {Component} from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import {cryptoCompareIds, fixSymbol} from '../../helpers/helpers'
import PropTypes from 'prop-types';


import Header from '../header/Header'


import '../../styles/animations.css';
import 'bulma/css/bulma.css';


class CoinDetails extends Component {

    constructor(props) {
        super();

        this.state = {
            description: {},
            coinData: {},
        };

        let coin_id = props.match.params.coin_id.toUpperCase();
        const sanitizedCoin_symbol = function(coin_id) {
            if(fixSymbol[coin_id])
                return fixSymbol[coin_id];
            else
                return coin_id;
        }(coin_id);

        let coin_id_CC = cryptoCompareIds[sanitizedCoin_symbol];

        const getSetCoins = async () => {
            let description;
            let tickerResponse = { data: {} };
            console.log(coin_id_CC);
            let responseCC = await axios.get(`https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=${coin_id_CC}`)
                .catch(function (error) {
                    console.log(error);
                });

            console.log(responseCC.data.Data.General);

            if(responseCC.status === 200 && responseCC.data.Data) {
                description = responseCC.data.Data;
                tickerResponse = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${responseCC.data.Data.General.Name.toLowerCase()}/`)
                    .catch((error) => {console.log('not found for: ', responseCC.data.Data.General.Name.toLowerCase())});

                if(!tickerResponse){ // retrying with the symbol

                    tickerResponse = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${responseCC.data.Data.General.Symbol.toLowerCase()}/`)
                        .catch(async function (error) {
                            console.log('can\'t find anything. Going back home');
                            return this.context.router.history.push(`/`);
                        });

                }
            }else
                return this.context.router.history.push(`/`);

            this.setState({
                description, coinData: tickerResponse.data[0]
            })
        };

        getSetCoins()


    }

    getWebsite = () => {
        if(this.state.description.General && this.state.description.General.Website){
            // console.log(this.state.description.General.Website.match(/href=("|')(.*?)("|')/g));
            // return this.state.description.General.Website.match(/href=("|')(.*?)("|')/g)[0];
            //todo fix this:
            return this.state.description.General.AffiliateUrl
        } else
            return '#'
    };

    // upOrDown = () => {
    //     let upOrDown = '';
    //     if(this.state && this.state.coinData)
    //         upOrDown = this.state.coinData.percent_change_1h.includes('-') ? 'has-text-danger': 'has-text-success';
    //     return upOrDown;
    // };

    render() {


        return (
            <section className="hero is-medium is-dark is-bold is-fullheight">
                <Header/>
                <div className="hero-body is-paddingless">
                    <div className="container">
                        {/*<h1>Coin</h1>*/}
                        <div className="columns">
                            <div className="column is-10 is-offset-1">
                                <div className="columns has-text-centered">
                                    <div className="column is-6">
                                        <figure className="image is-128x128 is-centered-image">
                                            <img src={this.state.description.General && 'https://www.cryptocompare.com' + this.state.description.General.ImageUrl}
                                                 alt={this.state.description.General && this.state.description.General.Name}/>
                                        </figure>
                                        <h1 className="title is-3">{this.state.description.General && this.state.description.General.Name}</h1>
                                        <span className="tag is-primary">Rank {this.state.coinData.rank}</span>
                                        <p className="is-size-7">
                                            {
                                                this.state.description.General &&
                                                this.state.description.General.Description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300)
                                            } <a target="_blank" href={`https://en.wikipedia.org/wiki/${this.state.description.General && this.state.description.General.Name}`} className="has-text-primary">...</a>
                                        </p>
                                    </div>
                                    <div className="column is-6 vertical-align">

                                        <h1 className="title is-6">Current Price</h1>
                                        <h1 className="title is-3">USD {this.state.coinData.price_usd} (<span className={/*this.upOrDown()*/ ''}>{this.state.coinData.percent_change_1h}%)</span></h1>
                                        <h1 className="title is-6">Circulating Supply</h1>
                                        <h1 className="title is-3">{this.state.coinData.available_supply} {this.state.coinData.symbol}</h1>
                                        <h1 className="title is-6">Market Cap</h1>
                                        <h1 className="title is-3">USD {this.state.coinData.market_cap_usd}</h1>
                                        <h1 className="title is-6">Proof type: <span className="tag is-warning">{this.state.description.General && this.state.description.General.ProofType}</span></h1>
                                        {/*<h1 className="title is-3"></h1>*/}
                                        <a target="_blank" href={this.getWebsite()}>
                                            <FontAwesome
                                                className='super-crazy-colors'
                                                name='link'
                                                size='2x'
                                                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

CoinDetails.contextTypes = {
    router: PropTypes.object.isRequired,
};

export default CoinDetails;

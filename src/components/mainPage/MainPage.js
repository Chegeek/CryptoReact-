import React, {Component} from 'react';
import axios from 'axios';


import Header from '../header/Header'
import CoinTiles from './coinTiles/CoinTiles'
import {fixSymbol} from '../../helpers/helpers';


import '../../styles/animations.css';
import 'bulma/css/bulma.css';


class App extends Component {

    constructor() {
        super();

        this.state = {
            coinsTick: [],
            coinsDesc: [],
            coinsImgs: [],
        };

        const getSetCoins = async () => {

            //get the top 10 coins
            let responseCMC = await axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=120')
                .catch(function (error) {
                    console.log(error);
                });

            //get the images and IDs for CryptoCompare
            let responseCCcoins = await axios.get('https://www.cryptocompare.com/api/data/coinlist/')
                .catch(function (error) {
                    console.log(error);
                });



            const coinsTick = responseCMC.data;
            const baseImageUrl = responseCCcoins.data.BaseImageUrl;
            responseCCcoins = responseCCcoins.data.Data;
            let coinsImgs = {};

            coinsTick.forEach((tick) => {
                if(responseCCcoins[tick.symbol])
                    coinsImgs[tick.symbol] = baseImageUrl + responseCCcoins[tick.symbol].ImageUrl
                else if(responseCCcoins[fixSymbol[tick.symbol]])
                    coinsImgs[tick.symbol] = baseImageUrl + responseCCcoins[fixSymbol[tick.symbol]].ImageUrl || '';
                else
                    coinsImgs[tick.symbol] = '';

            });

            this.setState({coinsTick, coinsImgs});
        };

        getSetCoins()

    }



    // toggleisWhatIsModal={this.toggleisWhatIsModal}
    render() {
        return (
            <section className="hero is-medium is-dark is-bold is-fullheight">
                <Header />
                <div className="hero-body ">
                    <div className="container">
                        <CoinTiles coins={this.state.coinsTick} coinsImg={this.state.coinsImgs}/>
                    </div>
                </div>
            </section>
        );
    }
}

export default App;

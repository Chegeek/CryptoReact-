import React, {Component} from 'react';
import logo from './modals/logo.svg';
import PropTypes from 'prop-types';

import Modal from './modals/Modal';



class Header extends Component {

    constructor() {
        super()
        this.state = {
            isWhatIsOpen: false
        }
    }

    goHome= () => {
        this.context.router.history.push('/');
    };

    toggleisWhatIsModal = () => {
        this.setState({
            isWhatIsOpen: !this.state.isWhatIsOpen
        });
    };


    render() {
        return (
                <div className="hero-head">
                    <header className="nav">
                        <div className="container">
                            <div className="nav-left">
                                <a className="nav-item" href=""  onClick={this.goHome}>
                                    <img src={logo} className="App-logo" alt="Logo"/>
                                    CryptoReact
                                </a>
                            </div>

                            <div className="nav-right nav-menu">
                                <span className="nav-item">
                                    <a className="button is-dark" onClick={this.toggleisWhatIsModal}>
                                      What's this?
                                    </a>
                              </span>
                            </div>
                        </div>
                    </header>
                    <Modal show={this.state.isWhatIsOpen} toggleisWhatIsModal={this.toggleisWhatIsModal}/>
                </div>
        );
    }
}

Header.contextTypes = {
    router: PropTypes.object.isRequired,
};

export default Header;


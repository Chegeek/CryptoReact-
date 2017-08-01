import React from 'react';
import './loader.css';

export default class Loader extends React.Component {
  showLoader = () => {
    if (this.props.loading) return <Loader />;
  };

  render() {
    if (this.showLoader())
      return (
        <div className="columns">
          <div className="column is-10 is-centered-image">
            <div className="lds-css is-centered-image">
              <div className="spinner lds-ripple has-text-centered is-centered-image">
                <div className="central-spin" />
              </div>
            </div>
          </div>
        </div>
      );
    else return null;
  }
}

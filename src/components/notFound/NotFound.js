import React from 'react';

class NotFound extends React.Component {
  render() {
    return (
      <div className="hero-body is-paddingless">
        <div className="container">
          <h2 className="title has-text-1 has-text-centered has-text-warning">
            404 <span role="img" aria-label="Sad">😒</span> This page is not found...
          </h2>
        </div>
      </div>
    );
  }
}

export default NotFound;

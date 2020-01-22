import React, { useEffect } from 'react';

const WentWrong = ({ history, location }) => {
  useEffect(() => {
    let pushTo = null;
    let timeout = 2500;
    if (location.state) {
      let { pushTo = null, timeout = 2500 } = location.state;
    }

    if (pushTo) setTimeout(() => history.push(pushTo), timeout);
  }, []);

  return (
    <div className="WentWrong page-container">
      <div className="container">
        <h1>Sorry, something went wrong. Please try again.</h1>
      </div>
    </div>
  );
};

export default WentWrong;

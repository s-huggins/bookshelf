import React, { useEffect } from 'react';

const WentWrong = ({ history, location }) => {
  useEffect(() => {
    if (location.state && location.state.pushTo) {
      const { pushTo, timeout = 0 } = location.state;
      // push away to final destination if given a timeout > 0
      if (timeout > 0) setTimeout(() => history.push(pushTo), timeout);
    }
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

/* This version can be directly rendered in JSX with props */
// import React, { useEffect } from 'react';
// import { useLocation, useHistory } from 'react-router-dom';

// const WentWrong = ({ history, location, pushTo, timeout }) => {
//   const location = useLocation();
//   const history = useHistory();

//   useEffect(() => {
//     let push = pushTo;
//     let wait = timeout;
//     if (location.state) {
//       // if arriving from a stateful history.push or <Redirect />
//       push = location.state.pushTo;
//       wait = location.state.timeout || 0;
//     }

//     if (push && wait > 0) setTimeout(() => history.push(push), wait);
//     // otherwise stay on page
//   }, []);

//   return (
//     <div className="WentWrong page-container">
//       <div className="container">
//         <h1>Sorry, something went wrong. Please try again.</h1>
//       </div>
//     </div>
//   );
// };

// export default WentWrong;

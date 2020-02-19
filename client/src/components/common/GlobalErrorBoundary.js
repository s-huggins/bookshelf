// import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';

// class GlobalErrorBoundary extends Component {
//   state = {
//     errorThrown: false
//   };

//   static getDerivedStateFromError(err) {
//     return { errorThrown: true };
//   }

//   render() {
//     return (
//       <>
//         {this.state.errorThrown ? (
//           <Redirect
//             to={{
//               pathname: '/something-went-wrong',
//               state: {
//                 pushTo: '/user',
//                 timeout: 500
//               }
//             }}
//           />
//         ) : (
//           this.props.children
//         )}
//       </>
//     );
//   }
// }

// export default GlobalErrorBoundary;

import React, { Component } from 'react';

class GlobalErrorBoundary extends Component {
  state = {
    errorThrown: false
  };

  static getDerivedStateFromError(err) {
    return { errorThrown: true };
  }

  render() {
    return (
      <>
        {!this.state.errorThrown ? (
          this.props.children
        ) : (
          <div className="GlobalError page-container">
            <h1>Something went wrong!</h1>
          </div>
        )}
      </>
    );
  }
}

export default GlobalErrorBoundary;

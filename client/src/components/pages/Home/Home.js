// import React from 'react';
// import { useSelector } from 'react-redux';
// import Landing from '../Landing/Landing';
// import Feed from '../Feed/Feed';
// import Loader from '../../common/Loader';
// import PrivateRoute from '../../Routes/PrivateRoute';
// import Profile from '../Profile/Profile';

// const Home = ({ history }) => {
//   const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
//   const loadingUser = useSelector(state => state.auth.loadingUser);

//   if (loadingUser) {
//     return <Loader />;
//   }

//   // return (
//   //   <>
//   //     {isAuthenticated ? (
//   //       <PrivateRoute exact path="/" component={Feed} />
//   //     ) : (
//   //       <Landing />
//   //     )}
//   //   </>
//   // );
//   return (
//     <>
//       {isAuthenticated ? (
//         <PrivateRoute exact path="/" component={Profile} />
//       ) : (
//         <Landing />
//       )}
//     </>
//   );
// };

// export default Home;

import React from 'react';
import { useSelector } from 'react-redux';
import Landing from '../Landing/Landing';
import Loader from '../../common/Loader';

const Home = ({ history }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loadingUser = useSelector(state => state.auth.loadingUser);

  if (loadingUser) {
    return <Loader />;
  } else if (isAuthenticated) {
    history.push('/user');
    return null;
  } else {
    return <Landing />;
  }
};

export default Home;

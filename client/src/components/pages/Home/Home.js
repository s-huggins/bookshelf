import React from 'react';
import { useSelector } from 'react-redux';
import Landing from '../Landing/Landing';
import Feed from '../Feed/Feed';
import Loader from '../../common/Loader';
import PrivateRoute from '../../Routes/PrivateRoute';

const Home = ({ history }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loadingUser = useSelector(state => state.auth.loadingUser);

  if (loadingUser) {
    return <Loader />;
  }

  return (
    <>
      {isAuthenticated ? (
        <PrivateRoute exact path="/" component={Feed} />
      ) : (
        <Landing />
      )}
    </>
  );
};

export default Home;

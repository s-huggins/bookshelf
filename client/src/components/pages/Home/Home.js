import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Landing from '../Landing/Landing';
import Feed from '../Feed/Feed';
import Loader from '../../common/Loader';
import PrivateRoute from '../../Routes/PrivateRoute';

const Home = ({ history }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  // const dispatch = useDispatch();
  const loadingUser = useSelector(state => state.auth.loadingUser);
  // console.log(loadingUser);
  // useEffect(() => {
  //   dispatch(setCurrentUser());
  // }, []);

  if (loadingUser) {
    return <Loader />;
  }

  // return <>{isAuthenticated ? <Feed /> : <Landing history={history} />}</>;
  return (
    <>
      {isAuthenticated ? (
        // <PrivateRoute exact path="/" component={Feed} />
        <Feed />
      ) : (
        <Landing history={history} />
      )}
    </>
  );
};

export default Home;

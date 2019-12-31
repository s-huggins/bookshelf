import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loader from './Loader';
import { setCurrentUser } from '../../redux/auth/authActions';

const PrivateRoute = ({ component: Component, componentProps, ...rest }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loadingUser = useSelector(state => state.auth.loadingUser);
  const dispatch = useDispatch();
  dispatch(setCurrentUser());

  return (
    <Route
      {...rest}
      render={routerProps =>
        loadingUser ? (
          <Loader />
        ) : isAuthenticated ? (
          <Component {...routerProps} {...componentProps} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;

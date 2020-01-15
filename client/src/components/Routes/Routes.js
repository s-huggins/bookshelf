import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home/Home';
import Search from '../pages/Search/Search';
import Book from '../pages/Book/Book';
import UnauthenticatedRoutes from './UnauthenticatedRoutes';
import ErrorRoutes from './ErrorRoutes';
import AccountRoutes from './AccountRoutes';
import AuthorRoutes from './AuthorRoutes';
import UserRoutes from './UserRoutes';
import HandleRoutes from './HandleRoutes';

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        {UnauthenticatedRoutes}
        {ErrorRoutes}
        {AccountRoutes}
        {AuthorRoutes('/author')}
        <PrivateRoute exact path="/search" component={Search} />
        <PrivateRoute exact path="/book/:id" component={Book} />
        {UserRoutes('/user')}
        {HandleRoutes('/:handle')}
      </Switch>
    </>
  );
};

export default Routes;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import Home from '../pages/Home/Home';
import Signup from '../pages/Signup';
import Signin from '../pages/Signin';
import Profile from '../pages/Profile/Profile';
import Edit from '../pages/Edit/Edit';
import NotFound from '../pages/NotFound';
import ChangeEmail from '../pages/Edit/ChangeEmail';
import ChangePassword from '../pages/Edit/ChangePassword';
import Search from '../pages/Search/Search';
import Book from '../pages/Book/Book';
import WentWrong from '../pages/WentWrong';
import Author from '../pages/Author/Author';
import AuthorBooks from '../pages/Author/AuthorBooks';
import DeleteAccount from '../pages/Edit/DeleteAccount';
import Bookshelves from '../pages/Profile/Bookshelves';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Signup} />
        <Route exact path="/login" component={Signin} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route
          exact
          path="/reset-password/:resetToken?"
          component={ResetPassword}
        />
        <Route exact path="/not-found" component={NotFound} />
        <Route exact path="/something-went-wrong" component={WentWrong} />
        <PrivateRoute exact path="/change-email" component={ChangeEmail} />
        <PrivateRoute
          exact
          path="/change-password"
          component={ChangePassword}
        />
        <PrivateRoute exact path="/delete-account" component={DeleteAccount} />
        <PrivateRoute exact path="/user/edit" component={Edit} />
        <PrivateRoute exact path="/user/bookshelves" component={Bookshelves} />
        <PrivateRoute
          exact
          path="/user/:id/bookshelves"
          component={Bookshelves}
        />
        <PrivateRoute
          exact
          path="/:handle/bookshelves"
          component={Bookshelves}
        />

        <PrivateRoute exact path="/user/:id?" component={Profile} />
        <PrivateRoute exact path="/search" component={Search} />
        <PrivateRoute exact path="/book/:id" component={Book} />
        <PrivateRoute exact path="/author/:id" component={Author} />
        <PrivateRoute exact path="/author/:id/books" component={AuthorBooks} />
        <PrivateRoute
          exact
          path="/author/:id/books/page/:pageNum?"
          component={AuthorBooks}
        />
        <PrivateRoute exact path="/:handle" component={Profile} />
      </Switch>
    </>
  );
};

export default Routes;

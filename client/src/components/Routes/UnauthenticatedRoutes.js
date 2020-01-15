import React from 'react';
import { Route } from 'react-router-dom';
import Signup from '../pages/Signup';
import Signin from '../pages/Signin';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

const propsArray = [
  { path: '/register', component: Signup },
  { path: '/login', component: Signin },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password/:resetToken?', component: ResetPassword }
];

export default propsArray.map(props => (
  <Route exact {...props} key={props.path} />
));

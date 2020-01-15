import React from 'react';
import PrivateRoute from './PrivateRoute';
import ChangeEmail from '../pages/Edit/ChangeEmail';
import ChangePassword from '../pages/Edit/ChangePassword';
import DeleteAccount from '../pages/Edit/DeleteAccount';

const propsArray = [
  { path: '/change-email', component: ChangeEmail },
  { path: '/change-password', component: ChangePassword },
  { path: '/delete-account', component: DeleteAccount }
];

export default propsArray.map(props => (
  <PrivateRoute exact {...props} key={props.path} />
));

import React from 'react';
import PrivateRoute from './PrivateRoute';
import Messenger from '../pages/Messages/Messenger';

const propsArray = [{ path: `/message`, component: Messenger }];

export default propsArray.map(props => (
  <PrivateRoute {...props} key={props.path} />
));

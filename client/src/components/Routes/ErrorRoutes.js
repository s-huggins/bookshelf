import React from 'react';
import { Route } from 'react-router-dom';

import NotFound from '../pages/NotFound';
import WentWrong from '../pages/WentWrong';

const propsArray = [
  { path: '/not-found', component: NotFound },
  { path: '/something-went-wrong', component: WentWrong }
];

export default propsArray.map(props => (
  <Route exact {...props} key={props.path} />
));

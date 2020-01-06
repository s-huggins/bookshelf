import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../../redux/auth/authActions';

/* TODO: Header will vary based on authentication status
i.e. the signin form will change to a logout button
*/

const HeaderLogin = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const failedSignIn = useSelector(state => state.auth.failedSignIn);

  const logIn = e => {
    e.preventDefault();

    const userData = { email, password };
    dispatch(signIn(userData));
  };

  useEffect(() => {
    if (failedSignIn) {
      history.push('/login');
    }
  }, [failedSignIn]);

  return (
    <div className="Header__sign-in">
      <form id="login-form" onSubmit={logIn} autoComplete="off">
        <div className="input-container">
          <input
            className="form-control form-control--nav"
            type="text"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
          />

          <input
            className="form-control form-control--nav"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="input-container__footer">
          <span>{/*Remember me*/}</span>
          <span className="forgot-password">
            <Link to="forgot-password">Forgot it?</Link>
          </span>
        </div>
      </form>
      <button
        form="login-form"
        type="submit"
        className="btn btn--dark btn--sign-in"
      >
        Sign in
      </button>
    </div>
  );
};

export default withRouter(HeaderLogin);

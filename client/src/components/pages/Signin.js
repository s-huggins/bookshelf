import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../redux/auth/authActions';
import Loader from '../common/Loader';

function Signin({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const errors = useSelector(state => state.auth.signInErrors);
  // const failedSignIn = useSelector(state => state.auth.failedSignIn);
  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const { failedSignIn, isAuthenticated, loadingUser } = useSelector(
    state => state.auth
  );

  const signin = e => {
    e.preventDefault();
    // backend needs passwordConfirm!
    const userData = {
      email,
      password,
      passwordConfirm: password
    };

    dispatch(signIn(userData));

    // setEmail('');
    // setPassword('');
  };

  if (loadingUser) return <Loader />;
  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="Signin">
      <main>
        <div className="container">
          <div className="form-container">
            <h1>Sign in to bookshelf</h1>
            <hr />
            {failedSignIn && (
              <div className="errors">
                {Object.entries(errors).map(([k, e]) => (
                  <p key={k}>{e}</p>
                ))}
              </div>
            )}
            <form onSubmit={signin} autoComplete="off">
              <label htmlFor="email">Email</label>
              <input
                className={`form-control form-control--register ${
                  errors.email || errors.invalid ? 'input-error' : ''
                }`}
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
              />
              <label htmlFor="password">Password</label>
              <input
                className={`form-control form-control--register ${
                  errors.password || errors.invalid ? 'input-error' : ''
                }`}
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div className="btn-container">
                <button className="btn btn--register">Sign in</button>
                <span>
                  <a href="#!">Forgot password</a>
                </span>
              </div>
            </form>
            <div className="signin-footer">
              <span>
                Not a member?{' '}
                <span>
                  <a href="#!">Sign up</a>
                </span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signin;

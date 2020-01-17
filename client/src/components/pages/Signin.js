import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logIn, clearFailedSignin } from '../../redux/auth/authActions';
import Loader from '../common/Loader';

function Signin({ location }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const signIn = useSelector(state => state.auth.signIn);

  const { isAuthenticated, loadingUser } = useSelector(state => state.auth);

  useEffect(() => {
    console.log(location);
    if (location.state) setEmail(location.state.email);

    return () => {
      dispatch(clearFailedSignin());
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    // backend needs passwordConfirm!
    const userData = {
      email,
      password,
      passwordConfirm: password
    };

    dispatch(logIn(userData)); // a successful logIn will set isAuthenticated to true and trigger a rerender, redirecting user to Home
  };

  if (loadingUser) return <Loader />;
  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="Signin page-container">
      <main>
        <div className="container">
          <div className="form-container">
            <h1>Sign in to bookshelf</h1>
            <hr />
            {signIn.failed && (
              <div className="errors">
                {Object.entries(signIn.errors).map(([k, e]) => (
                  <p key={k}>{e}</p>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} autoComplete="off">
              <label htmlFor="email">Email</label>
              <input
                className={`form-control form-control--register ${
                  signIn.failed &&
                  (signIn.errors.email || signIn.errors.invalid)
                    ? 'input-error'
                    : ''
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
                  signIn.failed &&
                  (signIn.errors.password || signIn.errors.invalid)
                    ? 'input-error'
                    : ''
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
                  <Link to="forgot-password">Forgot password</Link>
                </span>
              </div>
            </form>
            <div className="signin-footer">
              <span>
                Not a member?{' '}
                <span>
                  <Link to="/register">Sign up</Link>
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

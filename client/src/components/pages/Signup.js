import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, clearFailedSignup } from '../../redux/auth/authActions';
import Loader from '../common/Loader';

function Signup({ history, location }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isAuthenticated, signUp, loadingUser } = useSelector(
    state => state.auth
  );

  useEffect(() => {
    if (history.location.state) {
      const { name, email } = location.state;
      setName(name);
      setEmail(email);
    }

    return () => {
      dispatch(clearFailedSignup());
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    // backend needs passwordConfirm!
    const userData = {
      name,
      email,
      password,
      passwordConfirm: password
    };

    dispatch(register(userData));
  };

  if (loadingUser) return <Loader />;
  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="Signup page-container">
      <main>
        <div className="container">
          <div className="form-container">
            <h1>Sign up for bookshelf</h1>
            <p>
              Sign up to see what your friends are reading, get book
              recommendations, and join our large community of readers.
            </p>
            <hr />
            {signUp.failed && (
              <div className="errors">
                {Object.entries(signUp.errors).map(([k, e]) => (
                  <p key={k}>{e}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              <label htmlFor="name">Name</label>
              <input
                className={`form-control form-control--register ${
                  signUp.failed && signUp.errors.name ? 'input-error' : ''
                }`}
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
              />
              <label htmlFor="email">Email</label>
              <input
                className={`form-control form-control--register ${
                  signUp.failed && signUp.errors.email ? 'input-error' : ''
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
                  signUp.failed && signUp.errors.password ? 'input-error' : ''
                }`}
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div className="btn-container">
                <button type="submit" className="btn btn--register">
                  Sign up
                </button>
                <span>
                  Already a member? <Link to="/login">Sign in</Link>
                </span>
              </div>
            </form>
            <p className="signup-terms">
              By clicking “Sign up” I agree to the bookshelf Terms of Service
              and confirm that I am at least 13 years old.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;

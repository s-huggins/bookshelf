import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  register,
  clearLandingAuthFail
} from '../../../redux/auth/authActions';

const LandingRegistration = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const landingAuthFail = useSelector(state => state.auth.landingAuthFail);
  const failedSignUp = useSelector(state => state.auth.signUp.failed);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (landingAuthFail) {
      history.push({
        pathname: '/register',
        state: {
          name,
          email
        }
      });
      dispatch(clearLandingAuthFail());
    } else if (isAuthenticated) {
      history.push('/');
    }
  }, [failedSignUp, landingAuthFail, isAuthenticated]);

  const handleSubmit = e => {
    e.preventDefault();

    // backend expects passwordConfirm!
    const userData = {
      name,
      email,
      password,
      passwordConfirm: password
    };

    dispatch(register(userData, true));
  };

  return (
    <div className="register">
      <h2>New here? Create a free account!</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          className="form-control form-control--register"
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="First name"
        />
        <input
          className="form-control form-control--register"
          type="text"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
        />
        <input
          className="form-control form-control--register"
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div>
          <button className="btn btn--register">Sign up</button>

          <p>
            By clicking “Sign up” I agree to the bookshelf Terms of Service and
            confirm that I am at least 13 years old.
          </p>
        </div>
      </form>
    </div>
  );
};

export default LandingRegistration;

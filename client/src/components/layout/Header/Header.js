import React from 'react';
import { useSelector } from 'react-redux';
import HeaderLogo from './HeaderLogo';
import HeaderLogin from './HeaderLogin';
import HeaderProfile from './HeaderProfile';

const Header = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loadingUser = useSelector(state => state.auth.loadingUser);

  return (
    <header className={`Header ${!isAuthenticated ? 'Header--expand' : ''}`}>
      <nav>
        <div className="container">
          <HeaderLogo />

          {!loadingUser &&
            (isAuthenticated ? <HeaderProfile /> : <HeaderLogin />)}
        </div>
      </nav>
    </header>
  );
};

export default Header;

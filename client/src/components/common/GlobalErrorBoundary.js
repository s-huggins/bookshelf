import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../redux/auth/authActions';
import GlobalErrorBoundaryLogo from './GlobalErrorBoundaryLogo';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class GlobalErrorBoundary extends Component {
  state = {
    errorThrown: false
  };

  static getDerivedStateFromError(err) {
    return { errorThrown: true };
  }

  componentDidUpdate() {
    if (!this.props.isAuthenticated && this.state.errorThrown)
      window.location.reload();
  }

  handleNavigateAway = () => {
    this.setState({ errorThrown: false });
  };

  handleSignOut = () => this.props.signOut();

  render() {
    return (
      <>
        {!this.state.errorThrown ? (
          this.props.children
        ) : (
          <main className="GlobalError">
            <header className="Header">
              <nav className="header-contents">
                <GlobalErrorBoundaryLogo
                  handleNavigateAway={this.handleNavigateAway}
                />
              </nav>
            </header>

            <div className="GlobalError page-container">
              <h1>Something went wrong!</h1>
              <div className="button-bar">
                <button
                  className="btn btn--light"
                  onClick={this.handleNavigateAway}
                >
                  Back to my Profile
                </button>
                <button className="btn btn--light" onClick={this.handleSignOut}>
                  Sign out
                </button>
              </div>
            </div>
          </main>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

export default compose(
  connect(mapStateToProps, { signOut }),
  withRouter
)(GlobalErrorBoundary);

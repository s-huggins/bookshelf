import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './redux/store';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer';
import './styles/index.scss';
import { setCurrentUser } from './redux/auth/authActions';
import Routes from './components/Routes/Routes';

store.dispatch(setCurrentUser());

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <Routes />
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;

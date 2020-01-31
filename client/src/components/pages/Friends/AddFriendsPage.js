import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileResult from './ProfileResult';
import { useRef } from 'react';
import SearchMembers from './SearchMembers';

const AddFriendsPage = () => {
  const [searchInputs, setSearchInputs] = useState({ email: '', twitter: '' });
  const currentSearch = useRef('');
  const [resultsString, setResultsString] = useState('');
  const [profileResults, setProfileResults] = useState(null);
  const token = useSelector(state => state.auth.token);

  const fetchProfiles = async queryStr => {
    const uri = `http://localhost:5000/api/v1/profile/search?${queryStr}`;
    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();

    if (json.status === 'success') {
      return json.data.profiles;
    } else {
      return [];
    }
  };

  const handleEmailSearch = async e => {
    e.preventDefault();
    if (!searchInputs.email.trim()) return;
    // const profiles = await fetchProfiles({ email: searchInputs.email });
    const profiles = await fetchProfiles(`email=${searchInputs.email}`);
    currentSearch.current = 'email';
    setProfileResults(profiles);
    makeResultsString();
  };
  const handleTwitterSearch = async e => {
    e.preventDefault();
    if (!searchInputs.twitter.trim()) return;
    let twitterAcc = searchInputs.twitter;
    twitterAcc = twitterAcc.startsWith('@')
      ? twitterAcc.substring(1)
      : twitterAcc;

    // const profiles = await fetchProfiles({ twitter: twitterAcc });
    const profiles = await fetchProfiles(`twitter=${twitterAcc}`);
    currentSearch.current = 'twitter';
    setProfileResults(profiles);
    makeResultsString();
  };

  const handleInputChange = e => {
    setSearchInputs({ ...searchInputs, [e.target.name]: e.target.value });
  };

  const makeResultsString = () => {
    const searched = currentSearch.current;
    let str;
    if (searched === 'email') {
      str = (
        <p className="results-text">
          Showing results for email:{' '}
          <span className="bold-text">{searchInputs.email}</span>
        </p>
      );
    } else if (searched === 'twitter') {
      str = (
        <p className="results-text">
          Showing results for twitter handle:{' '}
          <span className="bold-text">@{searchInputs.twitter}</span>
        </p>
      );
    }

    setResultsString(str);
  };

  return (
    <div className="AddFriendsPage Friends__page">
      <main className="Friends__page-main">
        <h2 className="add-friends-header">
          Find friends in your address book who are on bookshelf.
        </h2>
        <div className="friends-address-search">
          <form onSubmit={handleEmailSearch} autoComplete="off">
            <label htmlFor="email-search">Email address lookup:</label> <br />
            <input
              id="email-search"
              type="text"
              className="form-control input-email"
              placeholder="Email"
              name="email"
              value={searchInputs.email}
              onChange={handleInputChange}
            />
            <button className="btn btn--light">Search</button>
          </form>
        </div>
        <div className="friends-address-search">
          <form onSubmit={handleTwitterSearch} autoComplete="off">
            <label htmlFor="twitter-search">Twitter handle lookup:</label>{' '}
            <br />
            <input
              id="twitter-search"
              type="text"
              className="form-control input-twitter"
              placeholder="@"
              name="twitter"
              value={searchInputs.twitter}
              onChange={handleInputChange}
            />
            <button className="btn btn--light">Search</button>
          </form>
        </div>
        <div className="friend-results">
          {currentSearch.current && resultsString}
          {profileResults && profileResults.length === 0 && (
            <span className="no-results-text">No profiles found.</span>
          )}
          {profileResults &&
            profileResults.map(prof => (
              <ProfileResult key={prof.id} {...prof} />
            ))}
        </div>
      </main>
      <aside className="Friends__page-side sidebar">
        <div className="sidebar__panel link-list">
          <ul className="find-friends">
            <li>
              <Link to="/user/friends/of-friends" className="green-link">
                View friends of friends
              </Link>
            </li>
            <li>
              <SearchMembers />
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AddFriendsPage;

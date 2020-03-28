import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import SearchMembers from './SearchMembers';
import Loader from '../../common/Loader';
import ProfileResult from './ProfileResult';
import Pagination from '../../common/Pagination';

const FindFriends = () => {
  const location = useLocation();
  const token = useSelector(state => state.auth.token);
  const [fetching, setFetching] = useState(false);

  const [profilesView, setProfilesView] = useState({
    profiles: null,
    startIndex: 0,
    endIndex: 50
  });

  const fetchProfiles = async queryStr => {
    const uri = `/api/v1/profile/search?search=${queryStr}`;
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
      // setFetching(false);
      setProfilesView({
        startIndex: 0,
        endIndex: 50,
        profiles: json.data.profiles
      });
    } else {
      // setFetching(false);
      setProfilesView({ startIndex: 0, endIndex: 50, profiles: [] });
    }
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const searchQuery = parsed.search;
    if (searchQuery === '') return;
    setFetching(true);
    fetchProfiles(searchQuery);

    // fetch data
  }, [location]);

  useEffect(() => {
    if (profilesView.profiles == null) return;

    setFetching(false);
  }, [profilesView]);

  const getPaginationSettings = () => {
    const parsed = queryString.parse(location.search);
    let page = parseInt(parsed['page']) || 1;
    page = page <= 0 ? 1 : page;
    return {
      perPage: 50,
      total: profilesView.profiles.length,
      page,

      useQueryParam: true,
      noLimit: true
    };
  };

  // if (!loadingProfile && !profile) {
  //   return <Redirect to="/something-went-wrong" />;
  // }
  return (
    <div className="FindFriends page-container">
      <div className="container">
        <main>
          <h1>
            <Link to="/user/friends" className="green-link">
              Friends
            </Link>{' '}
            &gt; Find a Friend
          </h1>
          <div className="content-container">
            <h2 className="header-text">Search profiles</h2>
            <p>
              {' '}
              Find bookshelf users by their name, display name, social media
              handles, or bookshelf handle:
            </p>
            <div className="FindFriends__search">
              <SearchMembers />
            </div>
            <div className="FindFriends__list">
              {fetching ? (
                <Loader />
              ) : !profilesView.profiles ? null : profilesView.profiles.length >
                0 ? (
                <>
                  <div className="FindFriends__pagination">
                    <Pagination {...getPaginationSettings()} />
                  </div>
                  {profilesView.profiles
                    .slice(profilesView.startIndex, profilesView.endIndex)
                    .map(prof => (
                      <ProfileResult key={prof.id} {...prof} />
                    ))}
                  <div className="FindFriends__pagination">
                    <Pagination {...getPaginationSettings()} />
                  </div>
                </>
              ) : (
                <p>No profiles found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindFriends;

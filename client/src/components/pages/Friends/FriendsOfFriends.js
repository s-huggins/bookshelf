import React, { useState, useEffect } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import FriendOfFriend from './FriendOfFriend';
import Loader from '../../common/Loader';
import { useSelector } from 'react-redux';
import Pagination from '../../common/Pagination';
import queryString from 'query-string';

const FriendsOfFriends = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [listView, setListView] = useState({
    list: [],
    startIndex: 0,
    endIndex: 50
  });
  const location = useLocation();
  const token = useSelector(state => state.auth.token);
  const friends = useSelector(state => state.auth.user.profile.friends);
  // fetch user profile with friends' current reads
  const fetchData = async () => {
    const uri = '/api/v1/profile/friends/ofFriends';
    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    const json = await res.json();

    if (json.status === 'success') {
      setProfile(json.data.profile);
    } else {
      setLoading(false);
    }
  };

  // fetch data on mount
  useEffect(() => {
    if (profile) {
      setLoading(false);
    } else {
      fetchData();
    }
  }, [profile]);

  useEffect(() => {
    if (!listView.list.length) {
      return;
    }
    const parsed = queryString.parse(location.search);
    let page = parseInt(parsed.page) || 1;
    page = page <= 0 ? 1 : page;
    const startIndex = (page - 1) * 50 || 0;
    const endIndex = page * 15 || 50;
    setListView({ ...listView, startIndex, endIndex });
  }, [location]);

  const getPaginationSettings = () => {
    const parsed = queryString.parse(location.search);
    let page = parseInt(parsed['page']) || 1;
    page = page <= 0 ? 1 : page;
    return {
      perPage: 50,
      total: profile.friendsOfFriends.length,
      page,
      useQueryParam: true,
      noLimit: true
    };
  };

  if (!loading && !profile) {
    return <Redirect to="/something-went-wrong" />;
  }

  return (
    <div className="FriendsOfFriends page-container">
      <div className="container">
        <main>
          <h1>
            <Link to="/user/friends" className="green-link">
              Friends
            </Link>{' '}
            > Friends of Friends
          </h1>
          <div className="content-container">
            <p className="header-text">
              The following are friends of your current friends on bookshelf. If
              you know someone on this page, you can click “add” next to their
              name to send a friend request.{' '}
            </p>
            {loading ? (
              <Loader />
            ) : !friends.length ? (
              <p>You don't have any friends!</p>
            ) : !profile.friendsOfFriends.length ? (
              <p>No friends of friends to add!</p>
            ) : (
              <div className="FriendsOfFriends__list">
                <div className="FriendsOfFriends__pagination">
                  <Pagination {...getPaginationSettings()} />
                </div>
                {profile.friendsOfFriends.map(fr => (
                  <FriendOfFriend key={fr.id} {...fr} />
                ))}
                <div className="FriendsOfFriends__pagination">
                  <Pagination {...getPaginationSettings()} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendsOfFriends;

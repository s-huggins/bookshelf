import React, { useState, useEffect } from 'react';
import {
  Link,
  withRouter,
  Redirect,
  useLocation,
  useHistory
} from 'react-router-dom';
import FriendsList from './FriendsList';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';
import Loader from '../../common/Loader';
import PrivateProfile from '../Profile/PrivateProfile';
import apostrophize from '../../../util/apostrophize';
import Pagination from '../../common/Pagination';
import queryString from 'query-string';
import sortFriends from '../../../util/sortFriends';
import usePrivateProfile from '../Profile/Hooks/usePrivateProfile';

const OtherFriends = () => {
  // const perPage = 50;
  const [loadingProfile, profile] = useLoadProfile();
  const profileIsPrivate = usePrivateProfile(profile);
  const location = useLocation();
  const history = useHistory();

  const [friendsView, setFriendsView] = useState({
    friends: [],
    startIndex: 0,
    endIndex: 50,
    sortCriterion: 'last-active'
  });

  useEffect(() => {
    if (profile && !profileIsPrivate) {
      const parsed = queryString.parse(location.search);
      const sortedFriends = runSort(profile.friends, parsed.sort); // runSort defaults to last-active

      setFriendsView({
        ...friendsView,
        friends: sortedFriends,
        sortCriterion: parsed.sort || 'last-active'
      });
    }
  }, [profile]);

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    let page = parseInt(parsed.page) || 1;
    page = page <= 0 ? 1 : page;
    const startIndex = (page - 1) * 50 || 0;
    const endIndex = page * 50 || 50;

    let sortedFriends = [];

    if (parsed.sort !== friendsView.sort) {
      // if sort condition changed
      sortedFriends = runSort([...friendsView.friends], parsed.sort);
    }

    setFriendsView({
      friends: sortedFriends,
      startIndex,
      endIndex,
      sortCriterion: parsed.sort
    });
  }, [location]);

  const handleSortChange = e => {
    const criterion = e.target.value;
    const baseURL = location.pathname;
    const parsed = queryString.parse(location.search);
    parsed.sort = criterion;

    const sortLink = Object.entries(parsed).reduce((link, [param, val], i) => {
      return i === 0 ? `${link}?${param}=${val}` : `${link}&${param}=${val}`;
    }, baseURL);

    history.push(sortLink);
  };

  const runSort = (friendList, sortCriterion) => {
    switch (sortCriterion) {
      case 'date-added':
        return sortFriends(friendList, sortFriends.DATE_ADDED);
      case 'display-name':
        return sortFriends(friendList, sortFriends.DISPLAY_NAME);
      case 'last-active':
      default:
        return sortFriends(friendList, sortFriends.LAST_ACTIVE);
    }
  };

  const getPaginationSettings = () => {
    const parsed = queryString.parse(location.search);
    let page = parseInt(parsed['page']) || 1;
    page = page <= 0 ? 1 : page;

    return {
      perPage: 50,
      total: friendsView.friends.length,
      page,
      useQueryParam: true,
      noLimit: true
    };
  };

  const printShowing = () => {
    const { friends, startIndex, endIndex } = friendsView;
    const total = friends.length;

    if (total === 0) return 'Showing 0 of 0';

    return `Showing ${startIndex + 1}-${Math.min(endIndex, total)} of ${total}`;
  };

  if (loadingProfile) {
    return <Loader />;
  }
  if (profile == null) return <Redirect to="/not-found" />;

  return profileIsPrivate ? (
    <PrivateProfile profile={profile} />
  ) : (
    <div className="OtherFriends Friends page-container">
      <div className="container">
        <main className="Friends__page">
          <div className="Friends__page-main">
            <div className="Friends__header Friends__header--other">
              <h1>
                {`${apostrophize(profile.displayName)} friends`}
                <span className="showing-detail">{printShowing()}</span>
              </h1>
              <Link
                to={location.pathname.substring(
                  0,
                  location.pathname.indexOf('/friends')
                )}
                className="green-link profile-link"
              >
                {`${apostrophize(profile.displayName)} profile`}
              </Link>
            </div>
            <div className="OtherFriends__list">
              <div className="list-header">
                <span>
                  <span className="text-faded sort-label">sort by</span>
                  <select name="sort" onChange={handleSortChange}>
                    <option value="last-active">last active</option>
                    <option value="display-name">display name</option>
                    <option value="date-added">date added</option>
                  </select>
                </span>
                <Pagination {...getPaginationSettings()} />
              </div>
              <FriendsList
                friends={friendsView.friends.slice(
                  friendsView.startIndex,
                  friendsView.endIndex
                )}
              />
              <div className="list-footer">
                <Pagination {...getPaginationSettings()} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withRouter(OtherFriends);

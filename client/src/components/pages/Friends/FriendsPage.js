import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import FriendsList from './FriendsList';
import FindFriendsPanel from './FindFriendsPanel';
import FriendsListHeader from './FriendsListHeader';
import { useEffect } from 'react';
import queryString from 'query-string';
import { useState } from 'react';
import FriendsSearch from './FriendsSearch';

const FriendsPage = ({ profile, setActiveNavLink }) => {
  const location = useLocation();
  const [filteredView, setFilteredView] = useState({
    sortedFriends: profile.friends, // cache sorted friends
    letterFriends: profile.friends, // letter filtering applied -> letterFriends
    listView: profile.friends, // final filtering applied
    startIndex: 0,
    endIndex: profile.friends.length - 1,
    sort: '',
    letter: ''
  });
  const [searchString, setSearchString] = useState('');

  const sortFriends = (friends, on) => {
    switch (on) {
      case 'date-added':
        return friends.sort(
          (f1, f2) => new Date(f2.dateAdded) - new Date(f1.dateAdded)
        );

      case 'display-name':
        return friends.sort((f1, f2) =>
          f1.profile.displayName.localeCompare(
            f2.profile.displayName,
            undefined,
            { numeric: true }
          )
        );

      case 'last-active':
      default:
        return friends.sort(
          (f1, f2) =>
            new Date(f2.profile.lastActive) - new Date(f1.profile.lastActive)
        );
    }
  };

  const filterFriends = (friends, l = 'all') => {
    if (!l || l === 'all') return friends;
    return friends.filter(fr => {
      const reg = new RegExp(`^${l}`, 'i');
      return reg.test(fr.profile.displayName);
    });
  };

  const searchFriends = (friends, filter) => {
    if (!filter) return friends;
    const reg = new RegExp(filter, 'i');
    return friends.filter(fr => reg.test(fr.profile.displayName));
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    let sortedList = filteredView.sortedFriends;
    let letterList = filteredView.letterFriends;
    let viewList = filteredView.listView;

    let startIndex = (parsed.page - 1) * 30 || 0;
    let endIndex = parsed.page * 30 || 30;

    if (parsed.sort !== filteredView.sort) {
      // sort condition changed
      // this also sorts by default on mount
      sortedList = sortFriends(filteredView.sortedFriends, parsed.sort);

      // preserve active letter filter.
      // RHS of OR condition filters on mount if letter qparam set
      letterList = filterFriends(
        sortedList,
        filteredView.letter || parsed.letter
      );
    } else if (parsed.letter !== filteredView.letter) {
      // if filtering letter changed
      if (!parsed.letter || parsed.letter === 'all')
        letterList = filteredView.sortedFriends;
      // filter removed, expand list to all
      else
        letterList = filterFriends(filteredView.sortedFriends, parsed.letter); // new letter filter applied
      // reset indices after filtering
      let startIndex = 0;
      let endIndex = 30;
    }

    viewList = searchFriends(letterList, searchString);

    setFilteredView({
      sortedFriends: sortedList,
      letterFriends: letterList,
      listView: viewList,
      letter: parsed.letter,
      sort: parsed.sort,
      startIndex,
      endIndex
    });
  }, [location, searchString]);

  const numFriendRequests = profile.friendRequests.filter(fReq => !fReq.ignored)
    .length;
  return (
    <div className="FriendsPage Friends__page">
      <div className="Friends__page-main">
        <FriendsSearch setSearchString={setSearchString} />
        <FriendsListHeader friendsView={filteredView} />
        <FriendsList
          friends={filteredView.listView.slice(
            filteredView.startIndex,
            filteredView.endIndex
          )}
        />
      </div>
      <div className="Friends__page-side sidebar">
        <div className="sidebar__panel link-list">
          <ul>
            {numFriendRequests > 0 && (
              <li>
                <Link to="/user/friends/requests" className="green-link">
                  Friend requests{' '}
                  <span className="notification-text">
                    ({numFriendRequests})
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link to="/user/friends/reading" className="green-link">
                Books my friends are reading
              </Link>
            </li>
          </ul>
        </div>
        <FindFriendsPanel setActiveNavLink={setActiveNavLink} />
      </div>
    </div>
  );
};

export default FriendsPage;

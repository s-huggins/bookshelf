import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FriendsList from './FriendsList';
import FindFriendsPanel from './FindFriendsPanel';
import FriendsListHeader from './FriendsListHeader';
import queryString from 'query-string';
import FriendsSearch from './FriendsSearch';
import sortFriends from '../../../util/sortFriends';

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

  useLayoutEffect(() => {
    const parsed = queryString.parse(location.search);
    let sortedList = filteredView.sortedFriends;
    let letterList = filteredView.letterFriends;
    let viewList = filteredView.listView;

    let startIndex = (parsed.page - 1) * 30 || 0;
    let endIndex = parsed.page * 30 || 30;

    if (parsed.sort !== filteredView.sort) {
      // sort condition changed
      // this also sorts by default on mount
      switch (parsed.sort) {
        case 'date-added':
          sortedList = sortFriends(
            filteredView.sortedFriends,
            sortFriends.DATE_ADDED
          );
          break;
        case 'display-name':
          sortedList = sortFriends(
            filteredView.sortedFriends,
            sortFriends.DISPLAY_NAME
          );
          break;
        case 'last-active':
        default:
          sortedList = sortFriends(
            filteredView.sortedFriends,
            sortFriends.LAST_ACTIVE
          );
          break;
      }
      // sortedList = sortFriends(filteredView.sortedFriends, parsed.sort);

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
      startIndex = 0;
      endIndex = 30;
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

  const numFriendRequests = profile.friendRequests.filter(
    fReq => fReq.kind === 'Received' && !fReq.ignored
  ).length;
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

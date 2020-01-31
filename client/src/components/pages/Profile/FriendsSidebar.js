import React, { useState } from 'react';
import FriendPanel from './FriendPanel';
import { Link, useLocation } from 'react-router-dom';
import apostrophize from '../../../util/apostrophize';
import { useLayoutEffect } from 'react';

const FriendsSidebar = ({ profile }) => {
  const location = useLocation();
  const [friendsPreview, setFriendsPreview] = useState([]);

  useLayoutEffect(() => {
    const selectedFriends = profile.friends
      .map(fr => {
        const rand = Math.random();
        return [fr, rand];
      })
      .sort(([fr1, rand1], [fr2, rand2]) => rand1 - rand2)
      .slice(-6)
      .map(([fr, rand]) => (
        <li key={fr.profileId}>
          <FriendPanel profileId={fr.profileId} {...fr.profile} />
        </li>
      ));

    setFriendsPreview(selectedFriends);
  }, []);

  return (
    <div className="sidebar FriendsSidebar">
      <h3 className="sidebar__header">
        <Link to={`${location.pathname}/friends`}>
          {`${apostrophize(
            profile.displayName
          )} friends (${profile.friends.length.toLocaleString('en')})`}
        </Link>
      </h3>
      <ul>{friendsPreview}</ul>

      <div className="sidebar__footer">
        {profile.friends.length > 6 ? (
          <span className="more-friends green-link">
            <Link to={`${location.pathname}/friends`}>More friends...</Link>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default FriendsSidebar;

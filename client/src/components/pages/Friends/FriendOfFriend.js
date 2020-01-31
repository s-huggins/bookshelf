import React from 'react';
import Avatar from '../Profile/Avatar';
import FriendButton from '../../common/FriendButton';
import { Link } from 'react-router-dom';
import pluralize from '../../../util/pluralize';

const FriendOfFriend = ({
  id,
  displayName,
  avatar_id,
  friendsWith,
  handle
}) => {
  const printMutuals = () => {
    // if(friendsWith.length <= 2) {
    //   friendsWith.reduce(fr => {

    //   }, '')
    // }
    if (friendsWith.length === 1) {
      return (
        <p>
          Friends with:{' '}
          <Link to={`/user/${friendsWith[0].id}`} className="green-link">
            {friendsWith[0].displayName}
          </Link>
        </p>
      );
    } else if (friendsWith.length === 2) {
      return (
        <p>
          Friends with:{' '}
          <Link to={`/user/${friendsWith[0].id}`} className="green-link">
            {friendsWith[0].displayName}
          </Link>{' '}
          and{' '}
          <Link to={`/user/${friendsWith[1].id}`} className="green-link">
            {friendsWith[1].displayName}
          </Link>
        </p>
      );
    } else {
      const randomTwo = [];
      const randIndex1 = Math.floor(Math.random() * friendsWith.length);
      randomTwo.push(friendsWith[randIndex1]);
      let randIndex2;
      do {
        randIndex2 = Math.floor(Math.random() * friendsWith.length);
      } while (randIndex2 === randIndex1);
      randomTwo.push(friendsWith[randIndex2]);

      return (
        <p>
          Friends with:{' '}
          <Link to={`/user/${randomTwo[0].id}`} className="green-link">
            {randomTwo[0].displayName}
          </Link>
          ,{' '}
          <Link to={`/user/${randomTwo[1].id}`} className="green-link">
            {randomTwo[1].displayName}
          </Link>{' '}
          and {friendsWith.length - 2}{' '}
          {pluralize('other', friendsWith.length - 2)}.
        </p>
      );
    }
  };

  return (
    <div className="FriendOfFriend">
      <Link to={`/user/${id}`}>
        <Avatar avatar_id={avatar_id} />
      </Link>
      <div className="details">
        <Link to={`/user/${id}`} className="green-link">
          {displayName}
        </Link>{' '}
        {handle && (
          <Link to={`/${handle}`} className="green-link">
            {'<' + handle + '>'}
          </Link>
        )}
        <div className="mutual-friends">{printMutuals()}</div>
        <div className="friend-button">
          <FriendButton profileId={id} displayName={displayName} />
        </div>
      </div>
    </div>
  );
};

export default FriendOfFriend;

import React, { useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Profile/Avatar';
import MessageAvatar from './MessageAvatar';
import pluralize from '../../../util/pluralize';

const MessageRecipients = ({ recipients, ownProfile, previewMax = 5 }) => {
  const [recipientsView, setRecipientsView] = useState({
    list: [],
    show: 0
  });
  useLayoutEffect(() => {
    let list = recipients;

    const indexSelf = recipients.findIndex(
      recip => recip.profileId === ownProfile.id
    );

    if (indexSelf !== -1) {
      // move own profile avatar to front of list
      list = [
        recipients[indexSelf],
        ...recipients.slice(0, indexSelf),
        ...recipients.slice(indexSelf + 1)
      ];
    }

    setRecipientsView({ list, show: Math.min(previewMax, recipients.length) });
  }, []);

  // const listRecipients = (count) => {
  //   return recipientsView.list
  // }

  const showMore = () => {
    setRecipientsView({
      ...recipientsView,
      show: Math.min(recipientsView.show + 50, recipientsView.list.length)
    });
  };
  const showFewer = () => {
    setRecipientsView({
      ...recipientsView,
      show: Math.max(recipientsView.show - 50, previewMax)
    });
  };

  const renderRecipients = () => {
    const { list, show } = recipientsView;

    if (list.length <= previewMax) {
      return list.map(recip => (
        <MessageAvatar
          key={recip.profileId}
          profileId={recip.profileId}
          profile={recip.profile}
          displayName={recip.displayName}
        />
      ));
    } else if (show < list.length) {
      return (
        <>
          {list.slice(0, show).map(recip => (
            <MessageAvatar
              key={recip.profileId}
              profileId={recip.profileId}
              profile={recip.profile}
              displayName={recip.displayName}
            />
          ))}
          <p>
            and{' '}
            {`${list.length - show} ${pluralize(
              'other',
              list.length - show
            )}...`}
          </p>
          <button
            className="button-reset green-link button-wind"
            onClick={showMore}
          >
            more
          </button>
          {show > previewMax && (
            <button
              className="button-reset green-link button-wind"
              onClick={showFewer}
            >
              fewer
            </button>
          )}
        </>
      );
    } else {
      return (
        <>
          {list.slice(0, list.length).map(recip => (
            <MessageAvatar
              key={recip.profileId}
              profileId={recip.profileId}
              profile={recip.profile}
              displayName={recip.displayName}
            />
          ))}
          <button
            className="button-reset green-link button-wind"
            onClick={showFewer}
          >
            fewer
          </button>
        </>
      );
    }
  };

  return (
    <>
      {/* {recipientsView.list.map(recip => (
        <MessageAvatar
          key={recip.profileId}
          profileId={recip.profileId}
          displayName={recip.displayName}
          profile={recip.profile}
        />
      ))} */}
      {renderRecipients()}
    </>
  );
};

export default MessageRecipients;

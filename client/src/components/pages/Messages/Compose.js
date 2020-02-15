import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Loader from '../../common/Loader';
import useLoadProfile from '../Profile/Hooks/useLoadProfile';
import SearchSpinner from '../../layout/Header/Search/SearchSpinner';
import debounce from 'debounce-async';
import { sendMessage } from '../../../redux/mail/mailActions';
import pluralize from '../../../util/pluralize';
import Alert from '../../../components/common/Alert';
import { useLayoutEffect } from 'react';

const searchFriends = (searchString, setSearching, friends) => {
  if (searchString.trim() === '') return Promise.resolve([]);
  setSearching(true);
  return new Promise((resolve, reject) => {
    const regEx = new RegExp(`^${searchString}`, 'i');
    const results = friends
      .filter(fr => regEx.test(fr.profile.displayName))
      .map(fr => ({
        displayName: fr.profile.displayName,
        profileId: fr.profileId
      }))
      .sort((fr1, fr2) =>
        fr1.displayName.localeCompare(fr2.displayName, undefined, {
          numeric: true
        })
      );
    resolve(results);
  });
};

const loadFriends = debounce(searchFriends, 400, {});

const Compose = () => {
  const [loadingProfile, profile] = useLoadProfile();
  const [searching, setSearching] = useState(false);
  const [friendsSelection, setFriendsSelection] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [to, setTo] = useState('');
  const [replying, setReplying] = useState(false);
  const friendsDropdown = useRef(null);
  // const subject = useRef(null);
  const [subject, setSubject] = useState('');
  const [error, setError] = useState(null);
  const [body, setBody] = useState('');
  const history = useHistory();

  useLayoutEffect(() => {
    if (history.location.state?.to) {
      setReplying(true);
      setSelectedFriends(history.location.state.to);
      setSubject(history.location.state.subject || '');
    }
  }, []);

  useEffect(() => {
    const closeFriendsSelection = e => {
      if (!e.target.dataset.recipientArea) {
        setFriendsSelection(null);
      }
    };

    if (friendsSelection) {
      document.addEventListener('click', closeFriendsSelection);
    }
    return () => document.removeEventListener('click', closeFriendsSelection);
  }, [friendsSelection]);

  const handleRecipientsChange = e => {
    setTo(e.target.value);
    setSearching(true);
    loadFriends(e.target.value, setSearching, profile.friends)
      .then(friends => {
        setSearching(false);
        if (friends.length) setFriendsSelection(friends);
        else setFriendsSelection(null);
      })
      .catch(() => {
        /* do nothing */
      });
  };

  const handleBodyChange = e => {
    if (e.target.value.length > 30000) return;
    setBody(e.target.value);
  };
  const handleSubjectChange = e => {
    if (e.target.value.length > 252) return;
    setSubject(e.target.value);
  };

  const selectFriend = ({ profileId, displayName }) => {
    setSelectedFriends(prevSt => [...prevSt, { profileId, displayName }]);
  };

  const removeRecipient = profileId => {
    setSelectedFriends(prevSt =>
      prevSt.filter(fr => fr.profileId !== profileId)
    );
  };

  const validateMessage = (msgRecipients, msgSubject, msgBody) => {
    if (!msgRecipients.length) {
      setError({
        type: 'recipients',
        message: 'Your message has no recipients.'
      });
      return false;
    }
    if (msgSubject.length > 252) {
      setError({
        type: 'subject',
        message: 'Message subject can be 252 characters maximum.'
      });
      return false;
    }
    if (!msgBody.length) {
      setError({ type: 'body', message: 'Your message requires a body.' });
      return false;
    }
    if (msgBody.length > 30000) {
      setError({
        type: 'body',
        message: 'Your message cannot exceed 30000 characters.'
      });
      return false;
    }

    return true;
  };

  const dispatchMessage = async (
    messageRecipients,
    messageSubject,
    messageBody
  ) => {
    const messageCode = await sendMessage(
      messageRecipients,
      messageSubject,
      messageBody
    );

    if (!messageCode) {
      setError('Message was not sent. Please check your inputs and try again.');
    } else {
      history.push(`/message/show/${messageCode}`);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const messageSubject = subject;
    const messageBody = body;
    const messageRecipients = selectedFriends.map(fr => fr.profileId);
    if (!validateMessage(messageRecipients, messageSubject, messageBody))
      return;

    dispatchMessage(messageRecipients, messageSubject, messageBody);
  };

  return (
    <div className="Compose">
      <h1>
        <Link to="/message" className="green-link">
          Messages
        </Link>{' '}
        > Compose New Message
      </h1>
      <div className="Compose__form">
        <div className="alert-box">
          {error && (
            <Alert
              type="warning"
              message={error.message}
              handleDismiss={() => setError(null)}
            />
          )}
        </div>
        {loadingProfile ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="Compose__form-input">
              <span className="Compose__label">from:</span>{' '}
              <Link to="/user" className="green-link">
                {profile.displayName}
              </Link>
            </div>
            <div className="Compose__form-input">
              <label htmlFor="message-to" className="Compose__label">
                to:
              </label>{' '}
              {replying && (
                <div className="reply-recipients-list">
                  {selectedFriends.map(fr => (
                    <span
                      key={fr.profileId}
                      className="green-link reply-recipient-link"
                    >
                      <Link to={`/user/${fr.profileId}`}>{fr.displayName}</Link>
                    </span>
                  ))}
                </div>
              )}
              {!replying && (
                <div className="search-container">
                  <input
                    type="text"
                    id="message-to"
                    name="to"
                    className={`form-control input-to${
                      error?.type === 'recipients' ? ' form-control--error' : ''
                    }`}
                    onChange={handleRecipientsChange}
                  />
                  {searching && <SearchSpinner />}
                  {friendsSelection && (
                    <div
                      className="friends-selection-box"
                      data-recipient-area
                      ref={friendsDropdown}
                    >
                      {friendsSelection
                        .filter(
                          fr =>
                            !selectedFriends.find(
                              selected => selected.profileId === fr.profileId
                            )
                        )
                        .map(fr => (
                          <div
                            key={fr.profileId}
                            className="friend-option"
                            data-recipient-area
                            onClick={() => selectFriend(fr)}
                          >
                            {fr.displayName}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              {!replying && selectedFriends.length > 0 && (
                <div className="recipients-list">
                  {selectedFriends.map(fr => (
                    <div key={fr.profileId} className="recipient">
                      {fr.displayName}
                      <span onClick={() => removeRecipient(fr.profileId)}>
                        {' '}
                        <i className="fas fa-times"></i>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="Compose__form-input">
              <label htmlFor="message-subject" className="Compose__label">
                subject:
              </label>{' '}
              <input
                type="text"
                id="message-subject"
                name="subject"
                className={`form-control input-subject${
                  error?.type === 'subject' ? ' form-control--error' : ''
                }`}
                value={subject}
                onChange={handleSubjectChange}
              />
            </div>
            <div className="Compose__form-input">
              <label
                htmlFor="message-body"
                className="Compose__label Compose__label--block"
              >
                message:
              </label>
              <textarea
                // className="form-control input-body"
                className={`form-control input-body${
                  error?.type === 'body' ? ' form-control--error' : ''
                }`}
                name="body"
                id="message-body"
                onChange={handleBodyChange}
                value={body}
              />
            </div>
            <div className="form-footer">
              <button className="btn btn--light" type="submit">
                Send
              </button>
              <span
                className={`char-count${
                  body.length >= 30000 ? ' red-text' : ''
                }`}
              >{`${30000 - body.length} ${pluralize(
                'character',
                30000 - body.length
              )} left`}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Compose;

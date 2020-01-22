import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFriend,
  cancelFriendRequest,
  acceptFriendRequest,
  sendFriendRequest
} from '../../redux/auth/authActions';
import Modal from './Modal';
import Backdrop from './Backdrop';
import apostrophize from '../../util/apostrophize';

const FriendButton = ({ profileId, displayName }) => {
  const dispatch = useDispatch();

  const friendRequests = useSelector(
    state => state.auth.user.profile.friendRequests
  );
  const friends = useSelector(state => state.auth.user.profile.friends);

  const [friendRequestStatus, setFriendRequestStatus] = useState('');
  const [friendButtonHovered, setFriendButtonHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fReq = friendRequests.find(req => req.profileId === profileId);
    if (fReq) setFriendRequestStatus(fReq.kind);
  }, []);

  const handleUnfriend = () => {
    // display action confirmation modal
    // if user confirms action, dispatch action to reducer
    // else close modal

    setModalOpen(true);
  };

  const handleConfirmUnfriend = () => {
    dispatch(removeFriend(profileId));
    setFriendRequestStatus('');
    setModalOpen(false);
  };
  const handleCancelUnfriend = () => {
    setModalOpen(false);
  };

  const handleFriendRequest = () => {
    if (friendRequestStatus === 'Sent') {
      // cancel request
      dispatch(cancelFriendRequest(profileId));
      setFriendRequestStatus('');
    } else if (friendRequestStatus === 'Received') {
      // accept request
      dispatch(acceptFriendRequest(profileId));
      setFriendRequestStatus('Accepted');
    } else {
      // send request
      dispatch(sendFriendRequest(profileId));
      setFriendRequestStatus('Sent');
    }
  };

  const renderFriendButton = () => {
    const isFriend = !!friends.find(fr => fr.profileId === profileId);
    if (isFriend) {
      return (
        <button
          className="btn btn--light btn--action btn--friend"
          onClick={handleUnfriend}
          onMouseOver={() => {
            setFriendButtonHovered(true);
          }}
          onMouseOut={() => {
            setFriendButtonHovered(false);
          }}
        >
          {friendButtonHovered ? (
            <span>Unfriend</span>
          ) : (
            <span>
              <i className="fas fa-check button-check"></i> Friends
            </span>
          )}
        </button>
      );
    }

    let btnText;
    if (friendRequestStatus === 'Sent') {
      btnText = 'Cancel friend request';
    } else if (friendRequestStatus === 'Received') {
      btnText = 'Accept friend request';
    } else if (friendRequestStatus === 'Accepted') {
      btnText = 'Accepting...';
    } else {
      btnText = 'Add friend';
    }

    return (
      <button
        className="btn btn--dark btn--action"
        onClick={handleFriendRequest}
      >
        {btnText}
      </button>
    );
  };

  return (
    <>
      {modalOpen && (
        <>
          <Backdrop />
          <Modal handleClose={() => setModalOpen(false)}>
            <div className="Unfriend-modal">
              <h2 className="Unfriend-modal__header">
                Unfriend {displayName}?
              </h2>
              <p className="Unfriend-modal__body">
                This will remove {apostrophize(displayName)} activity from your
                updates feed, and your own activity will stop appearing in their
                updates feed. {displayName} will not be notified.
              </p>
              <div className="Unfriend-modal__actions">
                <button
                  className="btn btn--dark"
                  onClick={handleConfirmUnfriend}
                >
                  Confirm
                </button>
                <button
                  className="btn btn--light"
                  onClick={handleCancelUnfriend}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
      {renderFriendButton()}
    </>
  );
};

export default FriendButton;

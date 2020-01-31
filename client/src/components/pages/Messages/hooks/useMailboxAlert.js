import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearEditStatus } from '../../../../redux/profile/profileActions';
import pluralize from '../../../../util/pluralize';

export default () => {
  const [alert, setAlert] = useState(null);
  const alertCache = useRef('');
  const editStatus = useSelector(state => state.profile.editStatus);
  const dispatch = useDispatch();

  const dismissAlert = () => setAlert(null);

  useEffect(() => {
    if (editStatus === 'success') {
      setAlert({ type: 'info', message: alertCache.current });
      dispatch(clearEditStatus());
    } else if (editStatus === 'fail') {
      setAlert({
        type: 'warning',
        message: 'Action failed. Please try again.'
      });
      dispatch(clearEditStatus());
    } else {
      alertCache.current = '';
    }
  }, [editStatus]);

  return [alertCache, alert, dismissAlert];
};

export const writeAlertText = (actionType, numMessages) => {
  const partialText = action =>
    `${action} ${numMessages.toLocaleString('en')} ${pluralize(
      'message',
      numMessages
    )}`;

  switch (actionType) {
    case writeAlertText.MOVE_TO_SAVED:
      return `${partialText('Moved')} to the saved folder.`;
    case writeAlertText.MOVE_TO_INBOX:
      return `${partialText('Moved')} to the inbox folder.`;
    case writeAlertText.SEND_TO_TRASH:
      return `${partialText('Sent')} to the trash.`;
    case writeAlertText.RECOVER_FROM_TRASH:
      return `${partialText('Recovered')} from the trash.`;
    case writeAlertText.MARK_READ:
      return `${partialText('Marked')} as read.`;
    case writeAlertText.MARK_UNREAD:
      return `${partialText('Marked')} as unread.`;
    case writeAlertText.DELETE:
      return `${partialText('Deleted')}.`;
  }
};

writeAlertText.MOVE_TO_SAVED = 'MOVE_TO_SAVED';
writeAlertText.MOVE_TO_INBOX = 'MOVE_TO_INBOX';
writeAlertText.SEND_TO_TRASH = 'SEND_TO_TRASH';
writeAlertText.RECOVER_FROM_TRASH = 'RECOVER_FROM_TRASH';
writeAlertText.MARK_READ = 'MARK_READ';
writeAlertText.MARK_UNREAD = 'MARK_UNREAD';
writeAlertText.DELETE = 'DELETE';

import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  fetchInboxPage,
  fetchSavedPage,
  fetchSentPage,
  fetchTrashPage
} from '../../../../redux/mail/mailActions';

/** FETCH TYPES */

const useLoadInbox = page => {
  const [loading, setLoading] = useState(true);
  const firstCycle = useRef(true);
  const dispatch = useDispatch();

  const inbox = useSelector(state => state.mail.inbox);
  // const mailbox = useSelector(state => state.mail.mailbox);
  const numTrashed = useSelector(state => state.mail.mailbox.numTrashed);
  const numSaved = useSelector(state => state.mail.mailbox.numSaved);
  const numUnread = useSelector(state => state.mail.mailbox.numUnread);

  useEffect(() => {
    if (!loading) setLoading(true);
    dispatch(fetchInboxPage(page));
  }, [page, numTrashed, numSaved, numUnread]);

  useEffect(() => {
    if (firstCycle.current) {
      firstCycle.current = false;
      return;
    }

    setLoading(false);
  }, [inbox]);

  return [loading, inbox];
};

export { useLoadInbox };

const Folder = {};
Folder.INBOX = 'INBOX';
Folder.SENT = 'SENT';
Folder.SAVED = 'SAVED';
Folder.TRASH = 'TRASH';
export { Folder as MailFolder };

const selectors = {
  [Folder.INBOX]: state => state.mail.inbox,
  [Folder.SENT]: state => state.mail.sent,
  [Folder.SAVED]: state => state.mail.saved,
  [Folder.TRASH]: state => state.mail.trash
};

const fetchers = {
  [Folder.INBOX]: fetchInboxPage,
  [Folder.SENT]: fetchSentPage,
  [Folder.SAVED]: fetchSavedPage,
  [Folder.TRASH]: fetchTrashPage
};

const useLoadMail = folder => {
  const [loading, setLoading] = useState(true);
  const firstCycle = useRef(true);
  const dispatch = useDispatch();
  const params = useParams();

  const getPage = () => {
    let pageNum = parseInt(params.pageNum, 10);
    if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;
    return pageNum;
  };

  const mail = useSelector(selectors[folder]);
  const numTrashed = useSelector(state => state.mail.mailbox.numTrashed);
  const numSaved = useSelector(state => state.mail.mailbox.numSaved);
  const numUnread = useSelector(state => state.mail.mailbox.numUnread);

  const page = getPage();

  useEffect(() => {
    if (!loading) setLoading(true);
    dispatch(fetchers[folder](page));
  }, [page, numTrashed, numSaved, numUnread]);

  useEffect(() => {
    if (firstCycle.current) {
      firstCycle.current = false;
      return;
    }

    setLoading(false);
  }, [mail]);

  return [loading, mail];
};

export default useLoadMail;

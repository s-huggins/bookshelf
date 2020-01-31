import React, { useState, useEffect } from 'react';
import MessagePreview from './MessagePreview';
import MessengerNav from './MessengerNav';
import { useDispatch } from 'react-redux';
import { getMailbox } from '../../../redux/profile/profileActions';
import { useLayoutEffect } from 'react';
import Loader from '../../common/Loader';
import Pagination from '../../common/Pagination';
import { useParams, Redirect } from 'react-router-dom';
import Alert from '../../common/Alert';

const Folder = ({
  title,
  messages,
  type,
  refresh,
  refreshLabel,
  checkMessage,
  checkedMessages,
  path,
  perPage = 20,
  alert,
  dismissAlert,
  children
}) => {
  const params = useParams();
  const [refreshing, setRefreshing] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const dispatch = useDispatch();

  /** HELPERS */

  const getPage = () => {
    let pageNum = parseInt(params.pageNum, 10);
    if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;
    return pageNum;
  };

  const getViewIndices = () => {
    const pageNum = getPage();
    const low = Math.max(0, (pageNum - 1) * perPage);
    const high = Math.min(messages.length, pageNum * perPage);
    return [low, high];
  };

  const getPaginationSettings = () => {
    const page = getPage();

    return {
      perPage,
      total: messages.length,
      page,
      baseLink: path,
      noLimit: true
    };
  };

  const printShowing = () => {
    if (!messages.length) return 'Showing 0-0 of 0';

    const [low, high] = getViewIndices();
    return `Showing ${low + 1}-${high} of ${messages.length}`;
  };

  const handleCheckAll = () => {
    const checked = !checkedAll;
    const [low, high] = getViewIndices();

    for (let i = low; i < high; i++) {
      checkMessage(messages[i].message._id, checked);
    }

    setCheckedAll(checked);
  };

  const refreshFolder = () => {
    setRefreshing(true);
    dispatch(getMailbox());
  };

  /** EFFECTS */

  useLayoutEffect(() => {
    setRefreshing(false);
  }, [messages]);

  useEffect(() => {
    if (!messages.length) {
      setCheckedAll(false);
      return;
    }

    const entirePageChecked = messages
      .slice(...getViewIndices())
      .every(msg => checkedMessages[msg.message._id]);

    setCheckedAll(entirePageChecked);
  }, [checkedMessages, messages]);

  /** REDIRECTS */

  if (params.pageNum) {
    let pageNum = Number(params.pageNum);
    const maxPage = Math.ceil(messages.length / perPage) || 1; // maxPage >= 1

    if (Number.isNaN(pageNum) || pageNum < 1)
      return <Redirect to={`${path}/page/1`} />;
    if (pageNum > maxPage) return <Redirect to={`${path}/page/${maxPage}`} />;

    if (!Number.isInteger(pageNum)) {
      pageNum = Math.floor(pageNum);

      if (pageNum < 1) return <Redirect to={`${path}/page/1`} />;
      if (pageNum > maxPage) return <Redirect to={`${path}/page/${maxPage}`} />;

      return <Redirect to={`${path}/page/${pageNum}`} />;
    }
  }

  /** RENDER */

  return (
    <main className="Messenger">
      <div
        className={`Messenger__header${
          refresh ? ' Messenger__header--with-aside' : ''
        }`}
      >
        <span className="Messenger__header-main">
          <h1>{title}</h1>
          <span className="showing-detail">{printShowing()}</span>
        </span>

        {refresh && (
          <span className="refresh-loader">
            {refreshing ? (
              <Loader />
            ) : (
              <button
                className="button-reset green-link refresh-inbox"
                onClick={refreshFolder}
              >
                {refreshLabel}
              </button>
            )}
          </span>
        )}
      </div>

      <div className="Messenger__body">
        <nav className="Messenger__body-nav">
          <MessengerNav />
        </nav>
        <div className="Messenger__body-main">
          <div className="alert-container">
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                // handleDismiss={() => setAlert(null)}
                handleDismiss={dismissAlert}
              />
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th className="cell-from">from</th>
                <th className="cell-subject">subject</th>
                <th className="cell-date">date</th>
                <th className="cell-actions header-actions">
                  {children}
                  <span className="select-all">
                    select all{' '}
                    <input
                      type="checkbox"
                      checked={checkedAll}
                      onChange={handleCheckAll}
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.length ? (
                messages
                  .slice(...getViewIndices())
                  .map(msg => (
                    <MessagePreview
                      read={msg.read}
                      key={msg._id}
                      subject={msg.message.subject}
                      from={msg.message.from}
                      messageId={msg.message._id}
                      dateSent={msg.message.dateSent}
                      checkMessage={checkMessage}
                      checked={checkedMessages[msg.message._id] ?? false}
                      folder={type}
                    />
                  ))
              ) : (
                <tr>
                  <td className="cell-no-messages" colSpan="4">
                    There are no messages in this folder.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="Messenger__pagination">
            <Pagination {...getPaginationSettings()} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Folder;

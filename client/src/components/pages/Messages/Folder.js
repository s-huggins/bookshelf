import React, { useState, useEffect } from 'react';
import MessagePreview from './MessagePreview';
import MessengerNav from './MessengerNav';
import { useLayoutEffect } from 'react';
import Loader from '../../common/Loader';
import Pagination from '../../common/Pagination';
import { useParams, Redirect } from 'react-router-dom';
import Alert from '../../common/Alert';
// import { fetchInboxPage } from '../../../redux/mail/mailActions';

const Folder = ({
  title,
  messages,
  totalMessages,
  loading,
  // refresh,
  // refreshLabel,
  // refreshFolder,
  checkMessages,
  uncheckMessages,
  checkedMessages,
  path,
  perPage = 20,
  alert,
  dismissAlert,
  children,
  mailDirection
}) => {
  const params = useParams();
  const [refreshing, setRefreshing] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  /** HELPERS */

  const getPage = () => {
    let pageNum = parseInt(params.pageNum, 10);
    if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;
    return pageNum;
  };

  // const getViewIndices = () => {
  //   const pageNum = getPage();
  //   const low = Math.max(0, (pageNum - 1) * perPage);
  //   const high = Math.min(messages.length, pageNum * perPage);
  //   return [low, high];
  // };

  const getPaginationSettings = () => {
    const page = getPage();

    return {
      perPage,
      total: totalMessages,
      page,
      baseLink: path,
      noLimit: true
    };
  };

  const printShowing = () => {
    if (totalMessages === 0) return 'Showing 0-0 of 0';

    // const [low, high] = getViewIndices();
    const pageNum = getPage();
    const low = (pageNum - 1) * perPage;
    const high = Math.min(totalMessages, pageNum * perPage);
    return `Showing ${low + 1}-${high} of ${totalMessages}`;
  };

  const handleCheckAll = () => {
    // const checked = !checkedAll;
    // // const [low, high] = getViewIndices();
    // const [low, high] = [0, 20];

    // for (let i = low; i < high; i++) {
    //   checkMessage(messages[i].message._id, checked);
    // }

    // setCheckedAll(checked);

    if (checkedAll) {
      uncheckMessages(...messages.map(msg => msg._id));
      setCheckedAll(false);
    } else {
      checkMessages(...messages.map(msg => msg._id));
      setCheckedAll(true);
    }
  };

  // const handleRefresh = () => {
  //   setRefreshing(true);
  //   refreshFolder();
  // };

  /** EFFECTS */

  useLayoutEffect(() => {
    setRefreshing(false);
  }, [messages]);

  useEffect(() => {
    if (!messages.length) {
      setCheckedAll(false);
      return;
    }

    const entirePageChecked = messages.every(msg => checkedMessages[msg._id]);

    setCheckedAll(entirePageChecked);
  }, [checkedMessages, messages]);

  /** REDIRECTS */

  if (params.pageNum) {
    let pageNum = Number(params.pageNum);
    const maxPage = Math.ceil(totalMessages / perPage) || 1; // maxPage >= 1

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
      {/* <div
        className={`Messenger__header${
          refresh ? ' Messenger__header--with-aside' : ''
        }`}
      > */}
      <div className="Messenger__header">
        <span className="Messenger__header-main">
          <h1>{title}</h1>
          <span className="showing-detail">{printShowing()}</span>
        </span>

        {/* {!loading && refresh && (
          <span className="refresh-loader">
            {refreshing ? (
              <Loader />
            ) : (
              <button
                className="button-reset green-link refresh-inbox"
                onClick={handleRefresh}
              >
                {refreshLabel}
              </button>
            )}
          </span>
        )} */}
      </div>

      {loading ? (
        <Loader />
      ) : (
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
                  messages.map(msg => (
                    <MessagePreview
                      seq={msg.seq}
                      read={msg.read}
                      key={msg._id}
                      subject={msg.subject}
                      from={msg.from}
                      messageId={msg._id}
                      dateSent={msg.dateCreated}
                      checkMessage={() => checkMessages(msg._id)}
                      uncheckMessage={() => uncheckMessages(msg._id)}
                      checked={checkedMessages[msg._id] ?? false}
                      folder={msg.folder}
                      messageDirection={mailDirection}
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
      )}
    </main>
  );
};

export default Folder;

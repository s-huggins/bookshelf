// import React, { useState, useEffect } from 'react';
// import Message from './Message';
// import MessageActions from './MessageActions';
// import Spool from './Spool';
// import Alert from '../../common/Alert';
// import Loader from '../../common/Loader';
// import useLoadMessage from './hooks/useLoadMessage';
// import useLoadSpool from './hooks/useLoadSpool';
// import { clearSpool } from '../../../redux/mail/mailActions';
// import { useDispatch } from 'react-redux';

// const MessageSpool = () => {
//   const dispatch = useDispatch();
//   const [alert, setAlert] = useState(null);

//   const [loadingMessage, message] = useLoadMessage();
//   const [loadingSpool, spool] = useLoadSpool(message?.spoolGroup?._id);

//   useEffect(() => {
//     // clear spool from redux store on unmount
//     return () => dispatch(clearSpool());
//   }, []);

//   return (
//     <div className="MessageSpool page-container">
//       <main>
//         <div className="MessageSpool__top">
//           {loadingMessage ? (
//             <Loader />
//           ) : (
//             <>
//               <div className="MessageSpool__spool-container">
//                 <div className="alert-container">
//                   {alert && (
//                     <Alert
//                       type={alert.type}
//                       message={alert.message}
//                       handleDismiss={() => setAlert(null)}
//                     />
//                   )}
//                 </div>
//                 <Message
//                   message={message}
//                   trash={message.trash}
//                   read={message.read}
//                   saved={message.saved}
//                 />
//               </div>

//               <MessageActions
//                 message={message}
//                 saved={message.saved}
//                 read={message.read}
//                 trash={message.trash}
//                 setAlert={setAlert}
//               />
//             </>
//           )}
//         </div>
//         {/* <div className="MessageSpool__spool-container">
//           {loadingMessage ? null : loadingSpool && !spool ? (
//             <Loader />
//           ) : !spool ? (
//             <Loader />
//           ) : (
//             <Spool
//               spool={spool}
//               totalMessages={message.spoolGroup.messagesTotal}
//             />
//           )}
//         </div> */}
//         <div className="MessageSpool__spool-container">
//           {loadingMessage ? null : !spool ? (
//             <Loader />
//           ) : (
//             <Spool
//               spool={spool}
//               totalMessages={message.spoolGroup.messagesTotal}
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MessageSpool;

import React, { useState, useEffect } from 'react';
import Message from './Message';
import MessageActions from './MessageActions';
import Spool from './Spool';
import Alert from '../../common/Alert';
import Loader from '../../common/Loader';
import useLoadMessage from './hooks/useLoadMessage';
import useLoadSpool from './hooks/useLoadSpool';
import { clearSpool } from '../../../redux/mail/mailActions';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

const MessageSpool = () => {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);

  const [loadingMessage, message] = useLoadMessage();
  const [loadingSpool, spool] = useLoadSpool(message?.spoolGroup?._id, page);

  const profileMap = useMemo(() => {
    if (!spool) return {};
    const map = {};
    spool.profiles.forEach(prof => {
      map[prof.profileId] = {
        archived: !!prof.profile,
        profileId: prof.profileId,
        displayName: prof?.profile?.displayName ?? prof.archived.displayName,
        avatar_id: prof?.profile?.avatar_id
      };
    });
    return map;
  }, [spool?.spoolGroup]);

  useEffect(() => {
    // clear spool from redux store on unmount
    return () => dispatch(clearSpool());
  }, []);

  return (
    <div className="MessageSpool page-container">
      <main>
        <div className="MessageSpool__top">
          {loadingMessage ? (
            <Loader />
          ) : (
            <>
              <div className="MessageSpool__spool-container">
                <div className="alert-container">
                  {alert && (
                    <Alert
                      type={alert.type}
                      message={alert.message}
                      handleDismiss={() => setAlert(null)}
                    />
                  )}
                </div>
                <Message
                  message={message}
                  trash={message.trash}
                  read={message.read}
                  saved={message.saved}
                />
              </div>

              <MessageActions
                message={message}
                saved={message.saved}
                read={message.read}
                trash={message.trash}
                setAlert={setAlert}
              />
            </>
          )}
        </div>
        <div className="MessageSpool__spool-container">
          {loadingMessage ? null : !spool ? (
            <Loader />
          ) : (
            <Spool
              page={page}
              setPage={setPage}
              spool={spool}
              // totalMessages={message.spoolGroup.messagesTotal}
              totalMessages={spool.groupData.messagesTotal}
              profileMap={profileMap}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default MessageSpool;

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useHistory } from 'react-router-dom';
// import { fetchSpoolPage } from '../../../../redux/mail/mailActions';
// import queryString from 'query-string';

// const useLoadSpool = spoolGroupId => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const history = useHistory();
//   const [loading, setLoading] = useState(true);
//   // const [spool, setSpool] = useState(null);
//   const spool = useSelector(state => state.mail.spool);

//   const getPage = () => {
//     let { page = 1 } = queryString.parse(location.search);
//     page = parseInt(page, 10);
//     if (Number.isNaN(page) || page <= 0) page = 1;
//     return page;
//   };

//   useEffect(() => {
//     setLoading(false);
//   }, [spool]);

//   useEffect(() => {
//     // each time spoolGroupId id changes, fetch for first 20 messages

//     if (spoolGroupId) {
//       setLoading(true);
//       dispatch(fetchSpoolPage(spoolGroupId, 1));
//       if (getPage() !== 1) history.push(`${location.pathname}?page=1`);
//     } else {
//       setLoading(true);
//     }
//   }, [spoolGroupId]);

//   useEffect(() => {
//     // skipped on first run
//     // fetches a page of spool messages if the page changes for the same spool group
//     if (spoolGroupId) {
//       setLoading(true);
//       dispatch(fetchSpoolPage(spoolGroupId, getPage()));
//     }
//   }, [getPage()]);

//   return [loading, spool];
// };

// export default useLoadSpool;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { fetchSpoolPage } from '../../../../redux/mail/mailActions';
import queryString from 'query-string';

const useLoadSpool = (spoolGroupId, page) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  // const [spool, setSpool] = useState(null);
  const spool = useSelector(state => state.mail.spool);

  const getPage = () => {
    let { page = 1 } = queryString.parse(location.search);
    page = parseInt(page, 10);
    if (Number.isNaN(page) || page <= 0) page = 1;
    return page;
  };

  useEffect(() => {
    setLoading(false);
  }, [spool]);

  useEffect(() => {
    // each time spoolGroupId id changes, fetch for first 20 messages

    if (spoolGroupId) {
      setLoading(true);
      dispatch(fetchSpoolPage(spoolGroupId, 1));
      // if (getPage() !== 1) history.push(`${location.pathname}?page=1`);
    } else {
      setLoading(true);
    }
  }, [spoolGroupId]);

  useEffect(() => {
    // skipped on first run
    // fetches a page of spool messages if the page changes for the same spool group
    if (spoolGroupId) {
      setLoading(true);
      dispatch(fetchSpoolPage(spoolGroupId, page));
    }
  }, [page]);

  return [loading, spool];
};

export default useLoadSpool;

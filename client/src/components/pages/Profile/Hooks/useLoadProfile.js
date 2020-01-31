// import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   getProfile,
//   getMailbox
// } from '../../../../redux/profile/profileActions';
// import { useParams, useLocation } from 'react-router-dom';

// const useLoadProfile = (
//   loadType = useLoadProfile.BASIC,
//   reloadWithoutPathChange = false
// ) => {
//   const [loading, setLoading] = useState(true);
//   const profile = useSelector(state => state.profile.loadedProfile);
//   const profileHasLoaded = useSelector(state => state.profile.profileHasLoaded);
//   const dispatch = useDispatch();
//   const firstRun = useRef(true);
//   const lastPathname = useRef('');
//   const params = useParams();
//   const location = useLocation();

//   // skip on mount
//   useEffect(() => {
//     if (firstRun.current) {
//       firstRun.current = false;
//     } else if (profileHasLoaded) {
//       setLoading(false);
//     }
//   }, [profileHasLoaded]);

//   useLayoutEffect(() => {
//     // if base url hasn't changed, exit early
//     if (!reloadWithoutPathChange && location.pathname === lastPathname.current)
//       return; // skip effect, only the query string changed

//     lastPathname.current = location.pathname; // update cached path
//     switch (loadType) {
//       case useLoadProfile.BASIC:
//         const profileId = params.id || params.handle || '';
//         dispatch(getProfile(profileId));
//         break;

//       case useLoadProfile.WITH_MAIL:
//         dispatch(getMailbox());
//         break;
//     }

//     setLoading(true);
//   }, [params]);

//   return [loading, profile];
// };

// export default useLoadProfile;

// useLoadProfile.BASIC = 'BASIC';
// useLoadProfile.WITH_MAIL = 'WITH_MAIL';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProfile,
  getMailbox
} from '../../../../redux/profile/profileActions';
import { useParams, useLocation } from 'react-router-dom';

/**
 * Note:- To pass in dependencies beyond location (via the ...deps rest arg), reloadWithoutPathChange must be true.
 *
 */
const useLoadProfile = (
  loadType = useLoadProfile.BASIC,
  reloadWithoutPathChange = false,
  ...deps
) => {
  const [loading, setLoading] = useState(true);
  const profile = useSelector(state => state.profile.loadedProfile);
  const profileHasLoaded = useSelector(state => state.profile.profileHasLoaded);
  const dispatch = useDispatch();
  const firstRun = useRef(true);
  const lastPathname = useRef('');
  const params = useParams();
  const location = useLocation();

  // skip on mount
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
    } else if (profileHasLoaded) {
      setLoading(false);
    }
  }, [profileHasLoaded]);

  useLayoutEffect(() => {
    // if base url hasn't changed, exit early
    if (!reloadWithoutPathChange && location.pathname === lastPathname.current)
      return; // skip effect, only the query string changed

    lastPathname.current = location.pathname; // update cached path
    switch (loadType) {
      case useLoadProfile.BASIC:
        const profileId = params.id || params.handle || '';
        dispatch(getProfile(profileId));
        break;

      case useLoadProfile.WITH_MAIL:
        dispatch(getMailbox());
        break;
    }

    setLoading(true);
  }, [params, ...deps]);

  return [loading, profile];
};

export default useLoadProfile;

useLoadProfile.BASIC = 'BASIC';
useLoadProfile.WITH_MAIL = 'WITH_MAIL';

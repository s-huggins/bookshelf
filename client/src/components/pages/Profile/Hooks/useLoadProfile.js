import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../../../redux/profile/profileActions';

const useLoadProfile = match => {
  const [loading, setLoading] = useState(true);
  const profile = useSelector(state => state.profile.loadedProfile);
  const profileHasLoaded = useSelector(state => state.profile.profileHasLoaded);
  const dispatch = useDispatch();
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
    } else if (profileHasLoaded) {
      setLoading(false);
    }
  }, [profileHasLoaded]);

  useLayoutEffect(() => {
    const profileId = match.params.id || match.params.handle || '';
    dispatch(getProfile(profileId));
    setLoading(true);
  }, [match]);

  return [loading, profile];
};
export default useLoadProfile;

// OLD CODE TO GO EVENTUALLY

/**
 * If there is already a previous profile in the redux store, first clear
 * it out to prepare for loading in a new profile.
 * Once clear, load in the requested profile using the hook param.
 *
 * There are two possible lifecycles for the inner useEffect hook:
 *
 * 1) If the store contains no prior profile, useEffect runs twice.
 *     Run 1 -> profileHasLoaded initially false, profileCleared initially true.
 *     Run 2 -> profileHasLoaded became true, profileCleared is true.
 *
 * 2) If the store still holds the last profile, useEffect will run three times.
 *     Run 1 ->  profileHasLoaded initially true, profileCleared initially false.
 *     Run 2 ->  profileHasLoaded became false, profileCleared is true.
 *     Run 3 ->  profileHasLoaded became true, profileCleared is true.
 *
 * @param {string} [profileId=''] - integer as a string, user handle, or empty.
 * @return {boolean} - loading status
 */
// const useLoadProfile = profileId => {
//   const [loadingProfile, setLoadingProfile] = useState(true);
//   const profileHasLoaded = useSelector(state => state.profile.profileHasLoaded);
//   const [profileCleared, setProfileCleared] = useState(!profileHasLoaded);
//   const dispatch = useDispatch();
//   console.log(loadingProfile);
//   useEffect(() => {
//     if (!profileCleared) {
//       dispatch(prepareGetProfile());
//       setProfileCleared(true);
//       return;
//     }
//     if (!profileHasLoaded) {
//       dispatch(getProfile(profileId)); // endpoint can distinguish each case
//       return;
//     }
//     setLoadingProfile(false);
//     setProfileCleared(false);
//   }, [profileHasLoaded, profileId]);

//   return loadingProfile;
// };

// const useLoadProfile = profileId => {
//   // const [loadingProfile, setLoadingProfile] = useState(true);
//   const loadingProfile = useRef(true);
//   console.log(loadingProfile);

//   const profileHasLoaded = useSelector(state => state.profile.profileHasLoaded);
//   const [profileCleared, setProfileCleared] = useState(!profileHasLoaded);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (!profileCleared) {
//       dispatch(prepareGetProfile());
//       setProfileCleared(true);
//       loadingProfile.current = true;
//       return;
//     }
//     if (!profileHasLoaded) {
//       dispatch(getProfile(profileId)); // endpoint can distinguish each case
//       loadingProfile.current = true;

//       return;
//     }
//     loadingProfile.current = false;
//     setProfileCleared(false);
//   }, [profileHasLoaded, profileId]);

//   return loadingProfile.current;
// };

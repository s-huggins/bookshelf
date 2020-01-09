import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  prepareGetProfile,
  getProfile
} from '../../../../redux/profile/profileActions';

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
const useLoadProfile = profileId => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const profileHasLoaded = useSelector(state => state.profile.profileHasLoaded);
  const [profileCleared, setProfileCleared] = useState(!profileHasLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileCleared) {
      dispatch(prepareGetProfile());
      setProfileCleared(true);
      return;
    }
    if (!profileHasLoaded) {
      dispatch(getProfile(profileId)); // endpoint can distinguish each case
      return;
    }
    setLoadingProfile(false);
    setProfileCleared(false);
  }, [profileHasLoaded, profileId]);

  return loadingProfile;
};

export default useLoadProfile;

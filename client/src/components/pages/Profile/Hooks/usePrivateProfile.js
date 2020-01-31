import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const usePrivateProfile = profile => {
  const { id: ownProfileId, friends: ownFriends } = useSelector(
    state => state.auth.user.profile
  );

  const profileIsPrivate = useMemo(() => {
    return (
      profile &&
      !profile.isPublic &&
      profile.id !== ownProfileId &&
      !ownFriends.some(fr => fr.profileId === profile.id)
    );
  }, [profile]);

  return profileIsPrivate;
};

export default usePrivateProfile;

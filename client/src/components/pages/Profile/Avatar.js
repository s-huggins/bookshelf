import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import avatar from '../../../img/avatar1.png';

const Avatar = ({ avatar_id }) => {
  const token = useSelector(state => state.auth.token);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fetchAvatar = async () => {
    if (!avatar_id) {
      return setAvatarUrl('');
    }
    const uri = `http://localhost:5000/api/v1/profile/avatar/${avatar_id}`;
    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (`${res.status}`[0] !== '2') {
      setAvatarUrl('');
    } else {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      setAvatarUrl(blobUrl);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [avatar_id]);

  return (
    <>
      {avatarUrl === null ? null : avatarUrl === '' ? (
        <img src={avatar} alt="avatar" />
      ) : (
        <img src={avatarUrl} alt="avatar" />
      )}
    </>
  );
};

export default Avatar;

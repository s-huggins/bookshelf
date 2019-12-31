import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { editProfile } from '../../../redux/profile/profileActions';
import { useDispatch } from 'react-redux';

const EditAccount = ({ profile, user, setLoadingEdit }) => {
  const [formState, setFormState] = useState({
    profilePrivacy: ''
  });
  // const [loadingEdit, setLoadingEdit] = useState(false);
  // const editStatus = useSelector(state => state.profile.editStatus);
  // const [alert, setAlert] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setFormState({
      profilePrivacy: profile.isPublic ? 'everyone' : 'friends'
    });
  }, []);

  const handleRadioChange = e => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormState({
      ...formState,
      [fieldName]: fieldValue
    });
  };

  const handleSubmit = e => {
    const isPublic = formState.profilePrivacy === 'everyone';
    setLoadingEdit(true);
    dispatch(editProfile({ isPublic }));
  };

  // if(loadingEdit) return <Loader />

  return (
    <div className="form-control--edit">
      <form
        className="form-control--edit__fields"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="form-control--edit__field field-email">
          <label>Email Address</label>
          <span>{user.email}</span>
          <Link className="green-link" to="/change-email">
            Change email address
          </Link>
        </div>

        <div className="form-control--edit__field field-password">
          <label>Password</label>
          <span>********</span>
          <Link className="green-link" to="/change-password">
            Change password
          </Link>
        </div>
        <h2 className="form-control--edit__header">Privacy</h2>
        <p className="form-control--edit__paragraph">
          You control who can see your profile. Your profile includes your
          information on the profile tab, your bookshelves, your friend list,
          and other bookshelf members’ comments on your profile. Your profile
          image thumbnail and your name will always be visible in some areas of
          the site, but you can hide your last name using the setting on the
          profile tab. Book reviews are always public and will appear on book
          pages throughout the site regardless of privacy setting.
        </p>
        <div className="form-control--edit__radio">
          <span className="lead lead-bold">Who Can View My Profile:</span>
          <label className="radio-label" htmlFor="profile-everyone">
            <input
              type="radio"
              name="profilePrivacy"
              value="everyone"
              id="profile-everyone"
              checked={formState.profilePrivacy === 'everyone'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Everyone</span>
          </label>
          <label className="radio-label" htmlFor="profile-friends">
            <input
              type="radio"
              name="profilePrivacy"
              value="friends"
              id="profile-friends"
              checked={formState.profilePrivacy === 'friends'}
              onChange={handleRadioChange}
            />
            <span className="label-text">Friends only</span>
          </label>
        </div>
        <button className="btn btn--light" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditAccount;

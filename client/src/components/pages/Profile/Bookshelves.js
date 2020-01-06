import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import BookshelfBook from './BookshelfBook';
import useLoadProfile from './Hooks/useLoadProfile';
import Loader from '../../common/Loader';
import PrivateProfile from './PrivateProfile';

const Bookshelves = ({ match, location }) => {
  const { user } = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile.loadedProfile);

  const ownBookshelves = match => {
    if (match.params.id) {
      // return match.params.id === `${user.profile.id}`;
      return +match.params.id === user.profile.id;
    } else if (match.params.handle) {
      return match.params.handle === user.profile.handle;
    } else {
      return true;
    }
  };

  /* PROFILE FETCH HOOK */
  const profileId = match.params.id || match.params.handle || '';
  const loadingProfile = useLoadProfile(profileId);

  useEffect(() => {
    /**
     *
     * params available on match prop
     *
     * query string on location.search, to be parsed by query-string
     */
  }, []);

  console.log(profile);

  if (loadingProfile) {
    return <Loader />;
  }

  if (profile == null) return <Redirect to="/not-found" />;

  // TODO: and if not a friend
  if (!profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }

  return (
    <div className="Bookshelves">
      <main>
        <div className="Bookshelves__header">
          <h1 className="Bookshelves__header-text">
            <Link className="green-link" to="#!">
              Stuart
            </Link>{' '}
            <span className="breadcrumb">&gt;</span>{' '}
            <Link className="green-link" to="#!">
              Books
            </Link>
          </h1>
        </div>

        <div className="Bookshelves__content">
          <nav className="Bookshelves__shelves-nav">
            <ul>
              <li className="list-header">Bookshelves</li>
              <li>
                <Link to="#!">All (904)</Link>
              </li>
              <li>
                <Link to="#!" className="green-link">
                  Read (338)
                </Link>
              </li>
              <li>
                <Link to="#!" className="green-link">
                  Currently Reading (7)
                </Link>
              </li>
              <li>
                <Link to="#!" className="green-link">
                  Want to Read (559)
                </Link>
              </li>
            </ul>
          </nav>
          <div className="Bookshelves__list">
            <div className="pagination-head">
              <span className="pagination">
                « previous 1 2 3 4 5 6 7 8 9 … 90 91 next »
              </span>
            </div>
            <table>
              <thead>
                <tr className="Bookshelves__list-header">
                  <th>cover</th>
                  <th>title</th>
                  <th>author</th>
                  <th>avg rating</th>
                  <th>rating</th>
                  <th>my rating</th>
                  <th>date shelved</th>
                </tr>
              </thead>
              <tbody>
                <BookshelfBook />
                <BookshelfBook />
              </tbody>
            </table>
            <div className="pagination-foot">
              <span className="pagination-settings">
                <span className="pagination-per-page">per page 20</span>
                <span className="pagination-sort">sort</span>
              </span>
              <span className="pagination">
                « previous 1 2 3 4 5 6 7 8 9 … 90 91 next »
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bookshelves;

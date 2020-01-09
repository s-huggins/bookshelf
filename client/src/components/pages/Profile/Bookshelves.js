import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import useLoadProfile from './Hooks/useLoadProfile';
import Loader from '../../common/Loader';
import PrivateProfile from './PrivateProfile';
import BookshelvesNav from './BookshelvesNav';
import Bookshelf from './Bookshelf';
import queryString from 'query-string';

const Bookshelves = ({ match, location }) => {
  const { user } = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile.loadedProfile);

  /* PROFILE FETCH HOOK */
  const profileId = match.params.id || match.params.handle || '';
  const loadingProfile = useLoadProfile(profileId);

  const [activeShelf, setActiveShelf] = useState('');

  useEffect(() => {
    const { shelf = '' } = queryString.parse(location.search);
    setActiveShelf(shelf);
  }, [location]);

  const buildBookshelfLink = shelf => {
    if (shelf) return `${location.pathname}?shelf=${shelf}`;
    else return `${location.pathname}`;
  };

  const countShelf = (books, shelf) =>
    books.filter(book => book.primaryShelf === shelf).length;

  const printShelf = () => {
    switch (activeShelf) {
      case 'read':
        return 'Read';
      case 'reading':
        return 'Reading';
      case 'to-read':
        return 'To Read';
    }
  };

  if (loadingProfile) {
    return <Loader />;
  }

  if (profile == null) return <Redirect to="/not-found" />;

  // TODO: and if not a friend
  if (!profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }

  // console.log(profile);
  const ownBookshelves = profile.user === user._id;

  // {`${location.pathname}?shelf=`}
  return (
    <div className="Bookshelves">
      <main>
        <div className="Bookshelves__header">
          <h1 className="Bookshelves__header-text">
            <Link
              className="green-link"
              to={location.pathname
                .split('/')
                .slice(0, -1)
                .join('/')}
            >
              Stuart
            </Link>
            <span className="breadcrumb"> &gt; </span>
            <Link className="green-link" to={buildBookshelfLink()}>
              Books
            </Link>
            {activeShelf && (
              <>
                <span className="breadcrumb"> &gt; </span>
                <Link
                  className="green-link"
                  to={buildBookshelfLink(activeShelf)}
                >
                  {printShelf()}
                </Link>
              </>
            )}
          </h1>
        </div>

        <div className="Bookshelves__content">
          <BookshelvesNav
            countShelf={countShelf}
            buildBookshelfLink={buildBookshelfLink}
            books={profile.books}
          />
          <Bookshelf
            books={profile.books}
            shelf={activeShelf}
            ownBookshelf={ownBookshelves}
          />
        </div>
      </main>
    </div>
  );
};

export default Bookshelves;

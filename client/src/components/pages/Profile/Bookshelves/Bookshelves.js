import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import useLoadProfile from '../Hooks/useLoadProfile';
import Loader from '../../../common/Loader';
import PrivateProfile from '../PrivateProfile';
import BookshelvesNav from './BookshelvesNav';
import Bookshelf from './Bookshelf';
import queryString from 'query-string';
import PaginationSettings from './PaginationSettings';
import Breadcrumb from './Breadcrumb';

const Bookshelves = ({ match, location }) => {
  const { user } = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile.loadedProfile);

  /* PROFILE FETCH HOOK */
  const profileId = match.params.id || match.params.handle || '';
  const loadingProfile = useLoadProfile(profileId);

  const [activeShelf, setActiveShelf] = useState({
    shelf: null,
    shelfBooks: []
  });

  useEffect(() => {
    // wait for profile to load
    // console.log('RUNNING PARENT');
    if (!profile) return;

    const { shelf = '' } = queryString.parse(location.search);

    // skip effect if shelf hasn't changed
    if (shelf === activeShelf.shelf) return;

    const shelfBooks =
      shelf && shelf !== 'all'
        ? profile.books.filter(book => book.primaryShelf === shelf)
        : [...profile.books];
    setActiveShelf({
      shelf,
      shelfBooks
    });
  }, [location, profile]);

  const buildBookshelfLink = shelf => {
    if (shelf) return `${location.pathname}?shelf=${shelf}`;
    else return `${location.pathname}`;
  };

  const countShelf = (books, shelf) =>
    books.filter(book => book.primaryShelf === shelf).length;

  if (loadingProfile) {
    return <Loader />;
  }

  if (profile == null) return <Redirect to="/not-found" />;

  // TODO: and if not a friend
  if (!profile.isPublic) {
    return <PrivateProfile profile={profile} />;
  }

  const ownBookshelves = profile.user === user._id;

  return (
    <div className="Bookshelves">
      <main>
        <Breadcrumb
          buildBookshelfLink={buildBookshelfLink}
          activeShelf={activeShelf}
        />

        <div className="Bookshelves__content">
          <BookshelvesNav
            countShelf={countShelf}
            buildBookshelfLink={buildBookshelfLink}
            books={profile.books}
          />
          <Bookshelf
            books={activeShelf.shelfBooks}
            shelf={activeShelf.shelf}
            ownBookshelf={ownBookshelves}
          >
            <PaginationSettings />
          </Bookshelf>
        </div>
      </main>
    </div>
  );
};

export default Bookshelves;

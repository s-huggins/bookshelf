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
import usePrivateProfile from '../Hooks/usePrivateProfile';

const Bookshelves = ({ location }) => {
  const { user } = useSelector(state => state.auth);
  const [loadingProfile, profile] = useLoadProfile();
  const profileIsPrivate = usePrivateProfile(profile);

  const [activeShelf, setActiveShelf] = useState({
    shelf: null,
    shelfBooks: []
  });

  useEffect(() => {
    if (loadingProfile || profileIsPrivate) return;
    const { shelf = '' } = queryString.parse(location.search);

    // skip effect if shelf hasn't changed
    if (shelf === activeShelf.shelf) return;

    let shelfBooks =
      shelf && shelf !== 'all'
        ? profile.books.filter(book => book.primaryShelf === shelf)
        : [...profile.books];

    shelfBooks = shelfBooks.map(book => {
      // add user rating
      // add own rating
      const extendedBook = { ...book };

      const userRating = profile.ratings.find(
        rating => rating.bookId === book.bookId._id
      );
      extendedBook.userRating = userRating ? userRating.rating : 0;

      const ownRating = user.profile.ratings.find(
        rating => rating.bookId === book.bookId._id
      );
      extendedBook.ownRating = ownRating ? ownRating.rating : 0;

      return extendedBook;
    });

    setActiveShelf({
      shelf,
      shelfBooks
    });
  }, [location, loadingProfile]);

  const buildBookshelfLink = shelf => {
    const baseURL = shelf
      ? `${location.pathname}?shelf=${shelf}`
      : location.pathname;

    const parsed = queryString.parse(location.search);
    delete parsed.shelf;
    delete parsed.page;
    const params = Object.entries(parsed).map(([qParam, qVal]) => [
      qParam.toLowerCase(),
      qVal
    ]);

    if (shelf) {
      const newURL = params.reduce((url, [qParam, qVal]) => {
        return `${url}&${qParam}=${qVal}`;
      }, baseURL);

      return newURL;
    } else if (params.length) {
      const newURL = params.reduce((url, [qParam, qVal], i) => {
        if (i === 0) return `${url}?${qParam}=${qVal}`;
        return `${url}&${qParam}=${qVal}`;
      }, baseURL);

      return newURL;
    }

    return baseURL;
  };

  const countShelf = (books, shelf) =>
    books.filter(book => book.primaryShelf === shelf).length;

  if (loadingProfile) return <Loader />;

  if (profile == null) return <Redirect to="/not-found" />;

  const ownBookshelves = profile.user === user._id;

  return profileIsPrivate ? (
    <PrivateProfile profile={profile} />
  ) : (
    <div className="Bookshelves page-container">
      <main>
        <Breadcrumb
          buildBookshelfLink={buildBookshelfLink}
          activeShelf={activeShelf}
          displayName={profile.displayName}
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
            <PaginationSettings ownBookshelf={ownBookshelves} />
          </Bookshelf>
        </div>
      </main>
    </div>
  );
};

export default Bookshelves;

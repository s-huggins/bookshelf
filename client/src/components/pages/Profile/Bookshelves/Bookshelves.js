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
  const ownProfile = useSelector(state => state.auth.user.profile);
  const profileIsPrivate = usePrivateProfile(profile);

  const [allBooks, setAllBooks] = useState(null);

  const updateBookShelfData = (bookId, shelf) => {
    let newBooks;
    if (shelf) {
      newBooks = allBooks.map(book => {
        if (book.bookId._id !== bookId) return book;

        return {
          ...book,
          primaryShelf: shelf
        };
      });
    } else {
      newBooks = allBooks.filter(book => book.bookId._id !== bookId);
    }

    setAllBooks(newBooks);
  };

  const updateBookRatingsData = (bookId, selectedRating) => {
    const newBooks = allBooks.map(book => {
      if (book.bookId._id !== bookId) return book;

      // otherwise found target book
      // const {average_rating, ratings_count} = book;
      const oldAverageRating = book.bookId.average_rating;
      const oldRatingsCount = book.bookId.ratings_count;
      const oldSumRatings = oldAverageRating * oldRatingsCount;
      // check if app user has rated this book
      let oldUserRating = ownProfile.ratings.find(
        _rating => _rating.bookId === bookId
      )?.rating; // does rating a book as 0 remove it from prof? check this

      // if book was not previously rated by user
      if (!oldUserRating) {
        const newSumRatings = oldSumRatings + selectedRating;
        const newRatingsCount = oldRatingsCount + 1;
        const newAverageRating = newSumRatings / newRatingsCount;

        return {
          ...book,
          bookId: {
            ...book.bookId,
            average_rating: newAverageRating,
            ratings_count: newRatingsCount
          }
        };
      } else {
        if (selectedRating !== 0) {
          // user amended their previous rating but did not remove rating
          const newSumRatings = oldSumRatings - oldUserRating + selectedRating;
          // ratings count hasn't changed
          const newAverageRating = newSumRatings / oldRatingsCount;
          return {
            ...book,
            bookId: { ...book.bookId, average_rating: newAverageRating }
          };
        } else {
          // user removed a rating
          const newSumRatings = oldSumRatings - oldUserRating;
          const newRatingsCount = oldRatingsCount - 1;
          const newAverageRating =
            newRatingsCount !== 0 ? newSumRatings / newRatingsCount : 0;

          return {
            ...book,
            bookId: {
              ...book.bookId,
              average_rating: newAverageRating,
              ratings_count: newRatingsCount
            }
          };
        }
      }
    });

    setAllBooks(newBooks);
  };

  const [activeShelf, setActiveShelf] = useState({
    shelf: null,
    shelfBooks: null
  });

  useEffect(() => {
    if (loadingProfile || profileIsPrivate) return;
    if (allBooks && allBooks.length) return; // already loaded in book
    setAllBooks(profile.books);
  }, [loadingProfile]);

  useEffect(() => {
    if (loadingProfile || profileIsPrivate) return;
    if (!allBooks) return;

    const { shelf = '' } = queryString.parse(location.search);
    // skip effect if shelf hasn't changed
    // if (shelf === activeShelf.shelf) return;

    let shelfBooks =
      shelf && shelf !== 'all'
        ? allBooks.filter(book => book.primaryShelf === shelf)
        : [...allBooks];

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
  }, [location, loadingProfile, allBooks]);

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

  if (loadingProfile || !activeShelf.shelfBooks) return <Loader />;

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
            books={allBooks}
          />
          <Bookshelf
            books={activeShelf.shelfBooks}
            shelf={activeShelf.shelf}
            ownBookshelf={ownBookshelves}
            rateBook={updateBookRatingsData}
            editShelf={updateBookShelfData}
            // rateBook={null}
          >
            <PaginationSettings ownBookshelf={ownBookshelves} />
          </Bookshelf>
        </div>
      </main>
    </div>
  );
};

export default Bookshelves;

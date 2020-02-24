import React from 'react';
import ProfilePanelsContext from './ProfilePanelsContext';
import { useState } from 'react';
import BookshelvesPanel from './BookshelvesPanel';
import CurrentlyReadingPanel from './CurrentlyReadingPanel';

const ProfilePanels = ({ profile, ownProfile, buildBookshelfLink }) => {
  const [books, setBooks] = useState(profile.books);

  const countShelf = (books, shelf) =>
    books.filter(book => book.primaryShelf === shelf).length;
  // console.log(books);
  const shelfWasChanged = (bookId, newShelf) => {
    let updatedBooks;
    if (newShelf) {
      updatedBooks = books.map(book => {
        if (book.bookId._id !== bookId) return book;

        return { ...book, primaryShelf: newShelf };
      });
    } else {
      updatedBooks = books.filter(book => book.bookId._id !== bookId);
    }

    setBooks(updatedBooks);
  };

  const contextValue = ownProfile
    ? { ownProfile: true, editShelf: shelfWasChanged }
    : { ownProfile: false, editShelf: null };

  // return ownProfile ? (
  return (
    <ProfilePanelsContext.Provider value={contextValue}>
      <BookshelvesPanel
        books={books}
        displayName={profile.displayName}
        ownProfile
        buildBookshelfLink={buildBookshelfLink}
        countShelf={countShelf}
      />

      <CurrentlyReadingPanel
        books={books.filter(book => book.primaryShelf === 'reading')}
        displayName={profile.displayName}
        ownProfile
        buildBookshelfLink={buildBookshelfLink}
        bookCount={countShelf(books, 'reading')}
      />
    </ProfilePanelsContext.Provider>
  );
  // ) : (
  //   <>
  //     <BookshelvesPanel
  //       books={books}
  //       displayName={profile.displayName}
  //       ownProfile={false}
  //       buildBookshelfLink={buildBookshelfLink}
  //       countShelf={countShelf}
  //     />

  //     <CurrentlyReadingPanel
  //       books={books.filter(book => book.primaryShelf === 'reading')}
  //       displayName={profile.displayName}
  //       ownProfile={false}
  //       buildBookshelfLink={buildBookshelfLink}
  //       bookCount={countShelf(books, 'reading')}
  //     />
  //   </>
  // );
};

export default ProfilePanels;

{
  /*
<RecentUpdatesPanel
  books={profile.books}
  displayName={profile.displayName}
  ownProfile={profile.id === ownProfileId}
  buildBookshelfLink={buildBookshelfLink}
/>
*/
}

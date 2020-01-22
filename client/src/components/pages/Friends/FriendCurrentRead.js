// import React from 'react';
// import { Link } from 'react-router-dom';
// import InlineRating from '../../common/InlineRating';
// import BookshelfDropdownButton from '../Profile/Bookshelves/BookshelfDropdownButton';
// import cover from '../../../img/gulag.jpg';

// import moment from 'moment';
// import MiniRating from '../../common/MiniRating';
// import pluralize from '../../../util/pluralize';

// const CurrentRead = ({
//   friendId,
//   friendName,
//   bookId: book,
//   updateRatingDisplay
// }) => {
//   return (
//     <div className="FriendCurrentRead">
//       <div className="book-panel book-panel--current-read">
//         <div className="book-panel__cover">
//           <Link to={`/book/${book._id}`}>
//             <img src={book.image_url} alt="bookcover" />
//           </Link>
//         </div>
//         <div className="book-panel__details book-panel__details--current-read">
//           <h3 className="book-panel__title">
//             <Link to={`/book/${book._id}`}>{book.title}</Link>
//           </h3>
//           <span>
//             by{' '}
//             <Link
//               to={`/author/${book.authors[0]?.name}` || 'Unknown'}
//               className="author-name"
//             >
//               author name here
//             </Link>
//           </span>

//           <span>
//             <span className="minirating">
//               <MiniRating average={book.average_rating} />
//             </span>
//             <span className="text-tiny">
//               {book.average_rating.toFixed(2)} avg rating —{' '}
//               {`${book.ratings_count} ${pluralize(
//                 'rating',
//                 book.ratings_count
//               )}`}
//             </span>
//           </span>
//           <span className="book-panel__details-footer">
//             <span>
//               <Link to={`/user/${friendId}`} className="green-link bold-link">
//                 {friendName}
//               </Link>{' '}
//               is currently reading it
//             </span>
//           </span>
//         </div>
//         <div className="book-panel__actions">
//           <BookshelfDropdownButton
//             _id={book._id}
//             title={book.title}
//             authors={book.authors}
//             image_url={book.image_url}
//           />
//           <span className="rate-text text-tiny">Rate this book</span>
//           <div>
//             <InlineRating
//               _id={book._id}
//               title={book.title}
//               authors={book.authors}
//               image_url={book.image_url}
//               updateDisplay={updateRatingDisplay}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrentRead;

import React from 'react';
import { Link } from 'react-router-dom';
import InlineRating from '../../common/InlineRating';
import BookshelfDropdownButton from '../Profile/Bookshelves/BookshelfDropdownButton';
import cover from '../../../img/gulag.jpg';

import moment from 'moment';
import MiniRating from '../../common/MiniRating';
import pluralize from '../../../util/pluralize';

const CurrentRead = ({
  friendId,
  friendName,
  // bookId: book,
  _id,
  title,
  authors,
  image_url,
  average_rating,
  ratings_count,
  averageRating,
  ratingsCount,
  updateRatingDisplay
}) => {
  return (
    <div className="FriendCurrentRead">
      <div className="book-panel book-panel--current-read">
        <div className="book-panel__cover">
          <Link to={`/book/${_id}`}>
            <img src={image_url} alt="bookcover" />
          </Link>
        </div>
        <div className="book-panel__details book-panel__details--current-read">
          <h3 className="book-panel__title">
            <Link to={`/book/${_id}`}>{title}</Link>
          </h3>
          <span>
            by{' '}
            <Link to={`/author/${authors[0].authorId}`} className="author-name">
              {`${authors[0]?.name}` || 'Unknown'}
            </Link>
          </span>

          <span>
            <span className="minirating">
              <MiniRating average={averageRating} />
            </span>
            <span className="text-tiny">
              {averageRating.toFixed(2)} avg rating —{' '}
              {`${ratingsCount} ${pluralize('rating', ratingsCount)}`}
            </span>
          </span>
          <span className="book-panel__details-footer">
            <span>
              <Link to={`/user/${friendId}`} className="green-link bold-link">
                {friendName}
              </Link>{' '}
              is currently reading it
            </span>
          </span>
        </div>
        <div className="book-panel__actions">
          <BookshelfDropdownButton
            _id={_id}
            title={title}
            authors={authors}
            image_url={image_url}
          />
          <span className="rate-text text-tiny">Rate this book</span>
          <div>
            <InlineRating
              _id={_id}
              title={title}
              authors={authors}
              image_url={image_url}
              updateDisplay={updateRatingDisplay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentRead;

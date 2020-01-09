import store from '../../redux/store';
import {
  FETCH_BOOK_SUCCESS,
  FETCH_BOOK_FAILURE,
  CLEAR_FETCH_STATUS,
  UPDATE_RATINGS
} from './bookTypes';

export const clearFetchStatus = () => ({ type: CLEAR_FETCH_STATUS });

export const fetchBook = bookId => async dispatch => {
  let uri = `http://localhost:5000/api/v1/book/${bookId}`;
  const token = store.getState().auth.token;

  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (json.status === 'success') {
    dispatch({
      type: FETCH_BOOK_SUCCESS,
      payload: json.data
    });
  } else {
    dispatch({
      type: FETCH_BOOK_FAILURE,
      payload: json.status
    });
  }
};

/** For updating the rating of a loaded book, from the book's profile page */
export const updateRating = (
  oldUserRating,
  newUserRating,
  average_rating,
  ratings_count
) => {
  // const { average_rating, ratings_count } = store.getState().book.book;
  const sumRatings = average_rating * ratings_count;

  // if book was not previously rated by user
  if (!oldUserRating) {
    const newSumRatings = sumRatings + newUserRating;
    const new_ratings_count = ratings_count + 1;
    const new_average_rating = newSumRatings / new_ratings_count;

    return {
      type: UPDATE_RATINGS,
      payload: {
        average_rating: new_average_rating,
        ratings_count: new_ratings_count
      }
    };
  }

  // if here, the user changed an existing rating

  // if user changed their rating's star count without unrating
  if (newUserRating) {
    const newSumRatings = sumRatings - oldUserRating + newUserRating;
    const new_average_rating = newSumRatings / ratings_count;

    return {
      type: UPDATE_RATINGS,
      payload: {
        average_rating: new_average_rating,
        ratings_count
      }
    };
  }

  // else the user removed their rating
  const newSumRatings = sumRatings - oldUserRating;
  const new_ratings_count = ratings_count - 1;
  const new_average_rating =
    new_ratings_count !== 0 ? newSumRatings / new_ratings_count : 0;
  return {
    type: UPDATE_RATINGS,
    payload: {
      average_rating: new_average_rating,
      ratings_count: new_ratings_count
    }
  };
};

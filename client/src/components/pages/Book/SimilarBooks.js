import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const SimilarBooks = ({ books }) => {
  const settings = {
    // dots: true,
    infinite: true,
    draggable: false,
    speed: 350,
    slidesToShow: 2,
    slidesToScroll: 2,
    centerMode: true,
    centerPadding: '35px',
    arrows: true
  };

  return (
    <div className="SimilarBooks">
      <Slider {...settings}>
        {books.map(book => (
          <div key={book.id}>
            <Link to={`/book/${book.id}`}>
              <img
                src={book.image_url.replace(/SX98/, 'SZ98')}
                alt={book.title}
                title={book.title}
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SimilarBooks;

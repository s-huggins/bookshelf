import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* Extracts the first line of text before a linebreak */
function firstLine(el) {
  const cache = el.innerHTML;
  let text = el.innerHTML;
  el.innerHTML = 'a';
  const initial = el.offsetHeight;
  el.innerHTML = cache;
  const arr = text.split(' ');
  for (let i = 0; i < arr.length; i++) {
    text = text.substring(0, text.lastIndexOf(' '));
    if (el.offsetHeight == initial) {
      const temp = el.innerHTML;
      el.innerHTML = cache;
      return temp;
    }
    el.innerHTML = text;
  }
}

const ResultPreview = ({
  work,
  inFocus,
  setPreviewInFocus,
  blurInput,
  previewNum,
  setSearchQuery
}) => {
  const title = useRef();

  useLayoutEffect(() => {
    const styles = window.getComputedStyle(title.current);
    const height = parseFloat(styles.getPropertyValue('height'));
    const fontSize = parseFloat(styles.getPropertyValue('font-size'));

    if (height >= 2 * fontSize) {
      title.current.textContent = firstLine(title.current).split(0, -3) + '...';
    }
  });

  return (
    <Link
      className="searchPreviewLink"
      to={`/book/${work.id}`}
      onMouseMove={() => setPreviewInFocus(previewNum)}
      onClick={() => {
        blurInput();
        setSearchQuery('');
      }}
    >
      <div className={`ResultPreview${inFocus ? ' inFocus' : ''}`}>
        <div className="work-image">
          <img src={work.small_image_url} alt="bookcover" />
        </div>
        <div className="work-details">
          <h6 className="work-title" ref={title}>
            {work.title}
          </h6>
          <span className="work-by">
            by <span className="work-author">{work.author.name}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ResultPreview;

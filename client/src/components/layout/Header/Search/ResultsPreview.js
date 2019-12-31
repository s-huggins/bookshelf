import React from 'react';
import ResultPreview from './ResultPreview';
import { Link } from 'react-router-dom';

const ResultsPreview = ({
  works,
  searchString,
  previewInFocus,
  setPreviewInFocus,
  blurInput,
  setSearchQuery
}) => {
  return (
    <div className="ResultsPreview">
      <div>
        {works.map((work, i) => (
          <ResultPreview
            work={work}
            key={work.id}
            previewNum={i + 1}
            inFocus={i + 1 === previewInFocus}
            setPreviewInFocus={setPreviewInFocus}
            blurInput={blurInput}
            setSearchQuery={setSearchQuery}
          />
        ))}
      </div>
      <Link
        to={`/search?q=${searchString}&page=1`}
        className="see-all searchPreviewLink"
        onClick={() => blurInput()}
      >
        <span className="green-link">See all results</span>
      </Link>
    </div>
  );
};

export default ResultsPreview;

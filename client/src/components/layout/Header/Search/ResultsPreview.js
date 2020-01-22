import React from 'react';
import ResultPreview from './ResultPreview';
import { Link } from 'react-router-dom';

const ResultsPreview = ({
  works,
  previewInFocus,
  setPreviewInFocus,
  setSearchQuery,
  searchQuery
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
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
        ))}
      </div>
      <Link
        to={`/search?q=${searchQuery.cached}&page=1`}
        onClick={() => setSearchQuery({ ...searchQuery, active: '' })}
        className="see-all searchPreviewLink"
      >
        <span className="green-link">See all results</span>
      </Link>
    </div>
  );
};

export default ResultsPreview;

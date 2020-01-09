import React from 'react';
import { Link } from 'react-router-dom';
import apostrophize from '../../../util/apostrophize';
import WantRead from './WantRead';

const RecentUpdatesPanel = ({
  displayName,
  ownProfile,
  books,
  buildBookshelfLink
}) => {
  return (
    <div className="panel">
      <div className="panel__header">
        <h2 className="panel__header-text">
          {ownProfile
            ? 'My recent updates'
            : `${apostrophize(displayName)} recent updates`}
        </h2>
      </div>
      <div className="panel__body">
        <WantRead />
      </div>

      <div className="panel__footer">
        <Link to={buildBookshelfLink()} className="see-all-books green-link">
          {ownProfile
            ? 'More of my books...'
            : `More of ${apostrophize(displayName)} books...`}
        </Link>
      </div>
    </div>
  );
};

export default RecentUpdatesPanel;

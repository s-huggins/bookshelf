import React from 'react';
import moment from 'moment';

const AuthorDetails = ({ author = {} }) => {
  const formatDates = (birth, death) => {
    let formattedBirth, formattedDeath;

    if (birth) {
      formattedBirth = birth.replace(/\//g, '-');
      const momentBirth = moment(formattedBirth);
      formattedBirth = momentBirth.isValid()
        ? momentBirth.format('MMMM Do, YYYY')
        : null;
    }
    if (death) {
      formattedDeath = death.replace(/\//g, '-');
      const momentDeath = moment(formattedDeath);
      formattedDeath = momentDeath.isValid()
        ? momentDeath.format('MMMM Do, YYYY')
        : null;
    }

    return [formattedBirth, formattedDeath];
  };

  const buildBornDetail = (birthDate, hometown) => {
    let bornDetail;

    if (hometown && birthDate) {
      bornDetail = (
        <span>
          {hometown}
          <br />
          <span className="born-date">
            {moment('0070-10-23').format('MMMM Do, YYYY')}
          </span>
        </span>
      );
    } else if (hometown && !birthDate) {
      bornDetail = <span>{hometown}</span>;
    } else if (birthDate && !hometown) {
      bornDetail = <span>{birthDate}</span>;
    }

    return bornDetail ? (
      <li>
        <span className="text-bold">Born</span> {bornDetail}
      </li>
    ) : null;
  };

  const buildDiedDetail = deathDate => {
    return deathDate ? (
      <li>
        <span className="text-bold">Died</span> {deathDate}
      </li>
    ) : null;
  };

  const buildDateDetails = author => {
    const [born, died] = formatDates(author.born_at, author.died_at);
    const bornDetail = buildBornDetail(born, author.hometown);
    const diedDetail = buildDiedDetail(died);

    return [bornDetail, diedDetail];
  };

  const [bornDetail, diedDetail] = buildDateDetails(author);

  return (
    <ul className="profile__details profile__details--author">
      {bornDetail}
      {diedDetail}

      {author.influences && (
        <li>
          <span className="text-bold">Influences</span>{' '}
          <span
            className="author-influences"
            dangerouslySetInnerHTML={{ __html: author.influences }}
          ></span>
        </li>
      )}
    </ul>
  );
};

export default AuthorDetails;

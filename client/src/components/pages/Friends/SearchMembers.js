import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SearchMembers = () => {
  const [userInput, setUserInput] = useState('');
  const history = useHistory();

  const handleSearch = e => {
    e.preventDefault();
    history.push(`/user/friends/find?search=${userInput}`);
  };

  return (
    <form className="search-members" onSubmit={handleSearch}>
      <input
        type="text"
        className="form-control"
        placeholder="Find by name or handle"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
      />
      <button className="btn btn--light">Search members</button>
    </form>
  );
};

export default SearchMembers;

import React from 'react';

const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <div className="sort-options">
      <label htmlFor="sort">정렬 기준: </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="name">이름 순</option>
        <option value="id">ID 순</option>
        <option value="birthdate">생년월일 순</option>
      </select>
    </div>
  );
};

export default SortOptions;

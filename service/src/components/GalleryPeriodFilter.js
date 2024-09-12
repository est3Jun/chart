import React from 'react';

const GalleryPeriodFilter = ({ setGalleryPeriod }) => {
  return (
    <div className="gallery-period-filter">
      <label>기간</label>
      <select onChange={(e) => setGalleryPeriod(e.target.value)}>
        <option value="all">전체</option>
        <option value="1week">1주</option>
        <option value="1month">1개월</option>
        <option value="3months">3개월</option>
        <option value="6months">6개월</option>
      </select>
    </div>
  );
};

export default GalleryPeriodFilter;

import React from 'react';

const Gallery = ({ images }) => {
  return (
    <div className="gallery">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img src={image.url} alt={`gallery-${index}`} />
            <p>{image.date}</p> {/* 이미지의 날짜 표시 */}
          </div>
        ))
      ) : (
        <p>해당 기간에 이미지가 없습니다.</p>
      )}
    </div>
  );
};

export default Gallery;

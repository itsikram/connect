import React from 'react';

const ImageSkleton = ({ count = 1 }) => {
  return Array(count).fill(0).map((_, index) => (
    <div key={index} className="skeleton-card no-border">
      {/* Main Content */}
      <div className="skeleton-main" />

    </div>
  ));

};
export default ImageSkleton;

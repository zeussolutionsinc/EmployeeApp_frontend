import React from 'react';

const ImageCellRenderer = (props) => {
  const { value, context } = props;
  const { sasToken } = context;

  if (!value) return null;

  const imageUrl = `${value}?${sasToken}`;

  return <img src={imageUrl} alt="Vacation Image" style={{ width: '100%', height: 'auto' }} />;
};

export default ImageCellRenderer;

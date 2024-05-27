import React from "react";
import loadergif from '../Circles-loader.gif'

export const PageLoader = () => {
  const loadingImg = {loadergif};

  return (
    <div className="loader">
      <img src={loadingImg} alt="Loading..." />
    </div>
  );
};
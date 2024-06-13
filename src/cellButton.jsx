import React from "react";

const ButtonCellRenderer = (props) => {
  const handleClick = () => {
    alert(`Button clicked in row with data: ${JSON.stringify(props.data)}`);
  };

  return <button onClick={handleClick}>Action</button>;
};

export default ButtonCellRenderer;

import React from 'react';

interface IncDec extends React.HTMLProps<HTMLDivElement> {
  labelContent: string | JSX.Element;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  value: string;
}

export const IncDec: React.FC<IncDec> = ({
  labelContent,
  disableDecrement = false,
  disableIncrement = false,
  onDecrement,
  onIncrement,
  name,
  value,
  ...otherProps
}) => {
  return (
    <div>
      <label>{labelContent}</label>
      <button disabled={disableDecrement} onClick={onDecrement} type="button">
        -
      </button>
      {value}
      <button disabled={disableIncrement} onClick={onIncrement} type="button">
        +
      </button>
    </div>
  );
};

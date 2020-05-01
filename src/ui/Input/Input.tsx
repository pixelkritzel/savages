import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  labelContent: string | JSX.Element;

  onValueChange: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  labelContent,
  onValueChange,
  name,
  value,
  ...otherProps
}) => {
  const { current: id } = useRef(uuidv4());
  return (
    <div>
      <label htmlFor={`${name}-${id}`}>{labelContent}</label>
      <input
        id={`${name}-${id}`}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        {...otherProps}
      />
    </div>
  );
};

import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  labelContent: string | JSX.Element;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({
  labelContent,
  onValueChange,
  name,
  options,
  value: selectedValue,
  ...otherProps
}) => {
  const { current: id } = useRef(uuidv4());
  return (
    <div>
      <label htmlFor={`${name}-${id}`}>{labelContent}</label>
      <select id={`${name}-${id}`} onChange={(event) => onValueChange(event.target.value)}>
        {options.map(({ label, value: optionValue }) => (
          <option key={optionValue} selected={optionValue === selectedValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

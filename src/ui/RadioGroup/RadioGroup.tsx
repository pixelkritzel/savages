import React from 'react';
import { observer } from 'mobx-react';

interface RadioGroupProps {
  title: string;
  radios: [value: string, label: string][];
  selectedValue: string | undefined;
  setSelectedValue: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = observer(
  ({ title, radios, selectedValue, setSelectedValue, ...otherProps }) => {
    return (
      <fieldset {...otherProps}>
        <legend>{title}</legend>
        {radios.map(([value, label]) => (
          <label key={value}>
            <input
              type="radio"
              checked={value === selectedValue}
              onChange={() => setSelectedValue(value)}
            />
            {label}
          </label>
        ))}
      </fieldset>
    );
  }
);

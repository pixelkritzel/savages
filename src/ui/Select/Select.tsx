import React from 'react';
import { Form } from 'react-bootstrap';

export interface SelectProps extends React.ComponentProps<typeof Form.Select> {
  value?: string;
  onValueChange?: (value: string) => void;
  options: { label: string; value: string }[];
}

export function Select({
  onValueChange = () => undefined,
  options,
  value,
  ...otherProps
}: SelectProps) {
  return (
    <div>
      <Form.Select
        value={value}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onValueChange(event.target.value)
        }
        {...otherProps}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}

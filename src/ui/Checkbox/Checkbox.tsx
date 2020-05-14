import React from 'react';
import { v4 as uuidV4 } from 'uuid';

interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'label'> {
  id?: string;
  label: string | React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  id = uuidV4(),
  label,
  type = 'checkbox',
  ...otherProps
}) => (
  <label className={className} htmlFor={id}>
    <input type="checkbox" id={id} {...otherProps} />
    {label}
  </label>
);

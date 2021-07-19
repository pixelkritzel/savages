import React from 'react';
import styled from 'styled-components';
import { generateId } from 'utils/generateId';

const InputCheckbox = styled.input`
  margin-right: 8px;
`;

const Label = styled.label`
  display: inline-block;
`;

interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  id?: string;
  label: string | React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  id = generateId(),
  label,
  type = 'checkbox',
  ...otherProps
}) => (
  <Label className={className} htmlFor={id}>
    <InputCheckbox type="checkbox" id={id} {...otherProps} />
    {label}
  </Label>
);

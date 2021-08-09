import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import { generateId } from 'utils/generateId';

const InputCheckbox = styled.input`
  margin-right: 8px;
  margin-top: 5px;
  width: auto !important;
  min-width: auto !important;
`;

const Label = styled.label`
  display: inline-block;
`;

const CheckboxContainer = styled.div`
  display: inline-flex;
`;

interface CheckboxProps extends React.ComponentProps<typeof InputCheckbox> {
  id?: string;
  label: string | React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = observer(
  ({ className, id = generateId(), label, type = 'checkbox', ...otherProps }) => {
    return (
      <CheckboxContainer className={className}>
        <InputCheckbox type="checkbox" id={id} {...otherProps} />
        <Label htmlFor={id}>{label}</Label>
      </CheckboxContainer>
    );
  }
);

import React from 'react';
import { observer } from 'mobx-react';
import { generateId } from 'utils/generateId';
import styled from 'styled-components';

const StyledFormGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.label`
  font-weight: bold;
  text-align: right;
  width: 54%;
`;

const InputContainer = styled.div`
  width: 40%;
`;

interface FormGroupProps {
  label: JSX.Element | string;
  id?: string;
  input: React.JSXElementConstructor<{ id: string }>;
}

export const FormGroup: React.FC<FormGroupProps> = observer(
  ({ label, id = generateId(), input: Input, ...otherProps }) => {
    return (
      <StyledFormGroup {...otherProps}>
        <Label htmlFor={id}>{label}</Label>
        <InputContainer>
          <Input id={id} />
        </InputContainer>
      </StyledFormGroup>
    );
  }
);

import React from 'react';
import { observer } from 'mobx-react';
import { generateId } from 'utils/generateId';
import styled from 'styled-components';

const StyledFormGroup = styled.div<{ inline: boolean }>`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  justify-content: ${({ inline }) => (inline ? 'flex-start' : 'space-between')};
  flex-wrap: wrap;
`;

const Label = styled.label<{ inline: boolean }>`
  font-weight: bold;
  text-align: ${({ inline }) => (inline ? 'left' : 'right')};
  width: ${({ inline }) => (inline ? 'auto' : '54%')};
  margin-right: ${({ inline }) => (inline ? '24px' : '0')};
  white-space: nowrap;
`;

const InputContainer = styled.div<{ inline: boolean }>`
  width: ${({ inline }) => (inline ? 'auto' : '40%')};
  flex-shrink: 2;
`;

interface FormGroupProps {
  label: JSX.Element | string;
  id?: string;
  inline?: boolean;
  input: (_: { id: string }) => React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = observer(
  ({ label, id, inline = false, input, ...otherProps }) => {
    const idRef = React.useRef(id ?? generateId());
    return (
      <StyledFormGroup inline {...otherProps}>
        <Label htmlFor={idRef.current} inline>
          {label}
        </Label>
        <InputContainer inline>{input({ id: idRef.current })}</InputContainer>
      </StyledFormGroup>
    );
  }
);

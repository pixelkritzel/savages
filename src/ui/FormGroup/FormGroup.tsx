import React from 'react';
import { observer } from 'mobx-react';
import { generateId } from 'utils/generateId';
import styled from 'styled-components';

const StyledFormGroup = styled.div<{ inline: boolean }>`
  display: ${({ inline }) => (inline ? 'inline-grid' : 'grid')};
  align-items: center;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;
`;

const Label = styled.label<{ inline: boolean }>`
  text-align: ${({ inline }) => (inline ? 'left' : 'right')};
`;

const InputContainer = styled.div<{ inline: boolean }>`
  width: ${({ inline }) => (inline ? 'auto' : '100%')};
  min-width: ${({ inline }) => (inline ? '0px' : '100%')};
  max-width: 100%;

  input {
    width: ${({ inline }) => (inline ? 'auto' : '100%')};
    min-width: ${({ inline }) => (inline ? '0' : '100%')};
    max-width: 100%;
  }
`;

interface FormGroupProps extends React.ComponentProps<typeof StyledFormGroup> {
  label: JSX.Element | string;
  id?: string;
  inline?: boolean;
  input: (id: { id: string }) => React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = observer(
  ({ label, id, inline = false, input, ...otherProps }) => {
    const idRef = React.useRef(id ?? generateId());
    return (
      <StyledFormGroup inline={inline} {...otherProps}>
        <Label htmlFor={idRef.current} inline={inline}>
          {label}
        </Label>
        <InputContainer inline={inline}>{input({ id: idRef.current })}</InputContainer>
      </StyledFormGroup>
    );
  }
);

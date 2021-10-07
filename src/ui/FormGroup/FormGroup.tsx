import React from 'react';
import { observer } from 'mobx-react';
import { generateId } from 'lib/utils/generateId';
import styled, { css } from 'styled-components';
import { gridSpanStyles, gridStyles } from 'ui/Grid';

type formGroupStylingProps = { inline: boolean; $direction: 'column' | 'row' };

const StyledFormGroup = styled.div<formGroupStylingProps>`
  ${({ inline, $direction = 'row' }) =>
    !inline && $direction === 'row'
      ? css`
          ${gridStyles}
          align-items: center;
        `
      : css<formGroupStylingProps>`
          display: flex;
          flex-direction: column;
          column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;
          row-gap: ${({ theme }) => theme.rhythms.inside.vertical}px;
          align-items: stretch;
          width: 100%;
          height: 100%;
        `}
`;

const Label = styled.label<formGroupStylingProps>`
  ${({ inline, $direction = 'row' }) =>
    !inline && $direction === 'row'
      ? css`
          ${gridSpanStyles}
          grid-column: 1 / 7;
          width: 100%;
          text-align: right;
        `
      : css<formGroupStylingProps>`
          ${({ theme, $direction }) =>
            $direction === 'column'
              ? css`
                  padding-left: ${theme.input.padding.default};
                `
              : css<{ inline: boolean; $direction: 'column' | 'row' }>`
                  margin-top: ${({ theme, inline, $direction = 'row' }) =>
                    theme.input.padding[inline || $direction === 'column' ? 'inline' : 'default']};
                `}
          text-align: ${({ inline, $direction = 'row' }) =>
            inline || $direction === 'column' ? 'left' : 'right'};
          width: ${({ inline }) => !inline && $direction === 'row' && '30%'};
          flex-shrink: 0;
        `}
`;

const InputContainer = styled.div<formGroupStylingProps>`
  ${({ inline, $direction = 'row' }) =>
    !inline && $direction === 'row'
      ? css`
          ${gridSpanStyles}
          grid-column: 7 / 13;
          justify-self: stretch;
        `
      : css<formGroupStylingProps>`
          width: 100%;
          height: ${({ $direction }) => $direction === 'column' && '100%'};
        `}
  input:not([type="radio"]), select {
    min-width: 100%;
    max-width: 100%;
  }
`;

interface FormGroupProps extends React.ComponentPropsWithoutRef<typeof StyledFormGroup> {
  label: JSX.Element | string;
  id?: string;
  inputId?: string;
  inline?: boolean;
  direction?: 'column' | 'row';
  input: (id: { id: string }) => React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = observer(
  ({ label, direction = 'row', id, inputId, inline = false, input, ...otherProps }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _inputId = React.useMemo(() => inputId ?? generateId(), [false]);
    return (
      <StyledFormGroup $direction={direction} inline={inline} {...otherProps}>
        <Label $direction={direction} id={id} htmlFor={_inputId} inline={inline}>
          {label}
        </Label>
        <InputContainer $direction={direction} inline={inline}>
          {input({ id: _inputId })}
        </InputContainer>
      </StyledFormGroup>
    );
  }
);

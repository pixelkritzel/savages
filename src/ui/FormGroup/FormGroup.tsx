import React from 'react';
import { observer } from 'mobx-react';
import { generateId } from 'lib/utils/generateId';
import styled, { css } from 'styled-components';
import { gridSpanStyles, gridStyles } from 'ui/Grid';

type formGroupStylingProps = { inline: boolean; direction: 'column' | 'row' };

const StyledFormGroup = styled.div<formGroupStylingProps>`
  ${({ inline, direction = 'row' }) =>
    !inline && direction === 'row'
      ? gridStyles
      : css<formGroupStylingProps>`
          display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
          /* height: ${({ direction }) => direction === 'column' && '100%'}; */
          flex-direction: ${({ direction = 'row' }) => direction};
          column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;
          row-gap: ${({ theme }) => theme.rhythms.inside.vertical}px;
          align-items: ${({ direction = 'row' }) =>
            direction === 'column' ? 'stretch' : 'baseline'};
        `}
`;

const Label = styled.label<formGroupStylingProps>`
  ${({ inline, direction = 'row' }) =>
    !inline && direction === 'row'
      ? css`
          ${gridSpanStyles}
          grid-column: 1 / 5;
          width: 100%;
          text-align: right;
        `
      : css<formGroupStylingProps>`
          ${({ theme, direction }) =>
            direction === 'column'
              ? css`
                  padding-left: ${theme.input.padding.default};
                `
              : css<{ inline: boolean; direction: 'column' | 'row' }>`
                  margin-top: ${({ theme, inline, direction = 'row' }) =>
                    theme.input.padding[inline || direction === 'column' ? 'inline' : 'default']};
                `}
          text-align: ${({ inline, direction = 'row' }) =>
            inline || direction === 'column' ? 'left' : 'right'};
          width: ${({ inline }) => !inline && direction === 'row' && '30%'};
          flex-shrink: 0;
        `}
`;

const InputContainer = styled.div<{ inline: boolean; direction: 'column' | 'row' }>`
  ${({ inline, direction = 'row' }) =>
    !inline && direction === 'row'
      ? css`
          ${gridSpanStyles}
          grid-column: 5 / 13;
        `
      : css<formGroupStylingProps>`
          width: 100%;
          height: ${({ direction }) => direction === 'column' && '100%'};
        `}
  input, select {
    min-width: 100%;
    max-width: 100%;
  }
`;

interface FormGroupProps extends React.ComponentProps<typeof StyledFormGroup> {
  label: JSX.Element | string;
  id?: string;
  inline?: boolean;
  direction?: 'column' | 'row';
  input: (id: { id: string }) => React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = observer(
  ({ label, direction = 'row', id, inline = false, input, ...otherProps }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _id = React.useMemo(() => id ?? generateId(), [false]);
    return (
      <StyledFormGroup direction={direction} inline={inline} {...otherProps}>
        <Label direction={direction} htmlFor={_id} inline={inline}>
          {label}
        </Label>
        <InputContainer direction={direction} inline={inline}>
          {input({ id: _id })}
        </InputContainer>
      </StyledFormGroup>
    );
  }
);

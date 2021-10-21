import React, { useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { focusStyles } from 'lib/utils/focus-styles';

type StyledInputProps = { hasError?: boolean; variant?: 'default' | 'inline' };

const StyledInput = styled.input<StyledInputProps>`
  height: ${({ variant }) => variant === 'default' && '36px'};
  min-width: 100%;
  max-width: 100%;
  padding: ${({ theme, variant = 'default' }) => theme.input.padding[variant]};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.input.borderColor.error : theme.input.borderColor.normal};
  background-color: white;

  &:focus {
    outline: none;
  }

  &[readonly] {
    color: ${({ theme }) => theme.colors.grays['600']};
    border-color: ${({ theme }) => theme.colors.grays['800']};
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.grays['600']};
    background-color: ${({ theme }) => theme.colors.grays['800']};
    border-color: ${({ theme }) => theme.colors.grays['700']};
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div<{ hasFocus: boolean }>`
  ${({ hasFocus }) => hasFocus && focusStyles}
`;

type InputProps = {
  onValueChange?: (value: string) => void;
} & Omit<JSX.IntrinsicElements['input'], 'ref'> &
  StyledInputProps;

export const Input = React.forwardRef(function Input(
  props: InputProps,
  ref: React.Ref<HTMLInputElement>
) {
  const [hasFocus, setHasFocus] = useState(false);

  const onBlur = useMemo(
    () => (event: React.FocusEvent<HTMLInputElement>) => {
      setHasFocus(false);
      props.onBlur && props.onBlur(event);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChange = useMemo(
    () => (event: React.ChangeEvent<HTMLInputElement>) => {
      props.onValueChange && props.onValueChange(event.target.value);
      props.onChange && props.onChange(event);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onFocus = useMemo(
    () => (event: React.FocusEvent<HTMLInputElement>) => {
      setHasFocus(true);
      props.onFocus && props.onFocus(event);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { className, style, hasError, variant = 'default', onValueChange, ...otherProps } = props;

  return (
    <InputContainer className={className} style={style} hasFocus={hasFocus}>
      <StyledInput
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        variant={variant}
        hasError={hasError}
        ref={ref}
        {...otherProps}
      />
    </InputContainer>
  );
});

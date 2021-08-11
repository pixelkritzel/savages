import React from 'react';
import styled from 'styled-components';
import { focusStyles } from 'lib/utils/focus-styles';

const StyledInput = styled.input<{ hasError?: boolean; variant?: 'default' | 'inline' }>`
  height: ${({ variant }) => variant === 'default' && '36px'};

  padding: ${({ theme, variant = 'default' }) => theme.input.padding[variant]};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.input.borderColor.error : theme.input.borderColor.normal};
  border-radius: 4px;
  background-color: white;

  &:focus {
    outline: none;
  }

  &[readonly] {
    color: ${({ theme }) => theme.colors.grays['600']};
    border-color: ${({ theme }) => theme.colors.grays['800']};
  }
`;

const InputContainer = styled.div<{ hasFocus: boolean }>`
  ${({ hasFocus }) => hasFocus && focusStyles}
`;

interface InputProps extends React.ComponentProps<typeof StyledInput> {
  onValueChange?: (value: string) => void;
  hasError?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export class Input extends React.Component<InputProps, { hasFocus: boolean }> {
  state = { hasFocus: false };

  onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ hasFocus: false });
    this.props.onBlur && this.props.onBlur(event);
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onValueChange && this.props.onValueChange(event.target.value);
    this.props.onChange && this.props.onChange(event);
  };

  onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ hasFocus: true });
    this.props.onFocus && this.props.onFocus(event);
  };

  render() {
    const {
      className,
      style,
      hasError,
      variant = 'default',
      onValueChange,
      ...otherProps
    } = this.props;

    return (
      <InputContainer className={className} style={style} hasFocus={this.state.hasFocus}>
        <StyledInput
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          variant={variant}
          hasError={hasError}
          {...otherProps}
        />
      </InputContainer>
    );
  }
}

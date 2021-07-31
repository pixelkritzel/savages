import React from 'react';
import styled from 'styled-components';
import { focusStyles } from 'utils/focus-styles';

const StyledInput = styled.input<{ hasError?: boolean; variant?: 'default' | 'inline' }>`
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.input.borderColor.error : theme.input.borderColor.normal};
  border-radius: 4px;
  background-color: inherit;
  padding: ${({ variant }) => variant === 'inline' && '0 6px'};

  &:focus {
    outline: none;
  }
`;

const InputContainer = styled.div<{ hasFocus: boolean }>`
  ${({ hasFocus }) => hasFocus && focusStyles}
`;

interface InputProps extends React.ComponentProps<typeof StyledInput> {
  onValueChange?: (value: string) => void;
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
    const { className, hasError, variant = 'default', onValueChange, ...otherProps } = this.props;

    return (
      <InputContainer hasFocus={this.state.hasFocus}>
        <StyledInput
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          variant={variant}
          {...otherProps}
        />
      </InputContainer>
    );
  }
}

import React from 'react';
import cx from 'classnames';

import CSS from './Input.module.scss';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  hasError?: boolean;
  variant?: 'default' | 'inline';
}

export class Input extends React.Component<InputProps, { hasFocus: boolean }> {
  state = { hasFocus: false };

  onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ hasFocus: false });
    this.props.onBlur && this.props.onBlur(event);
  };

  onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ hasFocus: true });
    this.props.onFocus && this.props.onFocus(event);
  };

  render() {
    const { className, hasError, variant = 'default', ...otherProps } = this.props;

    return (
      <span
        className={cx({ [CSS.focus]: this.state.hasFocus, [CSS.inline]: variant === 'inline' })}
      >
        <input
          className={cx(CSS.input, className, {
            [CSS.hasError]: hasError,
            [CSS.inlineInput]: variant === 'inline',
          })}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          {...otherProps}
        />
      </span>
    );
  }
}

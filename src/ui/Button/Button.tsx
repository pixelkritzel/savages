import React from 'react';
import cx from 'classnames';

import CSS from './Button.module.scss';

interface ButtonProps<T extends keyof HTMLElementTagNameMap = 'button'>
  extends React.HTMLProps<HTMLElementTagNameMap[T]> {
  as?: T;
  icon?: JSX.Element;
  variant?: 'default' | 'danger' | 'success';
}

export class Button<T extends keyof HTMLElementTagNameMap = 'button'> extends React.Component<
  ButtonProps<T>
> {
  render() {
    const {
      as = 'button',
      children,
      className,
      icon,
      variant = 'default',
      ...otherProps
    } = this.props;
    return React.createElement(
      as,
      { className: cx(CSS.btn, CSS[variant], className), ...otherProps },
      [icon ? <span className={CSS.icon}>{icon}</span> : null, children]
    );
  }
}

import React from 'react';
import cx from 'classnames';

import CSS from './Button.module.scss';

interface ButtonProps<T extends keyof HTMLElementTagNameMap = 'button'>
  extends React.HTMLProps<HTMLElementTagNameMap[T]> {
  as?: T;
  icon?: JSX.Element;
  variant?: 'default' | 'danger' | 'success' | 'link';
  children: React.ReactNode;
}

export function Button<T extends keyof HTMLElementTagNameMap = 'button'>({
  as,
  children,
  className,
  icon,
  variant = 'default',
  ...otherProps
}: ButtonProps<T>) {
  return React.createElement(
    as ?? 'button',
    { className: cx(CSS.btn, CSS[variant], className), ...otherProps },
    [icon ? <span className={CSS.icon}>{icon}</span> : null, children]
  );
}

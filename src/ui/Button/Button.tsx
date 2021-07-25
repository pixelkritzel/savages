import React, { useRef } from 'react';
import cx from 'classnames';
import CSS from './Button.module.scss';
import { generateId } from 'utils/generateId';

interface ButtonProps<T extends keyof HTMLElementTagNameMap = 'button'>
  extends React.HTMLProps<HTMLElementTagNameMap[T]> {
  as?: T;
  icon?: JSX.Element;
  variant?: 'default' | 'danger' | 'success' | 'link' | 'icon';
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
  const { current: id } = useRef(generateId());
  return React.createElement(
    as ?? 'button',
    { className: cx(CSS.btn, CSS[variant], className), ...otherProps },
    [
      <span key={id} className={CSS.inner}>
        {icon && <span className={CSS.innerIcon}>{icon}</span>}
        {children}
      </span>,
    ]
  );
}

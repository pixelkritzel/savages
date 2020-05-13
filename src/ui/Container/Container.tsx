import React, { HTMLProps } from 'react';
import cx from 'classnames';

import CSS from './Container.module.scss';

interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ children, className, ...otherProps }) => (
  <div className={cx(CSS.container, className)} {...otherProps}>
    {children}
  </div>
);

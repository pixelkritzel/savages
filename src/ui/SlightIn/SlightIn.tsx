import React from 'react';
import { observer } from 'mobx-react';
import AnimateHeight from 'react-animate-height';

interface SlightInProps {
  id: string;
  duration?: number;
  isOpen?: boolean;
  children?: React.ReactNode;
}

export const SlightIn = observer(function SlightInFn({
  id,
  duration = 300,
  isOpen = false,
  children,
  ...otherProps
}: SlightInProps) {
  return (
    <AnimateHeight id={id} duration={300} height={isOpen ? 'auto' : 0} {...otherProps}>
      {children}
    </AnimateHeight>
  );
});

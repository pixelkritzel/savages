import React from 'react';
import cx from 'classnames';

import CSS from './IncDec.module.scss';
import { Button } from 'ui/Button';

interface IncDecProps extends Omit<React.HTMLProps<HTMLDivElement>, 'value'> {
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  value: React.ReactNode;
}

export const IncDec: React.FC<IncDecProps> = ({
  disableDecrement = false,
  disableIncrement = false,
  onDecrement,
  onIncrement,
  value,
  className,
}) => {
  return (
    <div className={cx(CSS.incDec, className)}>
      <Button className={CSS.button} disabled={disableDecrement} onClick={onDecrement}>
        -
      </Button>
      <span className={CSS.value}>{value}</span>
      <Button className={CSS.button} disabled={disableIncrement} onClick={onIncrement}>
        +
      </Button>
    </div>
  );
};

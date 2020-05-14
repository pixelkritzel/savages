import React from 'react';

import CSS from './IncDec.module.scss';
import { Button } from 'ui/Button';

interface IncDec extends Omit<React.HTMLProps<HTMLDivElement>, 'value'> {
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  value: React.ReactNode;
}

export const IncDec: React.FC<IncDec> = ({
  disableDecrement = false,
  disableIncrement = false,
  onDecrement,
  onIncrement,
  value,
}) => {
  return (
    <div className={CSS.incDec}>
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

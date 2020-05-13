import React from 'react';

import CSS from './IncDec.module.scss';
import { Button } from 'ui/Button';

interface IncDec extends React.HTMLProps<HTMLDivElement> {
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  value: string;
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
      <Button disabled={disableDecrement} onClick={onDecrement}>
        -
      </Button>

      <input className={CSS.input} readOnly value={value} />

      <Button disabled={disableIncrement} onClick={onIncrement}>
        +
      </Button>
    </div>
  );
};

import React from 'react';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import CSS from './IncDec.module.scss';

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
    <InputGroup className={CSS.incDec}>
      <InputGroup.Prepend>
        <Button variant="outline-secondary" disabled={disableDecrement} onClick={onDecrement}>
          -
        </Button>
      </InputGroup.Prepend>
      <FormControl className={CSS.input} readOnly value={value} />
      <InputGroup.Append>
        <Button variant="outline-secondary" disabled={disableIncrement} onClick={onIncrement}>
          +
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

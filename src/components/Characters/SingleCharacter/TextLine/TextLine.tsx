import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { BsCheck, BsPencil } from 'react-icons/bs';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import CSS from './TextLine.module.scss';

interface TextLineProps {
  label: string;
  value: string;
  onValueChange(value: string): void;
}

export const TextLine: React.FC<TextLineProps> = observer(({ label, onValueChange, value }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className={CSS.line}>
      <div className={CSS.label}>{label}</div>
      {!isEdit ? (
        <div className={CSS.value}>{value}</div>
      ) : (
        <InputGroup>
          <FormControl value={value} onChange={(event) => onValueChange(event.target.value)} />
          <InputGroup.Append>
            <Button onClick={() => setIsEdit(false)}>
              <BsCheck />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      )}
      {!isEdit && (
        <Button className="btn-inline-link" variant="link" onClick={() => setIsEdit(true)}>
          <BsPencil />
        </Button>
      )}
    </div>
  );
});

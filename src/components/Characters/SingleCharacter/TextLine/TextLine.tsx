import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { BsCheck, BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';

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
        <>
          <input
            type="text"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
          />

          <Button onClick={() => setIsEdit(false)}>
            <BsCheck />
          </Button>
        </>
      )}
      {!isEdit && (
        <Button className="btn-inline-link" onClick={() => setIsEdit(true)}>
          <BsPencil />
        </Button>
      )}
    </div>
  );
});

import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { BsCheck, BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';

import CSS from './TextLine.module.scss';
import { Input } from 'ui/Input';
import { observable } from 'mobx';

interface TextLineProps {
  isEdit?: boolean;
  label: string;
  value: string;
  onValueChange(value: string): void;
}

@observer
export class TextLine extends React.Component<TextLineProps> {
  static defaultProps = {
    isEdit: false,
  };

  @observable isEdit = this.props.isEdit;

  render() {
    const { label, onValueChange, value } = this.props;

    return (
      <div className={CSS.line}>
        <div className={CSS.label}>{label}</div>
        {!this.isEdit ? (
          <div className={CSS.value}>{value}</div>
        ) : (
          <>
            <Input
              variant="inline"
              type="text"
              value={value}
              onValueChange={(value) => onValueChange(value)}
            />
            <Button variant="link" onClick={() => (this.isEdit = false)}>
              <BsCheck />
            </Button>
          </>
        )}
        {!this.isEdit && (
          <Button className="btn-inline-link" variant="link" onClick={() => (this.isEdit = true)}>
            <BsPencil />
          </Button>
        )}
      </div>
    );
  }
}

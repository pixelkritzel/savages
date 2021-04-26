import React from 'react';
import { observer } from 'mobx-react';
import { v4 as uuid4 } from 'uuid';

import { BsCheck, BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';

import CSS from './TextLine.module.scss';
import { Input } from 'ui/Input';
import { observable, makeObservable } from 'mobx';

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

  id = uuid4();

  constructor(props: TextLineProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { label, onValueChange, value } = this.props;

    return (
      <div className={CSS.line}>
        <label htmlFor={this.id} className={CSS.label}>
          {label}
        </label>
        {!this.isEdit ? (
          <div className={CSS.value}>{value}</div>
        ) : (
          <>
            <Input
              variant="inline"
              type="text"
              value={value}
              onValueChange={(value) => onValueChange(value)}
              id={this.id}
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

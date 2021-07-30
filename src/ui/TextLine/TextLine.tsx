import React from 'react';
import { observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { BsCheck, BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';
import { Input } from 'ui/Input';
import { FormGroup } from 'ui/FormGroup';

interface TextLineProps {
  isEdit?: boolean;
  label: string;
  value: string;
  onValueChange(value: string): void;
}

const TextLineContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal};
`;

const StyledInput = styled(Input)`
  min-width: 100%;
  max-width: 100%;
`;

const Value = styled.div`
  font-family: 'Courier New', Courier, monospace;
`;

@observer
export class TextLine extends React.Component<TextLineProps> {
  static defaultProps = {
    isEdit: false,
  };

  @observable isEdit = this.props.isEdit;

  constructor(props: TextLineProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { label, onValueChange, value } = this.props;

    return (
      <TextLineContainer>
        <FormGroup
          label={label}
          input={({ id }) =>
            !this.isEdit ? (
              <Value>{value}</Value>
            ) : (
              <StyledInput
                id={id}
                variant="inline"
                type="text"
                value={value}
                onValueChange={(value: string) => onValueChange(value)}
              />
            )
          }
        ></FormGroup>
        {!this.isEdit ? (
          <Button className="btn-inline-link" variant="link" onClick={() => (this.isEdit = true)}>
            <BsPencil />
          </Button>
        ) : (
          <Button variant="link" onClick={() => (this.isEdit = false)}>
            <BsCheck />
          </Button>
        )}
      </TextLineContainer>
    );
  }
}

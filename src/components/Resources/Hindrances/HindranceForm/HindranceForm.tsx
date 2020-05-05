import React from 'react';

import Form from 'react-bootstrap/Form';

import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';

import { Ihindrance } from 'store/resources/hindrances';

interface HindrancesFormProps {
  hindrance?: Ihindrance;
}

export const HindranceForm: React.FC<HindrancesFormProps> = ({ hindrance }) => {
  if (!hindrance) {
    return null;
  }

  return (
    <div>
      <SWFormGroup controlId="name" label="Name">
        <Form.Control
          type="text"
          placeholder="Hindrance name"
          value={hindrance.name}
          onChange={(event) => hindrance.set('name', event.target.value)}
        />
      </SWFormGroup>
    </div>
  );
};

import React from 'react';

import { Imodifier } from 'store/modifier';
import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';
import Form from 'react-bootstrap/Form';
import { IncDec } from 'ui/IncDec';
import { observer } from 'mobx-react-lite';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { capitalizeFirstLetter } from 'lib/strings';

interface ModifierFormProps {
  modifier: Imodifier;
}

export const ModifierForm: React.FC<ModifierFormProps> = observer(({ modifier }) => {
  return (
    <div>
      <h4>Attributes</h4>
      {(['agility', 'smarts', 'spirit', 'strength', 'vigor'] as [
        'agility',
        'smarts',
        'spirit',
        'strength',
        'vigor'
      ]).map((attributeName) => (
        <React.Fragment key={attributeName}>
          <h5>{capitalizeFirstLetter(attributeName)}</h5>
          <Row>
            {(['value', 'maximum', 'minimum'] as ['value', 'maximum', 'minimum']).map((key) => (
              <Col md={4} key={`${attributeName}-${key}`}>
                <Form.Label>{capitalizeFirstLetter(key)}</Form.Label>
                <IncDec
                  value={modifier[attributeName][key].toString()}
                  onDecrement={() =>
                    modifier[attributeName].set(key, modifier[attributeName][key] - 1)
                  }
                  onIncrement={() =>
                    modifier[attributeName].set(key, modifier[attributeName][key] + 1)
                  }
                />
              </Col>
            ))}
          </Row>
          <SWFormGroup controlId={`${attributeName}-optional`} label="Condition">
            <Form.Control
              type="text"
              value={modifier[attributeName].condition}
              onChange={(event) => modifier[attributeName].set('condition', event.target.value)}
              placeholder="e.g. while swimming"
            />
          </SWFormGroup>
        </React.Fragment>
      ))}
      <hr />
      <Row>
        {(['bennies', 'toughness', 'size', 'freeEdges', 'armor'] as [
          'bennies',
          'toughness',
          'size',
          'freeEdges',
          'armor'
        ]).map((key) => (
          <Col md={4} key={`hindrance-${key}`}>
            <Form.Label>{capitalizeFirstLetter(key)}</Form.Label>
            <IncDec
              value={modifier[key].toString()}
              onDecrement={() => modifier.set(key, modifier[key] - 1)}
              onIncrement={() => modifier.set(key, modifier[key] + 1)}
            />
          </Col>
        ))}
      </Row>
      <br />
      <h5>Pace</h5>
      <Row>
        {(['base', 'swimming', 'flying'] as ['base', 'swimming', 'flying']).map((key) => (
          <Col md={4} key={`hindrance-${key}`}>
            <Form.Label>{capitalizeFirstLetter(key)}</Form.Label>
            <IncDec
              value={modifier.pace[key].toString()}
              onDecrement={() => modifier.pace.set(key, modifier.pace[key] - 1)}
              onIncrement={() => modifier.pace.set(key, modifier.pace[key] + 1)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
});

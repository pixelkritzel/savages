import React from 'react';
import { observer } from 'mobx-react-lite';
import format from 'date-fns/format';

import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { IncDec } from 'ui/IncDec';
import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';

import { Icharacter } from 'store/characters';

export const CharacterForm: React.FC<{ character?: Icharacter }> = observer(({ character }) => {
  if (!character) {
    return null;
  }
  const { agility, smarts, spirit, strength, vigor } = character.attributes;
  return (
    <Row>
      <Col md={9}>
        <SWFormGroup controlId="name" label="Name">
          <Form.Control
            type="text"
            placeholder="Character name"
            value={character.name}
            onChange={(event) => character.set('name', event.target.value)}
          />
        </SWFormGroup>

        <hr />
        <Row>
          <Col>
            <h3>Attributes</h3>
          </Col>
          <Col>(Points remaining: {character.remainingAttributePoints})</Col>
        </Row>
        <SWFormGroup controlId="agility-dice" label="Agility">
          <IncDec
            disableDecrement={!agility.isDecrementable}
            disableIncrement={!agility.isIncrementable}
            onDecrement={agility.decrement}
            onIncrement={agility.increment}
            value={agility.value}
          />
        </SWFormGroup>
        <SWFormGroup controlId="smarts-dice" label="Smarts">
          <IncDec
            disableDecrement={!smarts.isDecrementable}
            disableIncrement={!smarts.isIncrementable}
            onDecrement={smarts.decrement}
            onIncrement={smarts.increment}
            value={smarts.value}
          />
        </SWFormGroup>
        <SWFormGroup controlId="spirit-dice" label="Spirit">
          <IncDec
            disableDecrement={!spirit.isDecrementable}
            disableIncrement={!spirit.isIncrementable}
            onDecrement={spirit.decrement}
            onIncrement={spirit.increment}
            value={spirit.value}
          />
        </SWFormGroup>
        <SWFormGroup controlId="strength-dice" label="Strength">
          <IncDec
            disableDecrement={!strength.isDecrementable}
            disableIncrement={!strength.isIncrementable}
            onDecrement={strength.decrement}
            onIncrement={strength.increment}
            value={strength.value}
          />
        </SWFormGroup>
        <SWFormGroup controlId="vigor-dice" label="Vigor">
          <IncDec
            disableDecrement={!vigor.isDecrementable}
            disableIncrement={!vigor.isIncrementable}
            onDecrement={vigor.decrement}
            onIncrement={vigor.increment}
            value={vigor.value}
          />
        </SWFormGroup>
      </Col>
      <Col md={3}>
        <ul>
          {character.log.map(({ date, message }) => (
            <li key={date}>
              <strong>{format(new Date(date), 'd.M.Y - H:mm')}</strong>
              <br />
              {message}
            </li>
          ))}
        </ul>
      </Col>

      {character.showErrors && (
        <Col>
          <Alert variant="danger">
            <Alert.Heading>Sorry, it looks as there is something wrong.</Alert.Heading>
            <ul>
              {character.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>

            <hr />
            <p>
              <Form.Check
                type="checkbox"
                id={`ignore-errors`}
                label={`Ignore errors and save anyway (will be logged)`}
                checked={character.ignoreErrors}
                onChange={() => character.set('ignoreErrors', !character.ignoreErrors)}
              />
            </p>
          </Alert>
        </Col>
      )}
    </Row>
  );
});

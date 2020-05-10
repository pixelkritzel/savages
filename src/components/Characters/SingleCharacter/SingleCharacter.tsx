import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { StoreContext } from 'components/StoreContext';

import { characterModel, SIcharacter } from 'store/characters';

import CSS from './SingleCharacter.module.scss';

import { Dice } from './Dice';

import { single_character_mock } from './single_character_mock';
import { TextLine } from './TextLine';

export const SingleCharacter: React.FC<{}> = observer(function () {
  const { characterId } = useParams();
  const history = useHistory();
  const store = React.useContext(StoreContext);

  const character = characterModel.create(single_character_mock);

  const isEdit = true;

  return (
    <>
      <Row>
        <Col className={CSS.box} md={4}>
          Attributes
          <Dice isEdit={isEdit} trait={character.attributes.agility} />
          <Dice isEdit={isEdit} trait={character.attributes.smarts} />
          <Dice isEdit={isEdit} trait={character.attributes.spirit} />
          <Dice isEdit={isEdit} trait={character.attributes.strength} />
          <Dice isEdit={isEdit} trait={character.attributes.vigor} />
        </Col>
        <Col className={CSS.box} md={8}>
          Character
          <Row>
            <Col md={9}>
              <TextLine
                label="Name"
                onValueChange={(value) => character.set('name', value)}
                value={character.name}
              />
              <TextLine
                label="Race"
                onValueChange={(value) => character.set('race', value)}
                value={character.race}
              />
              <TextLine
                label="Origin"
                onValueChange={(value) => character.set('origin', value)}
                value={character.origin}
              />
              <TextLine
                label="Cryptos"
                onValueChange={(value) => character.set('money', Number(value))}
                value={character.money.toString()}
              />
            </Col>
            <Col md={3}>
              <TextLine
                label="Age"
                onValueChange={(value) => character.set('age', Number(value))}
                value={character.age.toString()}
              />
              <TextLine
                label="Size"
                onValueChange={(value) => character.set('size', Number(value))}
                value={character.size.toString()}
              />
              <TextLine
                label="Bennies"
                onValueChange={(value) => character.set('bennies', Number(value))}
                value={character.bennies.toString()}
              />
              <Form.Check
                type="checkbox"
                label={<strong>Conviction</strong>}
                checked={character.conviction || undefined}
                id="conviction"
                onChange={() => character.set('conviction', true)}
              />
            </Col>
          </Row>
        </Col>
        <Col className={CSS.box} md={6}>
          Health
          <Row>
            <Col sm={5}>
              <div>
                <strong>Wounds</strong>
              </div>
              {character.wounds.map((_, woundIndex) => (
                <Form.Check
                  inline
                  checked={character.wounds[woundIndex] || undefined}
                  label={woundIndex + 1}
                  type="checkbox"
                  id={`wound-${woundIndex}`}
                  key={`wound-${woundIndex}`}
                  onChange={() =>
                    character.set(
                      'wounds',
                      character.wounds.map((existingWound, existingWoundIndex) =>
                        existingWoundIndex === woundIndex ? !existingWound : existingWound
                      ) as any
                    )
                  }
                />
              ))}
            </Col>
            <Col sm={2}>
              Inc.
              <div>
                <Form.Check
                  inline
                  checked={character.incapcitaded || undefined}
                  label=""
                  type="checkbox"
                  id="incapacitaded"
                  onChange={() => character.set('incapcitaded', !character.incapcitaded)}
                />
              </div>
            </Col>
            <Col sm={5}>
              <div>
                <strong>Fatigue</strong>
              </div>
              {character.fatigue.map((_, fatigueIndex) => (
                <Form.Check
                  inline
                  checked={character.wounds[fatigueIndex] || undefined}
                  label={fatigueIndex + 1}
                  type="checkbox"
                  id={`fatigue-${fatigueIndex}`}
                  key={`fatigue-${fatigueIndex}`}
                  onChange={() =>
                    character.set(
                      'fatigue',
                      character.wounds.map((existingWound, existingfatigueIndex) =>
                        existingfatigueIndex === fatigueIndex ? !existingWound : existingWound
                      ) as any
                    )
                  }
                />
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
});

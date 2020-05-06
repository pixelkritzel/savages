import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';

import { Ihindrance } from 'store/resources/hindrances';

import { Imodifier, modifierModel, modifierScaffold } from 'store/modifier';
import { ModifierForm, ModifierView } from 'components/Modifier';

interface HindrancesFormProps {
  hindrance?: Ihindrance;
}

export const HindranceForm: React.FC<HindrancesFormProps> = observer(({ hindrance }) => {
  const [showNewModifierForm, setShowNewModifierForm] = useState(false);

  const modifierRef = useRef<Imodifier | undefined>();

  function createNewModifier() {
    modifierRef.current = modifierModel.create(modifierScaffold);
    setShowNewModifierForm(true);
  }

  if (!hindrance) {
    return null;
  }

  return (
    <>
      <div>
        <Form.Check
          type="switch"
          id="hindrance-is-player-selectable"
          label="Is this hindrance selectable by a player?"
          checked={hindrance.isPlayerSelectable}
          onChange={() => hindrance.set('isPlayerSelectable', !hindrance.isPlayerSelectable)}
        />
        <SWFormGroup controlId="hindrance-name" label="Name">
          <Form.Control
            type="text"
            placeholder="Hindrance name"
            value={hindrance.name}
            onChange={(event) => hindrance.set('name', event.target.value)}
          />
        </SWFormGroup>
        <SWFormGroup controlId="hindrance-description" label="Description">
          <Form.Control
            as="textarea"
            rows={8}
            value={hindrance.description}
            onChange={(event) => hindrance.set('description', event.target.value)}
          />
        </SWFormGroup>

        <SWFormGroup label="Hindrance impact">
          <Form.Check
            inline
            type="radio"
            id="hindrance-impact-minor"
            label="minor"
            readOnly
            checked={hindrance.impact === 'minor'}
            onClick={() => hindrance.set('impact', 'minor')}
          />
          <Form.Check
            inline
            type="radio"
            id="hindrance-impact-major"
            label="major"
            readOnly
            checked={hindrance.impact === 'major'}
            onClick={() => hindrance.set('impact', 'major')}
          />
        </SWFormGroup>
        <SWFormGroup label="Modifiers">
          <Button onClick={() => createNewModifier()}>+ Create new modifier</Button>
          {hindrance.modifiers.map((mod) => (
            <ModifierView modifier={mod} key={mod.id} />
          ))}
        </SWFormGroup>
        {showNewModifierForm && (
          <Modal show={showNewModifierForm} onHide={() => setShowNewModifierForm(false)}>
            <Modal.Header closeButton>
              <Modal.Title>New Modifier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ModifierForm modifier={modifierRef.current!} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowNewModifierForm(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  hindrance.addModifier(modifierRef.current!);
                  setShowNewModifierForm(false);
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
});

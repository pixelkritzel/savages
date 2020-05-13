import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from 'ui/Button';

import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';

import { Ihindrance } from 'store/resources/hindrances';

import { Imodifier, modifierModel, modifierScaffold } from 'store/modifier';
import { ModifierForm, ModifierView } from 'components/Modifier';
import { Checkbox } from 'ui/Checkbox';

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
        <Checkbox
          id="hindrance-is-player-selectable"
          label="Is this hindrance selectable by a player?"
          checked={hindrance.isPlayerSelectable}
          onChange={() => hindrance.set('isPlayerSelectable', !hindrance.isPlayerSelectable)}
        />
        <SWFormGroup id="hindrance-name" label="Name">
          <input
            type="text"
            id="hindrance-name"
            placeholder="Hindrance name"
            value={hindrance.name}
            onChange={(event) => hindrance.set('name', event.target.value)}
          />
        </SWFormGroup>
        <SWFormGroup id="hindrance-description" label="Description">
          <textarea
            rows={8}
            id="hindrance-description"
            value={hindrance.description}
            onChange={(event) => hindrance.set('description', event.target.value)}
          />
        </SWFormGroup>

        <SWFormGroup label="Hindrance impact">
          <label htmlFor="hindrance-impact-minor">
            <input
              type="radio"
              id="hindrance-impact-minor"
              readOnly
              checked={hindrance.impact === 'minor'}
              onClick={() => hindrance.set('impact', 'minor')}
            />{' '}
            minor
          </label>
          <label htmlFor="hindrance-impact-major">
            <input
              type="radio"
              id="hindrance-impact-major"
              readOnly
              checked={hindrance.impact === 'major'}
              onClick={() => hindrance.set('impact', 'major')}
            />
          </label>
        </SWFormGroup>
        <SWFormGroup label="Modifiers">
          <Button onClick={() => createNewModifier()}>+ Create new modifier</Button>
          {hindrance.modifiers.map((mod) => (
            <ModifierView modifier={mod} key={mod.id} />
          ))}
        </SWFormGroup>
        {showNewModifierForm && <ModifierForm modifier={modifierRef.current!} />}
      </div>
    </>
  );
});

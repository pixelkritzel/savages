import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { ModifierForm } from '../ModifierForm';
import { modifierModel, createModifierScaffold } from 'store/modifiers';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';

interface NewModifierProps {
  children?: React.ReactNode;
}

export const NewModifier = observer(function NewModifierFn({ ...otherProps }: NewModifierProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { current: modifier } = useRef(modifierModel.create(createModifierScaffold()));
  return (
    <div {...otherProps}>
      <ModifierForm
        modifier={modifier}
        title="New modifier"
        saveModifier={() => {
          store.modifiers.add(modifier);
          history.push('/modifiers');
        }}
        cancel={() => {
          history.push('/modifiers');
        }}
      />
    </div>
  );
});

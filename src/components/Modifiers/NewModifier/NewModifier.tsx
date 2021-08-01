import React from 'react';
import { observer } from 'mobx-react';
import { ModifierForm } from '../ModifierForm';

interface NewModifierProps {
  children?: React.ReactNode;
}

export const NewModifier = observer(function NewModifierFn({ ...otherProps }: NewModifierProps) {
  return (
    <div {...otherProps}>
      <ModifierForm />
    </div>
  );
});

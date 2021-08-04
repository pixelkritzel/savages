import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { ModifierForm } from '../ModifierForm';
import { Imodifier } from 'store/modifiers';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory, useParams } from 'react-router-dom';
import { clone } from 'mobx-state-tree';

interface EditModifierProps {
  children?: React.ReactNode;
}

export const EditModifier = observer(function NewModifierFn({ ...otherProps }: EditModifierProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { modifierId } = useParams<{ modifierId: string }>();
  const modifier = useMemo(() => store.modifiers.get(modifierId) as Imodifier, [
    modifierId,
    store.modifiers,
  ]);
  const copyOfModifier = useMemo(() => clone(modifier), [modifier]);
  return (
    <div {...otherProps}>
      <ModifierForm
        modifier={modifier}
        title={`Edit ${copyOfModifier.name}`}
        saveModifier={() => {
          history.push('/modifiers');
        }}
        cancel={() => {
          store.modifiers.set(modifier._id, copyOfModifier);
          history.push('/modifiers');
        }}
      />
    </div>
  );
});

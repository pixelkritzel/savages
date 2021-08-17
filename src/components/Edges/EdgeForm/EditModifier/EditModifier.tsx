import { useContext, useRef, useState } from 'react';
import { clone } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import ReactModal from 'react-modal';

import { Button } from 'ui/Button';

import { ModifierForm } from 'components/Modifiers/ModifierForm';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Imodifier } from 'store/modifiers';

interface EditModifierProps {
  modifier: Imodifier;
}

export const EditModifier = observer(function EditModifierFn({
  modifier,
  ...otherProps
}: EditModifierProps) {
  const store = useContext<Istore>(StoreContext);

  const [isEdit, setIsEdit] = useState(false);
  const modifierClone = useRef<Imodifier | null>(null);
  return (
    <>
      <Button
        onClick={() => {
          modifierClone.current = clone(modifier);
          setIsEdit(true);
        }}
      >
        Edit
      </Button>
      {isEdit && (
        <ReactModal isOpen ariaHideApp={false}>
          <ModifierForm
            title={'New modifier'}
            modifier={modifier}
            saveModifier={() => setIsEdit(false)}
            cancel={() => {
              modifierClone.current && store.modifiers.set(modifier._id, modifierClone.current);
              setIsEdit(false);
            }}
          />
        </ReactModal>
      )}
    </>
  );
});

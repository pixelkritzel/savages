import React, { useContext, useRef } from 'react';
import { HindranceForm } from '../HindranceForm';
import { observer } from 'mobx-react-lite';
import { StoreContext } from 'components/StoreContext';

interface NewHindranceProps {}

export const NewHindrance: React.FC<NewHindranceProps> = observer(() => {
  const { hindrances } = useContext(StoreContext).resources;

  const hindranceRef = useRef(hindrances.new());

  return (
    <>
      <HindranceForm hindrance={hindranceRef.current} />
    </>
  );
});

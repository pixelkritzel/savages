import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { RaceForm } from '../RaceForm';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

interface NewRaceProps {
  children?: React.ReactNode;
}

export const NewRace = observer(function NewRaceFn({ ...otherProps }: NewRaceProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => store.races.new(), []);

  return (
    <div {...otherProps}>
      {store.races.newModel && (
        <RaceForm
          race={store.races.newModel}
          title="New race"
          saveRace={() => {
            store.races.saveNewModel();
            history.push('/races');
          }}
          discardRace={() => {
            store.races.discardNewModel();
            history.push('/races');
          }}
        />
      )}
    </div>
  );
});

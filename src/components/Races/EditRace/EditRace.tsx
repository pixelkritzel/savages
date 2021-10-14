import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { RaceForm } from '../RaceForm';
import { IRace } from 'store/races';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory, useParams } from 'react-router-dom';
import { clone } from 'mobx-state-tree';

interface EditRaceProps {
  children?: React.ReactNode;
}

export const EditRace = observer(function NewRaceFn({ ...otherProps }: EditRaceProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { raceId } = useParams<{ raceId: string }>();
  const race = useMemo(() => store.races.get(raceId) as IRace, [raceId, store.races]);
  const copyOfRace = useMemo(() => clone(race), [race]);
  return (
    <div {...otherProps}>
      <RaceForm
        race={race}
        title={`Edit ${copyOfRace.name}`}
        saveRace={() => {
          history.push('/races');
        }}
        discardRace={() => {
          store.races.set(race._id, copyOfRace);
          history.push('/races');
        }}
      />
    </div>
  );
});

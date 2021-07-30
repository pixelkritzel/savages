import * as React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';

import { Attributes } from './Attributes';
import { CharacterDescription } from './CharacterDescription';
import { Edges } from './Edges';
import { Health } from './Health';
import { Hindrances } from './Hindrances';
import { Money } from './Money';
import { Powers } from './Powers';
import { Skills } from './Skills';
import { Stats } from './Stats';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: auto;
  gap: ${({ theme }) => theme.rhythms.outside.vertical};
`;

const StyledCharacterDescription = styled(CharacterDescription)`
  grid-area: 1 / 1 / 2 / 12;
`;

const LeftColumn = styled.div`
  grid-area: 2 / 1 / 3 / 4;
  display: grid;
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical};
`;

const RightColumn = styled.div`
  grid-area: 2 / 4 / 3 / 12;
`;

export const CharacterView: React.FC<{}> = observer(function () {
  const { characterId } = useParams<{ characterId: string }>();
  const store = React.useContext<Istore>(StoreContext);
  const character = store.characters.find((character) => character.id === characterId);

  if (!character) {
    throw new Error(`Character ${characterId} wasn't found!`);
  }

  const isEdit = false;

  return (
    <GridContainer>
      <StyledCharacterDescription character={character} isEdit={isEdit} />
      <LeftColumn>
        <Money isEdit={isEdit} character={character} />
        <Health character={character} />
        <Attributes isEdit={isEdit} character={character} />
        <Stats character={character} isEdit={isEdit} />
        <Edges edges={character.edges} />
        <Hindrances hindrances={character.hindrances} />
        <div>tap</div>
      </LeftColumn>
      <RightColumn>
        <Skills character={character} />
        <Powers />
        <div>weapons</div>
        <div>augmentations</div>
        <div>gear</div>
        <div>drone</div>
        <div>vehicle</div>
      </RightColumn>
      <div>contacts</div>
      <div>notes</div>
    </GridContainer>
  );
});

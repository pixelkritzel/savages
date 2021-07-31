import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Box } from 'ui/Box';
import { Checkbox } from 'ui/Checkbox';
import { TextLine } from 'ui/TextLine';

import { Icharacter } from 'store/characters';

import { Money } from '../Money';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;
  row-gap: ${({ theme }) => theme.rhythms.inside.vertical}px;
`;

interface CharacterDescriptionsProps extends React.HTMLProps<HTMLDivElement> {
  character: Icharacter;
  isEdit: boolean;
}

export const CharacterDescription: React.FC<CharacterDescriptionsProps> = observer(
  ({ character, className, isEdit = false }) => (
    <div className={className}>
      <Box title="Description">
        <Container>
          <TextLine
            isEdit={isEdit}
            label="Name"
            onValueChange={(value) => character.set('name', value)}
            value={character.name}
          />
          <TextLine
            isEdit={isEdit}
            label="Race"
            onValueChange={(value) => character.set('race', value)}
            value={character.race}
          />
          <TextLine
            isEdit={isEdit}
            label="Origin"
            onValueChange={(value) => character.set('origin', value)}
            value={character.origin}
          />
          <TextLine
            isEdit={isEdit}
            label="Age"
            onValueChange={(value) => character.set('age', Number(value))}
            value={character.age.toString()}
          />
          <dl>
            <dt>Size</dt>
            <dd>{character.size}</dd>
          </dl>
          <TextLine
            isEdit={isEdit}
            label="Bennies"
            onValueChange={(value) => character.set('bennies', Number(value))}
            value={character.bennies.toString()}
          />
          <Checkbox
            type="checkbox"
            label={<strong>Conviction</strong>}
            checked={character.conviction || undefined}
            id="conviction"
            onChange={() => character.set('conviction', !character.conviction)}
          />
          <Money isEdit={isEdit} character={character} />
        </Container>
      </Box>
    </div>
  )
);

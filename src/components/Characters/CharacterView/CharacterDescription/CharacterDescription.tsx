import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Checkbox } from 'ui/Checkbox';

import { Icharacter } from 'store/characters';

import { TextLine } from '../../../../ui/TextLine';
import { CharacterViewBox } from '../CharacterViewBox';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal};
  row-gap: ${({ theme }) => theme.rhythms.inside.vertical};
`;

interface CharacterDescriptionsProps extends React.HTMLProps<HTMLDivElement> {
  character: Icharacter;
  isEdit: boolean;
}

export const CharacterDescription: React.FC<CharacterDescriptionsProps> = observer(
  ({ character, className, isEdit = false }) => (
    <div className={className}>
      <CharacterViewBox headline={character.name}>
        <Container>
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
          <TextLine
            isEdit={isEdit}
            label="Size"
            onValueChange={(value) => character.set('size', Number(value))}
            value={character.size.toString()}
          />
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
        </Container>
      </CharacterViewBox>
    </div>
  )
);

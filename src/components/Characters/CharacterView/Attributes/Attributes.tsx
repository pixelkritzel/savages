import React from 'react';
import styled from 'styled-components';

import { Icharacter } from 'store/characters';

import { Dice } from '../Dice';
import { CharacterViewBox } from '../CharacterViewBox';

const StyledBox = styled(CharacterViewBox)`
  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical};
  }
`;

interface AttributesProps extends React.HTMLProps<HTMLDivElement> {
  character: Icharacter;
  isEdit: boolean;
}

export const Attributes: React.FC<AttributesProps> = ({
  character,
  className,
  isEdit,
  ...otherProps
}) => {
  return (
    <div {...otherProps}>
      <StyledBox headline="Attributes">
        <Dice character={character} isEdit={isEdit} trait={character.attributes.agility} />
        <Dice character={character} isEdit={isEdit} trait={character.attributes.smarts} />
        <Dice character={character} isEdit={isEdit} trait={character.attributes.spirit} />
        <Dice character={character} isEdit={isEdit} trait={character.attributes.strength} />
        <Dice character={character} isEdit={isEdit} trait={character.attributes.vigor} />
        <Dice character={character} isEdit={isEdit} trait={character.runningDice} />
      </StyledBox>
    </div>
  );
};

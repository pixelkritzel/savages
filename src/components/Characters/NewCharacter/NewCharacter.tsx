import React, { useContext, useRef } from 'react';
import { CharacterForm } from '../CharacterForm/CharacterForm';
import { StoreContext } from 'components/StoreContext';

export const NewCharacter: React.FC = () => {
  const { characters } = useContext(StoreContext);

  const characterRef = useRef(characters.new());

  return (
    <>
      NewCharacter
      <CharacterForm character={characterRef.current} />
    </>
  );
};

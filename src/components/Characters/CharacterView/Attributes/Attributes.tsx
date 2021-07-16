import React from 'react';
import cx from 'classnames';

import { Icharacter } from 'store/characters';

import { Dice } from '../Dice';

import CSS from './Attributes.module.scss';

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
    <div className={cx(CSS.attributes, className)} {...otherProps}>
      <h3>Attributes</h3>
      <Dice character={character} isEdit={isEdit} trait={character.attributes.agility} />
      <Dice character={character} isEdit={isEdit} trait={character.attributes.smarts} />
      <Dice character={character} isEdit={isEdit} trait={character.attributes.spirit} />
      <Dice character={character} isEdit={isEdit} trait={character.attributes.strength} />
      <Dice character={character} isEdit={isEdit} trait={character.attributes.vigor} />
      <Dice character={character} isEdit={isEdit} trait={character.runningDice} />
    </div>
  );
};

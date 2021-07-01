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
  const { attributes, runningDice } = character;
  return (
    <div className={cx(CSS.attributes, className)} {...otherProps}>
      <h3>Attributes</h3>
      <Dice isEdit={isEdit} trait={attributes.agility} />
      <Dice isEdit={isEdit} trait={attributes.smarts} />
      <Dice isEdit={isEdit} trait={attributes.spirit} />
      <Dice isEdit={isEdit} trait={attributes.strength} />
      <Dice isEdit={isEdit} trait={attributes.vigor} />
      <Dice isEdit={isEdit} trait={runningDice} />
    </div>
  );
};

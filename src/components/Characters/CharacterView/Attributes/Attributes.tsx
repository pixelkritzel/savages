import React from 'react';

import { Icharacter } from 'store/characters';

import { Dice } from '../Dice';

import CSS from './Attributes.module.scss';

export const Attributes: React.FC<{ attributes: Icharacter['attributes']; isEdit: boolean }> = ({
  attributes,
  isEdit,
}) => {
  return (
    <div className={CSS.attributes}>
      <h3>Attributes</h3>
      <Dice isEdit={isEdit} trait={attributes.agility} />
      <Dice isEdit={isEdit} trait={attributes.smarts} />
      <Dice isEdit={isEdit} trait={attributes.spirit} />
      <Dice isEdit={isEdit} trait={attributes.strength} />
      <Dice isEdit={isEdit} trait={attributes.vigor} />
    </div>
  );
};

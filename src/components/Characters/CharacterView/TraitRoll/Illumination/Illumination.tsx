import { observer } from 'mobx-react';

import { RadioGroup } from 'ui/RadioGroup';

import { Itrait } from 'store/characters/traitModel';

interface IlluminationProps {
  trait: Itrait;
}

export const Illumination = observer(function IlluminationFn({
  trait,
  ...otherProps
}: IlluminationProps) {
  return (
    <RadioGroup
      title="Illumination"
      radios={[
        ['0', 'Bright (0)'],
        ['-2', 'Dim (-2)'],
        ['-4', 'Dark (-4)'],
        ['-6', 'Pitch Darkness (-6)'],
      ]}
      selectedValue={trait.options.illumination}
      setSelectedValue={(value: string) =>
        trait.options.set('illumination', value as Itrait['options']['illumination'])
      }
    />
  );
});

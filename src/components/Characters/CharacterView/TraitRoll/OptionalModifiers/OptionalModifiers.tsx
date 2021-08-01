import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { getParent } from 'mobx-state-tree';

import { Checkbox } from 'ui/Checkbox';

import { InfoPopover } from 'components/InfoPopover';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Iskill, isSkill } from 'store/characters/skillModel';
import { Ihindrance } from 'store/settings/settingHindranceModel';
import { IedgeModel } from 'store/settings/settingEdgeModel';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  grid-column-gap: 24px;
  grid-row-gap: 8px;
`;

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 18px;
  grid-row-gap: 6px;
`;

const StyledInfoPopover = styled(InfoPopover)`
  margin-left: 8px;
`;

const SkillSpecialization = styled.div`
  grid-area: 2 / 1 / 2 / 3;

  & input[type='radio'] {
    margin-left: 18px;
  }
`;

interface OptionalModifiersProps {
  currentModifiers: ReturnType<Icharacter['getTraitModifiers']>;
  trait: Itrait;
}

export const OptionalModifiers: React.FC<OptionalModifiersProps> = observer(
  ({ currentModifiers, trait, ...otherProps }) => {
    return (
      <fieldset {...otherProps}>
        <legend>Optional Modifiers</legend>
        <GridContainer>
          <div>
            <h4>Hindrances</h4>
            <TwoColumns>
              {currentModifiers.optionalModifiers.hindrances.map((modifier) => (
                <React.Fragment key={modifier._id}>
                  <Checkbox
                    label={
                      <>
                        <strong>{modifier.name}</strong> {modifier.conditions}
                      </>
                    }
                    checked={modifier.isActive}
                    onChange={() => modifier.set('isActive', !modifier.isActive)}
                  />
                  <StyledInfoPopover
                    content={(getParent(modifier, 2) as Ihindrance).description}
                    title="Hindrance description"
                  />
                </React.Fragment>
              ))}
            </TwoColumns>
          </div>

          <div>
            <h4>Edges</h4>
            <TwoColumns>
              {currentModifiers.optionalModifiers.edges.map((modifier) => (
                <React.Fragment key={modifier._id}>
                  <Checkbox
                    label={
                      <>
                        <strong>{modifier.name}</strong> {modifier.conditions}
                      </>
                    }
                    checked={modifier.isActive}
                    onChange={() => modifier.set('isActive', !modifier.isActive)}
                  />
                  <StyledInfoPopover
                    content={(getParent(modifier, 2) as IedgeModel).description}
                    title="Edge description"
                  />
                </React.Fragment>
              ))}
            </TwoColumns>
          </div>
          {isSkill(trait) && trait.isSkillSpezialized && (
            <SkillSpecialization>
              <strong>Skill specialization</strong>
              <label>
                <input
                  type="radio"
                  name="selected-skill-specialization"
                  checked={trait.selectedSkillSpecialization === null}
                  value=""
                  onChange={() => trait.set('selectedSkillSpecialization', null)}
                />{' '}
                None
              </label>
              {(trait as Iskill).specializations?.map((specialization) => (
                <label key={specialization._id}>
                  <input
                    type="radio"
                    name="selected-skill-specialization"
                    checked={trait.selectedSkillSpecialization === specialization}
                    value={specialization._id}
                    onChange={() => trait.set('selectedSkillSpecialization', specialization)}
                  />{' '}
                  {specialization.name}
                </label>
              ))}
            </SkillSpecialization>
          )}
          <Checkbox
            label="Off Hand Action"
            checked={trait.options.isOffHand}
            onChange={() => trait.options.set('isOffHand', !trait.options.isOffHand)}
          />
        </GridContainer>
      </fieldset>
    );
  }
);

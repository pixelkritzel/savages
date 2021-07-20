import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { getParent } from 'mobx-state-tree';

import { Checkbox } from 'ui/Checkbox';
import { InfoPopover } from 'components/InfoPopover';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Ihindrance } from 'store/settings/settingHindranceModel';
import { IedgeModel } from 'store/settings/settingEdgeModel';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-column-gap: 24px;
  grid-row-gap: 8px;
`;

const WoundsAndFatigue = styled.p`
  grid-area: 1/ 1/ 1/ 2;

  & > *:first-child {
    margin-right: 48px;
  }
`;

const Hindrances = styled.div`
  grid-area: 2 / 1/ 2/ 1;
`;

const Edges = styled.div`
  grid-area: 2 / 2/ 2/ 2;
`;

const StyledInfoPopover = styled(InfoPopover)`
  margin-left: 8px;
`;

interface ActiveModifiersProps {
  currentModifiers: ReturnType<Icharacter['getTraitModifiers']>;
  trait: Itrait;
}

export const ActiveModifiers: React.FC<ActiveModifiersProps> = observer(
  ({ currentModifiers, trait, ...otherProps }) => {
    return (
      <fieldset {...otherProps}>
        <legend>Active Modifiers:</legend>
        <GridContainer>
          <WoundsAndFatigue>
            <span>
              <strong>Wounds:</strong> {-currentModifiers.nonOptionalModifiers.wounds}
            </span>
            <span>
              <strong>Fatigue:</strong> {-currentModifiers.nonOptionalModifiers.fatigue}
            </span>
          </WoundsAndFatigue>
          <Hindrances>
            <h4>Hindrances</h4>
            {currentModifiers.nonOptionalModifiers.hindrances.map((modifier) => (
              <>
                <Checkbox
                  label={
                    <>
                      <strong>{modifier.name}</strong> {modifier.conditions}
                    </>
                  }
                  checked={trait.activeModifiers.has(modifier.id)}
                  onChange={() => trait.toggleActiveModifier(modifier)}
                  key={modifier.id}
                />
                <StyledInfoPopover
                  content={(getParent(modifier, 2) as Ihindrance).description}
                  title="Hindrance description"
                />
              </>
            ))}
          </Hindrances>
          <Edges>
            <h4>Edges</h4>
            {currentModifiers.nonOptionalModifiers.edges.map((modifier) => (
              <>
                <Checkbox
                  label={
                    <>
                      <strong>{modifier.name}</strong> {modifier.conditions}
                    </>
                  }
                  checked={trait.activeModifiers.has(modifier.id)}
                  onChange={() => trait.toggleActiveModifier(modifier)}
                  key={modifier.id}
                />
                <StyledInfoPopover
                  content={(getParent(modifier, 2) as IedgeModel).description}
                  title="Edge description"
                />
              </>
            ))}
          </Edges>
        </GridContainer>
      </fieldset>
    );
  }
);

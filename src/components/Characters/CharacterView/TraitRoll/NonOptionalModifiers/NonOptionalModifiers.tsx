import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/macro';
import { getParent } from 'mobx-state-tree';

import { Checkbox } from 'ui/Checkbox';
import { InfoPopover } from 'components/InfoPopover';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Ihindrance } from 'store/hindrances/hindranceModel';
import { Iedge } from 'store/edges/edgeModel';
import { TwoColumns } from '../OptionalModifiers';

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

interface NonOptionalModifiersProps {
  modifiers: ReturnType<Icharacter['getTraitModifiers']>;
  trait: Itrait;
}

export const NonOptionalModifiers: React.FC<NonOptionalModifiersProps> = observer(
  ({ modifiers, trait, ...otherProps }) => {
    return (
      <fieldset {...otherProps}>
        <legend>Active Modifiers:</legend>
        <GridContainer>
          <WoundsAndFatigue>
            <span>
              <strong>Wounds:</strong> {-modifiers.nonOptionalModifiers.wounds}
            </span>
            <span>
              <strong>Fatigue:</strong> {-modifiers.nonOptionalModifiers.fatigue}
            </span>
          </WoundsAndFatigue>
          <Hindrances>
            <h4>Hindrances</h4>
            <TwoColumns>
              {modifiers.nonOptionalModifiers.hindrances.map((modifier) => (
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
          </Hindrances>
          <Edges>
            <h4>Edges</h4>
            <TwoColumns>
              {modifiers.nonOptionalModifiers.edges.map((modifier) => (
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
                    content={(getParent(modifier, 2) as Iedge).description}
                    title="Edge description"
                  />
                </React.Fragment>
              ))}
            </TwoColumns>
          </Edges>
        </GridContainer>
      </fieldset>
    );
  }
);

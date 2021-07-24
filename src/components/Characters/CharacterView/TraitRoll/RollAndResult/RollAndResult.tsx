import { useMemo } from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';

import { Icharacter } from 'store/characters';
import { Itrait, TraitRollResult } from 'store/characters/traitModel';

import { padWithMathOperator } from 'utils/padWithMathOpertor';
import { isAttackSkill, isSkill } from 'store/characters/skillModel';

type ResultProps = {
  character: Icharacter;
  isTraitRollable: boolean;
  rollConfiguration: Parameters<Itrait['roll']>[0];
  trait: Itrait;
};

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 12px;
  margin-top: 12px;
`;

const RollsList = styled.ul`
  list-style: 'none';
`;

export const RollAndResult = observer(function ResultFn({
  character,
  isTraitRollable,
  rollConfiguration,
  trait,
  ...otherProps
}: ResultProps) {
  const isFreeRerollPossible = useMemo(
    () =>
      character
        .getModifiersByField('freeReroll')
        .filter(({ freeReroll }) => freeReroll === trait.id).length > 0,
    [character, trait]
  );

  const rerollBonus = useMemo(() => {
    const rerollBoni = character
      .getModifiersByField('rerollBonus')
      .map(({ rerollBonus }) => rerollBonus);
    return rerollBoni.length > 0 ? Math.max(...rerollBoni) : 0;
  }, [character]);

  type ResultStoreResultType = ReturnType<Itrait['roll']> & { damages: number[] };

  const resultStore = useLocalStore<{
    results: ResultStoreResultType[];
    isFreeRerollUsed: boolean;
  }>(() => ({
    results: [],
    isFreeRerollUsed: false,
  }));

  const isAttack = useMemo(() => isSkill(trait) && isAttackSkill(trait), [trait]);

  const isRerollPossible =
    resultStore.results.length > 0 &&
    resultStore.results[resultStore.results.length - 1].type !== 'critical_failure' &&
    (character.bennies > 0 || (isFreeRerollPossible && !resultStore.isFreeRerollUsed));

  const rollDice = action((additionalBonus = 0) => {
    const traitRollResult: ResultStoreResultType = {
      ...trait.roll({ ...rollConfiguration, bonus: rollConfiguration.bonus + additionalBonus }),
      damages: [],
    };
    if (traitRollResult.type === 'result') {
      for (const roll of traitRollResult.rolls) {
        traitRollResult.damages.push(
          roll.success
            ? character.currentlyHoldWeapon.damage.roll({
                isRaise: roll.raises > 0,
                strength: character.attributes.strength,
              })
            : 0
        );
      }
    }
    resultStore.results.push(traitRollResult);
  });

  const rerollDice = action(() => {
    if (isFreeRerollPossible && !resultStore.isFreeRerollUsed) {
      resultStore.isFreeRerollUsed = true;
      rollDice();
    } else if (character.bennies > 0) {
      character.set('bennies', character.bennies - 1);
      rollDice(rerollBonus);
    }
  });

  function RollDisplay({
    roll,
    damage,
  }: {
    roll: TraitRollResult['rolls'][number];
    damage: number;
  }) {
    return (
      <>
        {roll.success ? '✅ - SUCCESS' : `🚫 - FAILURE`} ({roll.diceRoll}){' '}
        {roll.raises ? ` - Raises x ${roll.raises}` : ''}
        {roll.success &&
          isAttack &&
          ` - DMG: ${damage} AP ${character.currentlyHoldWeapon.armorPiercing}`}
      </>
    );
  }

  return (
    <div>
      {resultStore.results.length === 0 && (
        <Button disabled={isTraitRollable} onClick={() => rollDice()}>
          {`Roll: D${trait.getModifiedDice(rollConfiguration.diceDifference)} ${
            trait.getModifiedBonus(rollConfiguration.bonus) !== 0
              ? padWithMathOperator(trait.getModifiedBonus(rollConfiguration.bonus))
              : ''
          }`}
        </Button>
      )}
      {resultStore.results.length > 0 && (
        <>
          <Button disabled={!isRerollPossible} onClick={rerollDice}>
            {isRerollPossible
              ? isFreeRerollPossible && !resultStore.isFreeRerollUsed
                ? 'Use your free reroll'
                : `Spend a benny to reroll ${rerollBonus > 0 ? `(Bonus: +${rerollBonus})` : ''}`
              : 'Sorry, no reroll is possible'}
          </Button>
          <ResultsContainer>
            {resultStore.results.map((result, index) => {
              if (result.type === 'critical_failure') {
                return (
                  <Box key={index} title="Result" type={result.type} {...otherProps}>
                    ☠️ ☠️ ☠️ CRITICAL FAILURE ☠️ ☠️ ☠️
                  </Box>
                );
              } else if (result.rolls.length === 1) {
                return (
                  <Box
                    key={index}
                    title="Result"
                    type={result.rolls[0].success ? 'success' : 'failure'}
                    {...otherProps}
                  >
                    <RollDisplay roll={result.rolls[0]} damage={result.damages[0]} />
                  </Box>
                );
              } else {
                return (
                  <Box
                    key={index}
                    title="Result"
                    type={result.rolls.some(({ success }) => success) ? 'success' : 'failure'}
                    {...otherProps}
                  >
                    Rolls:
                    <RollsList>
                      {result.rolls.map((roll, index) => (
                        <li key={index}>
                          <RollDisplay roll={roll} damage={result.damages[index]} />
                        </li>
                      ))}
                    </RollsList>
                  </Box>
                );
              }
            })}
          </ResultsContainer>
        </>
      )}
    </div>
  );
});

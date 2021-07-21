import { useMemo } from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';

type ResultProps = {
  character: Icharacter;
  trait: Itrait;
  result: ReturnType<Itrait['roll']>;
  rollConfiguration: Parameters<Itrait['roll']>[0];
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

export const Result = observer(function ResultFn({
  character,
  result,
  trait,
  rollConfiguration,
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

  const resultStore = useLocalStore(() => ({
    results: [result],
    isFreeRerollUsed: false,
  }));

  const isRerollPossible =
    resultStore.results[resultStore.results.length - 1].type !== 'critical_failure' &&
    (character.bennies > 0 || (isFreeRerollPossible && !resultStore.isFreeRerollUsed));

  const reroll = action(() => {
    if (isFreeRerollPossible && !resultStore.isFreeRerollUsed) {
      resultStore.isFreeRerollUsed = true;
      resultStore.results.push(trait.roll(rollConfiguration));
    } else if (character.bennies > 0) {
      character.set('bennies', character.bennies - 1);
      resultStore.results.push(
        trait.roll({ ...rollConfiguration, bonus: rollConfiguration.bonus + rerollBonus })
      );
    }
  });

  return (
    <div>
      <Button disabled={!isRerollPossible} onClick={reroll}>
        {isRerollPossible
          ? isFreeRerollPossible && !resultStore.isFreeRerollUsed
            ? 'Use your free reroll'
            : `Spend a benny to reroll ${rerollBonus > 0 ? `(Bonus: +${rerollBonus})` : ''}`
          : 'Sorry, no reroll is possible'}
      </Button>
      <ResultsContainer>
        {resultStore.results.map((result) => {
          if (result.type === 'critical_failure') {
            return (
              <Box title="Result" type={result.type} {...otherProps}>
                CRITICAL FAILURE
              </Box>
            );
          } else if (result.rolls.length === 1) {
            return (
              <Box
                title="Result"
                type={result.rolls[0].success ? 'success' : 'failure'}
                {...otherProps}
              >
                {result.rolls[0].success ? 'SUCCESS' : `FAILURE`} ({result.rolls[0].diceRoll}){' '}
                {result.rolls[0].raises ? ` - Raises x ${result.rolls[0].raises}` : ''}
              </Box>
            );
          } else {
            return (
              <Box
                title="Result"
                type={result.rolls.some(({ success }) => success) ? 'success' : 'failure'}
                {...otherProps}
              >
                Rolls:
                <RollsList>
                  {result.rolls.map(({ diceRoll, success, raises }, index) => (
                    <li key={index}>
                      {success
                        ? `✅ - SUCCESS (${diceRoll}) ${raises ? ` - Raises x ${raises}` : ''}`
                        : `🚫 - FAILURE (${diceRoll})`}
                    </li>
                  ))}
                </RollsList>
              </Box>
            );
          }
        })}
      </ResultsContainer>
    </div>
  );
});

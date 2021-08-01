import { useMemo } from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';

import { Icharacter } from 'store/characters';
import { Itrait, TraitRollResult } from 'store/characters/traitModel';

import { padWithMathOperator } from 'utils/padWithMathOpertor';
import { isAttackSkill, isShooting, isSkill } from 'store/characters/skillModel';
import { Idamage } from 'store/settings/damageModel';

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 12px;
  margin-top: 12px;
`;

const TraitRollButton = styled(Button)`
  margin-right: 18px;
  margin-bottom: 6px;
`;

const RollsList = styled.ul`
  list-style: 'none';
`;

const RollDisplayGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 18px;
  grid-row-gap: 6px;
`;

const DamageAndReroll = styled.div`
  display: flex;
  justify-content: space-between;
`;

type ResultProps = {
  character: Icharacter;
  isTraitRollable: boolean;
  rollConfiguration: Parameters<Itrait['roll']>[0];
  trait: Itrait;
};

export const RollAndResult = observer(function ResultFn({
  character,
  isTraitRollable,
  rollConfiguration,
  trait,
  ...otherProps
}: ResultProps) {
  const isFreeRerollPossible =
    character
      .getModifiersByField('freeReroll')
      .filter(({ freeReroll }) => freeReroll === trait._id || freeReroll === 'all').length > 0;

  const rerollBonus = useMemo(() => {
    const rerollBoni = character
      .getModifiersByField('rerollBonus')
      .map(({ rerollBonus }) => rerollBonus);
    return rerollBoni.length > 0 ? Math.max(...rerollBoni) : 0;
  }, [character]);

  const rerollDamageBonus = useMemo(() => {
    const rerollBoni = character
      .getModifiersByField('rerollDamageBonus')
      .map(({ rerollBonus }) => rerollBonus);
    return rerollBoni.length > 0 ? Math.max(...rerollBoni) : 0;
  }, [character]);

  type ResultStoreResultType = ReturnType<Itrait['roll']> & {
    damages: { damageRollConfiguration: Parameters<Idamage['roll']>[0]; rolls: number[][] }[];
  };

  const resultStore = useLocalStore<{
    results: ResultStoreResultType[];
    isFreeRerollUsed: boolean;
  }>(() => ({
    results: [],
    damages: [],
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
    if (isSkill(trait) && isShooting(trait) && resultStore.results.length === 0) {
      character.currentlyHoldWeapon.shoot({
        rateOfFire: trait.skillOptions.rateOfFire,
        isThreeRoundBurst: trait.skillOptions.isThreeRoundBurst,
      });
    }
    if (traitRollResult.type === 'result') {
      for (const roll of traitRollResult.rolls) {
        const damageRollConfiguration: Parameters<Idamage['roll']>[0] = {
          isRaise: roll.raises > 0,
          strength: character.attributes.strength,
          bonus: isSkill(trait) ? trait.bonusDamage : 0,
          bonusDices: isSkill(trait) ? trait.bonusDamageDices : [],
          isJoker: trait.options.isJoker,
        };
        traitRollResult.damages.push({
          damageRollConfiguration,
          rolls: [
            [roll.success ? character.currentlyHoldWeapon.damage.roll(damageRollConfiguration) : 0],
          ],
        });
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
    damage: ResultStoreResultType['damages'][number];
  }) {
    return (
      <RollDisplayGrid>
        <div>{roll.success ? '✅ ' : `🚫 `}</div>
        <div>
          <div>
            {roll.success ? 'SUCCESS' : `FAILURE`} {roll.diceRoll}{' '}
            {roll.raises ? ` - Raises x ${roll.raises}` : ''}
          </div>
          {roll.success &&
            isAttack &&
            damage.rolls.map((rolls, index) => (
              <DamageAndReroll key={index}>
                {`DMG: ${rolls.join(' | ')} AP ${character.currentlyHoldWeapon.armorPiercing}`}{' '}
                {roll.success && (
                  <Button
                    disabled={character.bennies < 1}
                    onClick={() => {
                      character.set('bennies', character.bennies - 1);
                      damage.rolls[index].push(
                        character.currentlyHoldWeapon.damage.roll({
                          ...damage.damageRollConfiguration,
                          bonus: (damage.damageRollConfiguration.bonus ?? 0) + rerollDamageBonus,
                        })
                      );
                    }}
                  >
                    Reroll Damage
                  </Button>
                )}
              </DamageAndReroll>
            ))}
        </div>
      </RollDisplayGrid>
    );
  }

  return (
    <div>
      {resultStore.results.length === 0 && (
        <TraitRollButton disabled={!isTraitRollable} onClick={() => rollDice()}>
          {`Roll: D${trait.getModifiedDice(rollConfiguration.diceDifference)} ${
            trait.getModifiedBonus(rollConfiguration.bonus) !== 0
              ? padWithMathOperator(trait.getModifiedBonus(rollConfiguration.bonus))
              : ''
          }`}
        </TraitRollButton>
      )}
      {resultStore.results.length > 0 && (
        <>
          <TraitRollButton disabled={!isRerollPossible} onClick={rerollDice}>
            {isRerollPossible
              ? isFreeRerollPossible && !resultStore.isFreeRerollUsed
                ? 'Use your free reroll'
                : `Spend a benny to reroll ${rerollBonus > 0 ? `(Bonus: +${rerollBonus})` : ''}`
              : 'Sorry, no reroll is possible'}
          </TraitRollButton>
          Remaining Bennies: {character.bennies}
          <ResultsContainer>
            {resultStore.results.map((result, index) => {
              if (result.type === 'critical_failure') {
                return (
                  <Box key={index} title="Result" type="danger" {...otherProps}>
                    ☠️ ☠️ ☠️ CRITICAL FAILURE ☠️ ☠️ ☠️
                  </Box>
                );
              } else if (result.rolls.length === 1) {
                return (
                  <Box
                    key={index}
                    title="Result"
                    type={result.rolls[0].success ? 'success' : 'warning'}
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
                    type={result.rolls.some(({ success }) => success) ? 'success' : 'warning'}
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

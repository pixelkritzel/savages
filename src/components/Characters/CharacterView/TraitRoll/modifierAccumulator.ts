export type ModifierAccumulator = {
  diceDifferences: { [reason: string]: number };
  boni: { [reason: string]: number };
};

export function createModifierAccumulator(): ModifierAccumulator {
  return {
    diceDifferences: {} as ModifierAccumulator['diceDifferences'],
    boni: { joker: 0, skillSpecialization: 0, wounds: 0, fatigue: 0, numberOfActions: 0 },
  };
}

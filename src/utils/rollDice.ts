export function rollDice(sides: number) {
  let result = Math.ceil(Math.random() / (1 / sides));
  if (result === sides) {
    result = result + rollDice(sides);
  }
  return result;
}

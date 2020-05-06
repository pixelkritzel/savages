export function capitalizeFirstLetter(str: string) {
  return str
    .split('')
    .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
    .join('');
}

export function capitalizeFirstLetter(str: string) {
  return str.length > 1 ? str[0].toUpperCase() + str.slice(1) : '';
}

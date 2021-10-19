export function setIsSliderOpen(value: boolean) {
  return { type: 'setIsSliderOpen' as const, data: value };
}

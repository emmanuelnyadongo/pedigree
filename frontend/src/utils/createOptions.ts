export function createOptions(options: any[]) {
  return options.map((option: any) => ({
    label: option.name,
    value: option.id,
  }));
}

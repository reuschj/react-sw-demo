export const splitCommaSeparatedList = (input: string, splitBy = ", "): string[] => input.split(splitBy);

export const convertToNumber = (numericDescription: string): number | undefined => {
  const numeric = Number.parseFloat(numericDescription.split(",").join(""));
  return !Number.isNaN(numeric) ? numeric : undefined;
}
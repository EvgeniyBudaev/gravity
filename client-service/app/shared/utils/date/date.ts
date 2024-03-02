import isNil from "lodash/isNil";

const isISO8601 = (str: string) => {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return pattern.test(str);
};

export const formattedDate = (value?: Date | null): string | undefined => {
  if (isNil(value)) return undefined;
  return isISO8601(value.toString()) ? value.toString() : value.toISOString();
};

export const formatToStringWithPx = (value: string | number): string => {
  if (typeof value === "string") return value;
  return value.toString() + "px";
};

export const formatToCapitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatInitialUserName = (value: string): string => {
  return value[0].toUpperCase();
};

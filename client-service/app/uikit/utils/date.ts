import dayjs from "dayjs";

export const getFullYear = (date?: string): string => {
  return date ? dayjs().diff(dayjs(date), "year").toString() : "--";
};

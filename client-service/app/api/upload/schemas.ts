import z from "zod";
import { MAX_FILE_AMOUNT, MAX_FILE_SIZE } from "@/app/api/upload/constants";
import { TFieldValue, TFilesArgs } from "@/app/api/upload/types";
import type { TFile } from "@/app/shared/types/file";
import {
  EMPTY_FIELD_ERROR_MESSAGE,
  FILE_MAX_AMOUNT_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
} from "@/app/shared/validation";

export const fileSchema = z.custom<TFieldValue>();

export const filesSchema = ({ isEmpty }: TFilesArgs = {}) =>
  z
    .array(fileSchema, { required_error: EMPTY_FIELD_ERROR_MESSAGE })
    .refine((files) => (isEmpty ? true : !!files.length), {
      message: EMPTY_FIELD_ERROR_MESSAGE,
    })
    .refine((files) => files.length <= MAX_FILE_AMOUNT, {
      message: FILE_MAX_AMOUNT_MESSAGE,
    })
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: FILE_MAX_SIZE_MESSAGE,
    });

export const imageFileSchema = z
  .union([fileSchema, z.array(fileSchema)])
  .refine(
    (files) => {
      if (!Array.isArray(files)) {
        return files !== undefined && files !== null;
      }
      return true;
    },
    {
      message: EMPTY_FIELD_ERROR_MESSAGE,
    },
  )
  .refine(
    (files) => {
      if (Array.isArray(files)) {
        return (
          files.length > 0 &&
          files.every((file: TFile) => file.size > MAX_FILE_SIZE)
        );
      }
      return true;
    },
    {
      message: FILE_MAX_SIZE_MESSAGE,
    },
  )
  .refine(
    (files) => {
      if (Array.isArray(files)) {
        return files.length <= MAX_FILE_AMOUNT;
      }
      return true;
    },
    {
      message: FILE_MAX_AMOUNT_MESSAGE,
    },
  );

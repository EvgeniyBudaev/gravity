"use client";

import { useCallback, useState } from "react";
import type { FC, ReactElement } from "react";
import type { DropEvent, FileRejection } from "react-dropzone";
import type { TImage } from "@/app/api/profile/image";
import { Previews } from "@/app/shared/components/form/fileUploader/previews";
import {
  filterDuplicatedFiles,
  getTypes,
} from "@/app/shared/components/form/fileUploader/utils";
import type { TFile } from "@/app/shared/types/file";
import { type TDropzoneProps } from "@/app/uikit/components/dropzone/Dropzone";
// import {ETypographyVariant, Typography} from "@/app/uikit/components/typography";
import "./FileUploader.scss";

export type TFileUploaderProps = {
  defaultImages?: TImage[];
  files?: TFile[];
  Input?: ReactElement;
  isLoading?: boolean;
  lng: string;
  maxFiles?: number;
  onAddFile?: (file: File) => void;
  onAddFiles?: (acceptedFiles: TFile[], files: TFile[]) => void;
  onDeleteFile?: (deletedFile: TFile, files: TFile[]) => void;
  type: string;
} & TDropzoneProps;

export const FileUploader: FC<TFileUploaderProps> = ({
  accept,
  defaultImages,
  files,
  Input,
  isLoading,
  lng,
  maxFiles,
  onAddFile,
  onAddFiles,
  onDeleteFile,
  ...rest
}) => {
  // const {t} = useTranslation("index");
  const types = getTypes(accept);
  const [countFiles, setCountFiles] = useState(1);

  const onDrop = useCallback(
    (addedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
      if (maxFiles && countFiles > maxFiles) return;
      const { acceptedFiles, newFiles } = filterDuplicatedFiles(
        addedFiles,
        files,
      );
      onAddFiles?.(acceptedFiles, newFiles);
      setCountFiles((prevState) => prevState + 1);
    },
    [countFiles, files, maxFiles, onAddFiles],
  );

  const onDelete = useCallback(
    (deletedFile: TFile) => {
      if (files) {
        let newFiles = [...files];
        newFiles = newFiles.filter((file) => file !== deletedFile);
        onDeleteFile?.(deletedFile, newFiles);
        setCountFiles((prevState) => prevState - 1);
      }
    },
    [onDeleteFile, files],
  );

  // useEffect(() => {
  //   if (isNil(files)) return;
  //   // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
  //   return () =>
  //     files.forEach((file) => (file?.preview ? URL.revokeObjectURL(file.preview) : file));
  // }, [files]);

  const handleLoadImage = (file: TFile) => {
    return file?.preview ? URL.revokeObjectURL(file.preview) : file;
  };

  return (
    <div className="FileUploader">
      <Previews
        accept={accept}
        className="FileUploader-Previews"
        defaultImages={defaultImages}
        files={files}
        isLoading={isLoading}
        lng={lng}
        onAddFile={onAddFile}
        onDeleteFile={onDelete}
        onDrop={onDrop}
        onLoad={handleLoadImage}
        {...rest}
      />
    </div>
  );
};

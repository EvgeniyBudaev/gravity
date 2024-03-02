"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import Image from "next/image";
import type { FC } from "react";
import type { Accept, DropEvent, FileRejection } from "react-dropzone";
import { useTranslation } from "@/app/i18n/client";
import type { TFile } from "@/app/shared/types/file";
import { DropDown } from "@/app/uikit/components/dropDown";
import { Dropzone } from "@/app/uikit/components/dropzone";
import type { TDropzoneProps } from "@/app/uikit/components/dropzone/Dropzone";
import { Icon } from "@/app/uikit/components/icon";
import "./Previews.scss";
import type { TImage } from "@/app/api/profile/image";
import { ImageList } from "@/app/shared/components/form/fileUploader/previews/imageList";

type TProps = {
  accept?: Accept;
  className?: string;
  defaultImages?: TImage[];
  files?: TFile[];
  isLoading?: boolean;
  lng: string;
  onAddFile?: (file: TFile) => void;
  onDeleteFile?: (file: TFile) => void;
  onDrop?: (
    addedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  onLoad?: (file: TFile) => void;
} & TDropzoneProps;

export const Previews: FC<TProps> = ({
  accept,
  className,
  defaultImages,
  files,
  isLoading,
  lng,
  onAddFile,
  onDeleteFile,
  onDrop,
  onLoad,
  ...rest
}) => {
  const { t } = useTranslation("index");

  const renderDefaultImages = !isNil(defaultImages) && (
    <ImageList defaultImages={defaultImages} lng={lng} />
  );

  const renderThumbs =
    !isNil(files) &&
    files.map((file) => (
      <div
        className="Previews-Thumb"
        key={file?.name || "" + file?.lastModified}
      >
        <div className="Previews-Thumb-Inner">
          {!isNil(file.preview) && (
            <DropDown>
              <DropDown.Button>
                <Image
                  alt={file.name}
                  className="Previews-Thumb-Image"
                  fill={true}
                  priority={true}
                  sizes="100vw"
                  src={file.preview}
                  quality={100}
                />
              </DropDown.Button>
              <DropDown.Panel>
                <div className="DropDown-Menu">
                  <div
                    className="DropDown-MenuItem"
                    onClick={() => onDeleteFile?.(file)}
                  >
                    {t("common.actions.delete")}
                  </div>
                </div>
                <div className="DropDown-Menu">
                  <div className="DropDown-MenuItem DropDown-MenuItem-Cancel">
                    {t("common.actions.cancel")}
                  </div>
                </div>
              </DropDown.Panel>
            </DropDown>
          )}
        </div>
      </div>
    ));

  return (
    <aside className={clsx("Previews", className)}>
      {renderDefaultImages}
      {renderThumbs}
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        disabled={isLoading}
        className={clsx("FileUploader-Dropzone", {
          ["FileUploader-Dropzone__isLoading"]: isLoading,
        })}
        {...rest}
      >
        <Icon type="AddCircleOutline" />
      </Dropzone>
    </aside>
  );
};

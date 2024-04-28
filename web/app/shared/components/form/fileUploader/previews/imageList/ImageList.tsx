"use client";

import Image from "next/image";
import { type FC } from "react";
import { deleteImageAction } from "@/app/actions/profile/deleteImage/deleteImageAction";
import type { TImage } from "@/app/api/profile/image";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/shared/components/form/fileUploader/previews/imageList/enums";
import { useNavigator, useProxyUrl } from "@/app/shared/hooks";
import { DropDown } from "@/app/uikit/components/dropDown";

type TProps = {
  defaultImages: TImage[];
  lng: string;
};

export const ImageList: FC<TProps> = ({ defaultImages, lng }) => {
  const navigator = useNavigator({ lng });
  const { proxyUrl } = useProxyUrl();
  const { t } = useTranslation("index");

  const handleDeleteImage = async (image: TImage) => {
    const formDataDto = new FormData();
    formDataDto.append(EFormFields.Id, image.id.toString());
    formDataDto.append(EFormFields.ProfileId, image.profileId.toString());
    formDataDto.append("latitude", navigator?.latitude?.toString() ?? "");
    formDataDto.append("longitude", navigator?.longitude?.toString() ?? "");
    await deleteImageAction({}, formDataDto);
  };

  return (
    <>
      {defaultImages.map((image) => (
        <div className="Previews-Thumb" key={image.id}>
          <div className="Previews-Thumb-Inner">
            <DropDown>
              <DropDown.Button>
                <Image
                  alt={image.name}
                  className="Previews-Thumb-Image"
                  fill={true}
                  priority={true}
                  sizes="100vw"
                  src={`${proxyUrl}${image.url}`}
                  quality={100}
                />
              </DropDown.Button>
              <DropDown.Panel>
                <div className="DropDown-Menu">
                  <div
                    className="DropDown-MenuItem"
                    onClick={() => handleDeleteImage(image)}
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
          </div>
        </div>
      ))}
    </>
  );
};

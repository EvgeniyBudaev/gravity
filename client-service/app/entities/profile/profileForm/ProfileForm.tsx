"use client";

import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { type FC, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { addProfileAction } from "@/app/actions/profile/add/addProfileAction";
import { editProfileAction } from "@/app/actions/profile/edit/editProfileAction";
import { ProfileSkeletonForm } from "@/app/entities/profile/profileForm/profileSkeletonForm";
import type { TProfile } from "@/app/api/profile/add";
import { useTranslation } from "@/app/i18n/client";
import { EProfileAddFormFields } from "@/app/pages/profileAddPage/enums";
import { Container } from "@/app/shared/components/container";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { Field } from "@/app/shared/components/form/field";
import { FileUploader } from "@/app/shared/components/form/fileUploader";
import { PhoneInputMask } from "@/app/shared/components/form/phoneInputMask";
import { Header } from "@/app/shared/components/header";
import { Section } from "@/app/shared/components/section";
import { SidebarContent } from "@/app/shared/components/sidebarContent";
import { DEFAULT_DISTANCE } from "@/app/shared/constants/distance";
import {
  DEFAULT_AGE_FROM,
  DEFAULT_AGE_TO,
} from "@/app/shared/constants/filter";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/app/shared/constants/pagination";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import { ELookingFor, ESearchGender } from "@/app/shared/enums/form";
import {
  useFiles,
  useNavigator,
  useSessionNext,
  useTelegram,
} from "@/app/shared/hooks";
import { GENDER_MAPPING } from "@/app/shared/mapping/gender";
import { LANGUAGE_MAPPING } from "@/app/shared/mapping/language";
import { LOOKING_FOR_MAPPING } from "@/app/shared/mapping/lookingFor";
import { SEARCH_GENDER_MAPPING } from "@/app/shared/mapping/searchGender";
import type { TFile } from "@/app/shared/types/file";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";
import { formattedDate } from "@/app/shared/utils/date";
import { normalizePhoneNumber } from "@/app/shared/utils/form/normalizePhoneNumber";
import { Error } from "@/app/uikit/components/error";
import { Input } from "@/app/uikit/components/input";
import { InputDateField } from "@/app/uikit/components/inputDateField";
import { Select, type TSelectOption } from "@/app/uikit/components/select";
import { Textarea } from "@/app/uikit/components/textarea";
import "./ProfileForm.scss";
import { EProfileEditFormFields } from "@/app/pages/profileEditPage/enums";

type TProps = {
  isEdit?: boolean;
  lng: string;
  profile?: TProfile;
};

export const ProfileForm: FC<TProps> = ({ isEdit, lng, profile }) => {
  const [state, formAction] = useFormState(
    isEdit ? editProfileAction : addProfileAction,
    INITIAL_FORM_STATE,
  );
  const { data: session } = useSessionNext();
  const keycloakSession = session as TSession;
  const buttonSubmitRef = useRef<HTMLInputElement>(null);
  const navigator = useNavigator({ lng });
  const { queryId, user } = useTelegram();
  const { i18n, t } = useTranslation("index");
  const language = lng as ELanguage;
  const location = isEdit
    ? profile?.location ?? undefined
    : navigator?.location ?? undefined;
  const genderDefault = isEdit
    ? GENDER_MAPPING[language].find((item) => item.value === profile?.gender)
    : undefined;
  const searchGenderDefault = isEdit
    ? SEARCH_GENDER_MAPPING[language].find(
        (item) => item.value === profile?.filters?.searchGender,
      )
    : undefined;
  const lookingForDefault = isEdit
    ? LOOKING_FOR_MAPPING[language].find(
        (item) => item.value === profile?.filters?.lookingFor,
      )
    : undefined;
  const [gender, setGender] = useState<TSelectOption | undefined>(
    genderDefault,
  );
  const [searchGender, setSearchGender] = useState<TSelectOption | undefined>(
    searchGenderDefault,
  );
  const [lookingFor, setLookingFor] = useState<TSelectOption | undefined>(
    lookingForDefault,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState({
    isGender: false,
    isSearchGender: false,
    isLookingFor: false,
  });
  const [valueInputDateField, setValueInputDateField] = useState<Date | null>(
    isEdit ? (profile?.birthday as Date | undefined) ?? null : null,
  );
  const [files, setFiles] = useState<TFile[] | null>(null);
  const page = isEdit
    ? profile?.filters?.page?.toString() ?? DEFAULT_PAGE.toString()
    : DEFAULT_PAGE.toString();
  const size = isEdit
    ? profile?.filters?.size?.toString() ?? DEFAULT_PAGE_SIZE.toString()
    : DEFAULT_PAGE_SIZE.toString();
  const ageFrom = isEdit
    ? profile?.filters?.ageFrom?.toString() ?? DEFAULT_AGE_FROM.toString()
    : DEFAULT_AGE_FROM.toString();
  const ageTo = isEdit
    ? profile?.filters?.ageTo?.toString() ?? DEFAULT_AGE_TO.toString()
    : DEFAULT_AGE_TO.toString();
  const distance = isEdit
    ? profile?.filters?.distance?.toString() ?? DEFAULT_DISTANCE.toString()
    : DEFAULT_DISTANCE.toString();
  const firstName = isEdit
    ? keycloakSession?.user?.firstName ?? user?.first_name
    : user?.first_name ?? undefined;
  const lastName = isEdit
    ? keycloakSession?.user?.lastName ?? user?.last_name
    : user?.last_name ?? undefined;
  const latitude = navigator?.latitude?.toString() ?? "";
  const longitude = navigator?.longitude?.toString() ?? "";

  const { onAddFiles, onDeleteFile } = useFiles({
    fieldName: EProfileAddFormFields.Image,
    files: files ?? [],
    setValue: (_fieldName: string, files: TFile[]) => setFiles(files),
  });

  useEffect(() => {
    if (isEdit && keycloakSession?.user.id !== profile?.sessionId) {
      const path = createPath({
        route: ERoutes.Login,
      });
      redirect(path);
    }
    if (isEdit && !isNil(profile)) {
      if (!isNil(state?.data) && state.success && !state?.error) {
        const path = createPath({
          route: ERoutes.Profile,
          params: { id: state.data.id },
        });
        redirect(path);
      }
    } else {
      if (!isNil(state?.data) && state.success && !state?.error) {
        const path = createPath({
          route: ERoutes.Login,
        });
        redirect(path);
      }
    }
  }, [isEdit, keycloakSession?.user.id, profile, state]);

  const handleDeleteFile = (file: TFile, files: TFile[]) => {
    onDeleteFile?.(file, files);
  };

  const handleDateChange = (date: Date | null) => {
    setValueInputDateField?.(date);
  };

  const handleClickSave = () => {
    buttonSubmitRef.current && buttonSubmitRef.current.click();
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen({
      isGender: false,
      isSearchGender: false,
      isLookingFor: false,
    });
  };

  const handleChangeGender = (value?: TSelectOption) => {
    if (value) {
      value && setGender(value);
      handleCloseSidebar();
    }
  };

  const handleChangeSearchGender = (value?: TSelectOption) => {
    if (value) {
      value && setSearchGender(value);
      handleCloseSidebar();
    }
  };

  const handleChangeLookingFor = (value?: TSelectOption) => {
    if (value) {
      value && setLookingFor(value);
      handleCloseSidebar();
    }
  };

  const handleSubmit = (formData: FormData) => {
    const formDataDto = new FormData();
    const displayName = formData.get(EProfileAddFormFields.DisplayName);
    const mobileNumber = formData.get(EProfileAddFormFields.MobileNumber);
    const mobileNumberNormalized = normalizePhoneNumber(
      (mobileNumber ?? "").toString(),
    );
    const password = formData.get(EProfileAddFormFields.Password);
    const passwordConfirm = formData.get(EProfileAddFormFields.PasswordConfirm);
    const description = formData.get(EProfileAddFormFields.Description);
    const height = formData.get(EProfileAddFormFields.Height);
    const weight = formData.get(EProfileAddFormFields.Weight);
    formDataDto.append(
      EProfileAddFormFields.DisplayName,
      (displayName ?? "").toString(),
    );
    formDataDto.append(EProfileAddFormFields.Username, mobileNumberNormalized);
    formDataDto.append(EProfileAddFormFields.Email, "");
    formDataDto.append(
      EProfileAddFormFields.MobileNumber,
      mobileNumberNormalized,
    );
    formDataDto.append(
      EProfileAddFormFields.Description,
      (description ?? "").toString(),
    );
    formDataDto.append(
      EProfileAddFormFields.Location,
      (location ?? "").toString(),
    );
    formDataDto.append(EProfileAddFormFields.Height, (height ?? "").toString());
    formDataDto.append(EProfileAddFormFields.Weight, (weight ?? "").toString());
    (files ?? []).forEach((file) => {
      formDataDto.append(EProfileAddFormFields.Image, file);
    });
    const utcDate = formattedDate(valueInputDateField);
    formDataDto.append(EProfileAddFormFields.Birthday, utcDate ?? "");
    formDataDto.append(
      EProfileAddFormFields.Gender,
      gender?.value.toString() ?? "",
    );
    formDataDto.append(
      EProfileAddFormFields.SearchGender,
      searchGender?.value.toString() ?? ESearchGender.All,
    );
    formDataDto.append(
      EProfileAddFormFields.LookingFor,
      lookingFor?.value.toString() ?? ELookingFor.All,
    );
    formDataDto.append(
      EProfileAddFormFields.TelegramID,
      user?.id.toString() ?? "2",
    );
    formDataDto.append(
      EProfileAddFormFields.TelegramUsername,
      user?.username?.toString() ?? "b",
    );
    formDataDto.append(EProfileAddFormFields.FirstName, firstName ?? "b");
    formDataDto.append(EProfileAddFormFields.LastName, lastName ?? "b");
    formDataDto.append(EProfileAddFormFields.QueryId, queryId ?? "2");
    formDataDto.append(
      EProfileAddFormFields.LanguageCode,
      user?.language_code ?? "ru",
    );
    formDataDto.append(
      EProfileAddFormFields.AllowsWriteToPm,
      user?.allows_write_to_pm?.toString() ?? "true",
    );
    formDataDto.append(EProfileAddFormFields.Latitude, latitude);
    formDataDto.append(EProfileAddFormFields.Longitude, longitude);
    formDataDto.append(EProfileAddFormFields.AgeFrom, ageFrom);
    formDataDto.append(EProfileAddFormFields.AgeTo, ageTo);
    formDataDto.append(EProfileAddFormFields.Distance, distance);
    formDataDto.append(EProfileAddFormFields.Page, page);
    formDataDto.append(EProfileAddFormFields.Size, size);
    if (!isEdit) {
      formDataDto.append(
        EProfileAddFormFields.Password,
        (password ?? "").toString(),
      );
      formDataDto.append(
        EProfileAddFormFields.PasswordConfirm,
        (passwordConfirm ?? "").toString(),
      );
    }
    if (isEdit) {
      formDataDto.append(
        EProfileEditFormFields.Id,
        profile?.id.toString() ?? "",
      );
      if (
        !isNil(profile?.images) &&
        !isEmpty(profile?.images) &&
        isEmpty(files)
      ) {
        formDataDto.append(EProfileEditFormFields.IsDefaultImage, "true");
      }
    }
    formAction(formDataDto);
  };

  if (!navigator.isCoords) return <ProfileSkeletonForm />;
  if (navigator?.errorPosition) {
    return (
      <ErrorBoundary
        i18n={i18n}
        message={t("errorBoundary.common.geoPositionError")}
      />
    );
  }

  return (
    <form action={handleSubmit} className="ProfileForm-Form">
      <Header>
        <div className="ProfileForm-Header-Cancel">
          {t("common.actions.cancel")}
        </div>
        <div className="ProfileForm-Header-Save" onClick={handleClickSave}>
          {t("common.actions.save")}
        </div>
      </Header>
      <Container>
        <Field>
          <div className="ProfileForm-Star">
            <span className="ProfileForm-Required">*</span>&nbsp;-&nbsp;
            {t("common.titles.required")}
          </div>
          <div className="ProfileForm-Star">
            <span className="ProfileForm-Hidden">*</span>&nbsp;-&nbsp;
            {t("common.titles.hidden")}
          </div>
        </Field>
      </Container>
      <Section isRequired={true} title={t("common.titles.publicPhotos")}>
        <Field>
          <FileUploader
            accept={{
              "image/avif": [".avif"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
              "image/png": [".png"],
              "image/webp": [".webp"],
            }}
            defaultImages={isEdit ? profile?.images ?? undefined : undefined}
            files={files ?? []}
            // isLoading={fetcherFilesLoading}
            lng={lng}
            // maxFiles={4}
            // maxSize={1280 * 1280}
            multiple={true}
            name="Files"
            onAddFiles={onAddFiles}
            onDeleteFile={handleDeleteFile}
            type="file"
          />
          {state?.errors?.image && (
            <Container>
              <div className="InputField-ErrorField">
                <Error errors={state?.errors?.image} />
              </div>
            </Container>
          )}
        </Field>
      </Section>
      <Section title={t("common.titles.moreDetails")}>
        <Field>
          <Input
            defaultValue={isEdit ? profile?.displayName : undefined}
            errors={state?.errors?.displayName}
            isRequired={true}
            label={t("common.form.field.displayName") ?? "Display name"}
            name={EProfileAddFormFields.DisplayName}
            type="text"
          />
        </Field>
        <Field>
          <PhoneInputMask
            defaultValue={isEdit ? keycloakSession?.user?.username : undefined}
            errors={state?.errors?.mobileNumber}
            isHiddenViewing={true}
            isReadOnly={isEdit}
            isRequired={true}
            label={t("common.form.field.mobileNumber") ?? "Mobile phone"}
            name={EProfileAddFormFields.MobileNumber}
          />
        </Field>
        {!isEdit && (
          <Field>
            <Input
              errors={state?.errors?.password}
              isHiddenViewing={true}
              isRequired={true}
              label={t("common.form.field.password") ?? "Password"}
              name={EProfileAddFormFields.Password}
              type="text"
            />
          </Field>
        )}
        {!isEdit && (
          <Field>
            <Input
              errors={state?.errors?.passwordConfirm}
              isHiddenViewing={true}
              isRequired={true}
              label={
                t("common.form.field.passwordConfirm") ?? "Password confirm"
              }
              name={EProfileAddFormFields.PasswordConfirm}
              type="text"
            />
          </Field>
        )}
        <Field>
          <span>
            {t("common.form.field.birthday")}
            <span className="ProfileForm-Required">&nbsp;*</span>
          </span>
          <InputDateField
            errors={state?.errors?.birthday}
            locale={LANGUAGE_MAPPING[language]}
            onChange={handleDateChange}
            onFieldClear={() => setValueInputDateField(null)}
            placeholder={t("common.form.field.date.placeholder")}
            value={valueInputDateField}
          />
        </Field>
        <Field>
          <Textarea
            defaultValue={
              isEdit ? profile?.description ?? undefined : undefined
            }
            errors={state?.errors?.description}
            label={t("common.form.field.description") ?? "Description"}
            name={EProfileAddFormFields.Description}
            type="text"
          />
        </Field>
      </Section>
      <Section title={t("common.titles.properties")}>
        <Field>
          <Select
            errors={state?.errors?.gender}
            isRequired={true}
            isSidebarOpen={isSidebarOpen.isGender}
            label={t("common.form.field.gender")}
            headerTitle={!isNil(gender) ? gender?.label : "--"}
            onHeaderClick={() =>
              setIsSidebarOpen((prev) => ({ ...prev, isGender: true }))
            }
            onSidebarClose={handleCloseSidebar}
          >
            <SidebarContent
              onSave={handleChangeGender}
              options={GENDER_MAPPING[language]}
              onCloseSidebar={handleCloseSidebar}
              selectedItem={gender}
              title={t("common.form.field.gender")}
            />
          </Select>
        </Field>
        <Field>
          <Select
            errors={state?.errors?.searchGender}
            isSidebarOpen={isSidebarOpen.isSearchGender}
            label={t("common.form.field.searchGender")}
            headerTitle={!isNil(searchGender) ? searchGender?.label : "--"}
            onHeaderClick={() =>
              setIsSidebarOpen((prev) => ({ ...prev, isSearchGender: true }))
            }
            onSidebarClose={handleCloseSidebar}
          >
            <SidebarContent
              onSave={handleChangeSearchGender}
              options={SEARCH_GENDER_MAPPING[language]}
              onCloseSidebar={handleCloseSidebar}
              selectedItem={searchGender}
              title={t("common.form.field.searchGender")}
            />
          </Select>
        </Field>
        <Field>
          <Input
            defaultValue={location}
            errors={state?.errors?.location}
            isRequired={true}
            isReadOnly={true}
            label={t("common.form.field.location") ?? "Location"}
            name={EProfileAddFormFields.Location}
            type="text"
          />
        </Field>
        <Field>
          <Input
            defaultValue={
              isEdit && profile?.height !== 0
                ? profile?.height ?? undefined
                : undefined
            }
            errors={state?.errors?.height}
            label={t("common.form.field.height") ?? "Height"}
            name={EProfileAddFormFields.Height}
            type="text"
          />
        </Field>
        <Field>
          <Input
            defaultValue={
              isEdit && profile?.weight !== 0
                ? profile?.weight ?? undefined
                : undefined
            }
            errors={state?.errors?.weight}
            label={t("common.form.field.weight") ?? "Weight"}
            name={EProfileAddFormFields.Weight}
            type="text"
          />
        </Field>
        <Field>
          <Select
            errors={state?.errors?.lookingFor}
            isSidebarOpen={isSidebarOpen.isLookingFor}
            label={t("common.form.field.lookingFor")}
            headerTitle={!isNil(lookingFor) ? lookingFor?.label : "--"}
            onHeaderClick={() =>
              setIsSidebarOpen((prev) => ({ ...prev, isLookingFor: true }))
            }
            onSidebarClose={handleCloseSidebar}
          >
            <SidebarContent
              onSave={handleChangeLookingFor}
              options={LOOKING_FOR_MAPPING[language]}
              onCloseSidebar={handleCloseSidebar}
              selectedItem={lookingFor}
              title={t("common.form.field.lookingFor")}
            />
          </Select>
        </Field>
      </Section>
      <input hidden={true} ref={buttonSubmitRef} type="submit" />
    </form>
  );
};

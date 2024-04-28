"use client";

import isNil from "lodash/isNil";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FC, useMemo, useRef, useState } from "react";
import type { TProfileBySessionId } from "@/app/api/profile/getBySessionId";
import { useTranslation } from "@/app/i18n/client";
import { Container } from "@/app/shared/components/container";
import { Field } from "@/app/shared/components/form/field";
import { Header } from "@/app/shared/components/header";
import { SearchBar } from "@/app/shared/components/searchBar";
import { SidebarContent } from "@/app/shared/components/sidebarContent";
import {
  DEFAULT_AGE_FROM,
  DEFAULT_AGE_TO,
  DEFAULT_SEARCH_GENDER,
} from "@/app/shared/constants/filter";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/app/shared/constants/pagination";
import { ELanguage } from "@/app/shared/enums";
import { useTelegram } from "@/app/shared/hooks";
import {
  SEARCH_BAR_SEARCH_GENDER_MAPPING,
  SEARCH_GENDER_MAPPING,
} from "@/app/shared/mapping/searchGender";
import { DropDown } from "@/app/uikit/components/dropDown";
import { Icon } from "@/app/uikit/components/icon";
import { RangeSlider } from "@/app/uikit/components/rangeSlider";
import { Select, type TSelectOption } from "@/app/uikit/components/select";
import { Sidebar } from "@/app/uikit/components/sidebar";
import "./SearchForm.scss";

type TProps = {
  lng: ELanguage;
  profile?: TProfileBySessionId;
};

export const SearchForm: FC<TProps> = ({ lng, profile }) => {
  const AGE_FROM = "ageFrom";
  const AGE_TO = "ageTo";
  const SEARCH_GENDER = "searchGender";
  const PAGE = "page";
  const SIZE = "size";
  const { user } = useTelegram();
  const { t } = useTranslation("index");
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState({
    isGeneralFilters: false,
    isSearchGender: false,
  });
  const defaultAgeRangeFrom = searchParams.get(AGE_FROM)
    ? Number(searchParams.get(AGE_FROM))
    : DEFAULT_AGE_FROM;
  const defaultAgeRangeTo = searchParams.get(AGE_TO)
    ? Number(searchParams.get(AGE_TO))
    : DEFAULT_AGE_TO;
  const [ageRange, setAgeRange] = useState<any>([
    defaultAgeRangeFrom,
    defaultAgeRangeTo,
  ]);

  const searchGenderDefault = useMemo(() => {
    return SEARCH_GENDER_MAPPING[lng].find(
      (item) => item.value === profile?.filter.searchGender,
    );
  }, [lng, profile?.filter.searchGender]);

  const searchBarTitle = useMemo(() => {
    return SEARCH_BAR_SEARCH_GENDER_MAPPING[lng].find(
      (item) => item.value === profile?.filter.searchGender,
    )?.label;
  }, [lng, profile?.filter.searchGender]);

  const [searchGender, setSearchGender] = useState<TSelectOption | undefined>(
    searchGenderDefault,
  );

  const handleOpenSidebar = () => {
    setIsSidebarOpen((prev) => ({
      ...prev,
      isGeneralFilters: true,
    }));
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen({
      isGeneralFilters: false,
      isSearchGender: false,
    });
  };

  const handleChangeSearchGender = (value?: TSelectOption) => {
    if (value) {
      value && setSearchGender(value);
      setIsSidebarOpen({
        isGeneralFilters: true,
        isSearchGender: false,
      });
    }
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(AGE_FROM);
    params.delete(AGE_TO);
    params.delete(SEARCH_GENDER);
    const page = params.get(PAGE) ?? DEFAULT_PAGE;
    const size = params.get(SIZE) ?? DEFAULT_PAGE_SIZE;
    params.set(PAGE, page.toString());
    params.set(SIZE, size.toString());
    const ageRangeValueFrom = Array.isArray(ageRange) ? ageRange[0] : ageRange;
    params.set(AGE_FROM, ageRangeValueFrom.toString());
    const ageRangeValueTo = Array.isArray(ageRange) ? ageRange[1] : ageRange;
    params.set(AGE_TO, ageRangeValueTo.toString());
    params.set(
      SEARCH_GENDER,
      searchGender?.value.toString() ?? DEFAULT_SEARCH_GENDER,
    );
    replace(`${pathname}?${params.toString()}`);
    handleCloseSidebar();
  };

  return (
    <div className="SearchForm">
      <Header className="SearchForm-Header">
        <DropDown>
          <DropDown.Button>
            <div className="SearchForm-HeaderInner">
              <SearchBar title={searchBarTitle} />
              <div className="SearchForm-WrapperIcon">
                <Icon className="SearchForm-Icon" type="Filter" />
              </div>
            </div>
          </DropDown.Button>
          <DropDown.Panel>
            <>
              <div className="DropDown-Menu">
                <div className="DropDown-MenuItem" onClick={handleOpenSidebar}>
                  {t("common.actions.filterSetup")}
                </div>
              </div>
              <div className="DropDown-Menu">
                <div className="DropDown-MenuItem DropDown-MenuItem-Cancel">
                  {t("common.actions.cancel")}
                </div>
              </div>
            </>
          </DropDown.Panel>
        </DropDown>
      </Header>
      <Sidebar
        isActive={isSidebarOpen.isGeneralFilters}
        onClose={handleCloseSidebar}
        ref={sidebarRef}
      >
        <Header className="SidebarContent-Header">
          <Icon
            className="SidebarContent-Header-Cancel"
            onClick={handleCloseSidebar}
            type="ArrowBack"
          />
          <div>{t("common.titles.filtersGeneral")}</div>
          <div className="SidebarContent-Header-Save" onClick={handleSubmit}>
            {t("common.actions.save")}
          </div>
        </Header>
        <div className="SidebarContent-List">
          <RangeSlider
            isShowTooltip={true}
            label={t("common.titles.age")}
            max={DEFAULT_AGE_TO}
            min={DEFAULT_AGE_FROM}
            onChange={setAgeRange}
            step={1}
            value={ageRange}
          />
        </div>
        <Container>
          <Field>
            <Select
              isSidebarOpen={isSidebarOpen.isSearchGender}
              label={t("common.form.field.searchGender")}
              headerTitle={!isNil(searchGender) ? searchGender?.label : "--"}
              onHeaderClick={() =>
                setIsSidebarOpen((prev) => ({ ...prev, isSearchGender: true }))
              }
              onSidebarClose={handleCloseSidebar}
            >
              <SidebarContent
                classes={{ item: "SearchForm-SidebarContent-Item" }}
                onSave={handleChangeSearchGender}
                options={SEARCH_GENDER_MAPPING[lng]}
                onCloseSidebar={handleCloseSidebar}
                selectedItem={searchGender}
                title={t("common.form.field.searchGender")}
              />
            </Select>
          </Field>
        </Container>
      </Sidebar>
    </div>
  );
};

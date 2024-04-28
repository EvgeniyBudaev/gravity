import {
  AddCircleOutlineIcon,
  ArrowBackIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AttentionIcon,
  CalendarIcon,
  CheckboxIcon,
  EditIcon,
  ExitIcon,
  FilterIcon,
  HeartEmptyIcon,
  HeartIcon,
  ImageIcon,
  LocationIcon,
  MoreHorizIcon,
  NoImageIcon,
  PersonIcon,
  SearchIcon,
  SpinnerIcon,
  TrashIcon,
  WatchIcon,
} from "@/app/uikit/assets/icons";

export type IconType =
  | "AddCircleOutline"
  | "ArrowBack"
  | "ArrowLeft"
  | "ArrowRight"
  | "Attention"
  | "Calendar"
  | "Checkbox"
  | "Edit"
  | "Exit"
  | "Filter"
  | "HeartEmpty"
  | "Heart"
  | "Image"
  | "Location"
  | "MoreHoriz"
  | "NoImage"
  | "Person"
  | "Search"
  | "Spinner"
  | "Trash"
  | "Watch";

export const iconTypes = new Map([
  ["AddCircleOutline", <AddCircleOutlineIcon key="AddCircleOutlineIcon" />],
  ["ArrowBack", <ArrowBackIcon key="ArrowBackIcon" />],
  ["ArrowLeft", <ArrowLeftIcon key="ArrowLeftIcon" />],
  ["ArrowRight", <ArrowRightIcon key="ArrowRightIcon" />],
  ["Attention", <AttentionIcon key="AttentionIcon" />],
  ["Calendar", <CalendarIcon key="CalendarIcon" />],
  ["Checkbox", <CheckboxIcon key="CheckboxIcon" />],
  ["Edit", <EditIcon key="EditIcon" />],
  ["Exit", <ExitIcon key="ExitIcon" />],
  ["Filter", <FilterIcon key="HeartIcon" />],
  ["HeartEmpty", <HeartEmptyIcon key="HeartEmptyIcon" />],
  ["Heart", <HeartIcon key="HeartIcon" />],
  ["Image", <ImageIcon key="ImageIcon" />],
  ["Location", <LocationIcon key="LocationIcon" />],
  ["MoreHoriz", <MoreHorizIcon key="MoreHorizIcon" />],
  ["NoImage", <NoImageIcon key="NoImageIcon" />],
  ["Person", <PersonIcon key="PersonIcon" />],
  ["Search", <SearchIcon key="SearchIcon" />],
  ["Spinner", <SpinnerIcon key="SpinnerIcon" />],
  ["Trash", <TrashIcon key="TrashIcon" />],
  ["Watch", <WatchIcon key="WatchIcon" />],
]);

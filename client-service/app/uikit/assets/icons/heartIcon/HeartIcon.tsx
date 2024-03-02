import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const HeartIcon: FC<TIconProps> = ({
  height = 24,
  width = 24,
  ...props
}) => (
  <svg
    fill="currentColor"
    height={height}
    width={width}
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 230 230"
    {...props}
  >
    <path
      d="M213.588,120.982L115,213.445l-98.588-92.463C-6.537,96.466-5.26,57.99,19.248,35.047l2.227-2.083
	c24.51-22.942,62.984-21.674,85.934,2.842L115,43.709l7.592-7.903c22.949-24.516,61.424-25.784,85.936-2.842l2.227,2.083
	C235.26,57.99,236.537,96.466,213.588,120.982z"
    />
  </svg>
);

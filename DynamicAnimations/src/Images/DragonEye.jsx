import React, { forwardRef } from "react";

const DragonEye = forwardRef((props, ref) => {
  return (
    <svg
      ref={ref}
      width="188"
      height="188"
      viewBox="0 0 188 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="EyeBall" filter="url(#filter0_d_5_35)">
        <rect
          x="20"
          y="20"
          width="148"
          height="148"
          rx="74"
          fill="url(#paint0_radial_5_35)"
        />
        <radialGradient
          id="paint0_radial_5_35"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(94 94) rotate(90) scale(74)"
        >
          <stop stopColor="#FFBABA" />
          <stop offset="1" stopColor="#4B0082" />
        </radialGradient>
        <g id="InnerEye">
          <path
            id="Polygon 1"
            d="M93 34L112.919 91H73.0814L93 34Z"
            fill="#8000FF"
          />
          <path
            id="Polygon 2"
            d="M93 148L73.0814 91H112.919L93 148Z"
            fill="#8000FF"
          />
          <g id="Frame 8" clipPath="url(#clip0_5_35)">
            <path
              id="Polygon 4"
              d="M92.5 132L78.2106 91.5H106.789L92.5 132Z"
              fill="url(#paint1_linear_5_35)"
            />
            <path
              id="Polygon 5"
              d="M92.5 51L106.789 91.5H78.2106L92.5 51Z"
              fill="url(#paint2_linear_5_35)"
            />
            <path
              id="Polygon 6"
              d="M92.5 64L98.9952 91.75H86.0048L92.5 64Z"
              fill="black"
            />
            <path
              id="Polygon 7"
              d="M92.5 119L86.0048 91.25H98.9952L92.5 119Z"
              fill="black"
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_5_35"
          x="0"
          y="0"
          width="188"
          height="188"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.294118 0 0 0 0 0 0 0 0 0 0.509804 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5_35"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5_35"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint1_linear_5_35"
          x1="92.5"
          y1="112.5"
          x2="92.5"
          y2="78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_5_35"
          x1="92.5"
          y1="70.5"
          x2="92.5"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8C00" />
        </linearGradient>
        <clipPath id="clip0_5_35">
          <rect
            width="33"
            height="105"
            fill="white"
            transform="translate(76 39)"
          />
        </clipPath>
      </defs>
    </svg>
  );
});

export default DragonEye;

import React, { forwardRef } from "react";

const DragonEye = forwardRef((props, ref) => {
  return (
    <svg
      width="188"
      height="188"
      viewBox="0 0 188 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
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
              d="M92.5 132L78.2106 90.75H106.789L92.5 132Z"
              fill="url(#paint1_linear_5_35)"
            />
            <path
              id="Polygon 5"
              d="M92.5 50L106.789 91.25H78.2106L92.5 50Z"
              fill="url(#paint2_linear_5_35)"
            />
            <path
              id="Polygon 6"
              d="M92.5 63L98.9952 91.5H86.0048L92.5 63Z"
              fill="#FF0000"
            />
            <path
              id="Polygon 7"
              d="M92.5 120L86.0048 91.5H98.9952L92.5 120Z"
              fill="#FF0000"
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
        <linearGradient
          id="paint1_linear_5_35"
          x1="92.5"
          y1="112.139"
          x2="92.5"
          y2="77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_5_35"
          x1="92.5"
          y1="69.8611"
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

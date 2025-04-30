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
          <g id="PurpleTri">
            <path
              d="M93.9189 151L74 94L93.9189 37L113.838 94L93.9189 151Z"
              fill="#8000FF"
              fillOpacity="0.5"
              style={{ mixBlendMode: "multiply" }}
            />
          </g>
          <path
            id="BlackTri"
            d="M101.897 93.9443H102L101.948 94.1279L102 94.3115H101.897L93.5 124.256L85.1025 94.3115H85L85.0508 94.1279L85 93.9443H85.1025L93.5 64L101.897 93.9443Z"
            fill="black"
          />
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
      </defs>
    </svg>
  );
});

export default DragonEye;

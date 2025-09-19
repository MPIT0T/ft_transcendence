tailwind.config = {
  theme:{
    extend:{
      fontFamily:{
        custom:["PixelGame", "sans-serif"],
        tiny5: ["Tiny5", "sans-serif"],
      },
    },
    keyframes: {
      gradientShift: {
        '0%':   { backgroundPosition: '0% 50%' },
        '50%':  { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
      arrowBlink: {
        "0%": { opacity: "1" },
        "25%": { opacity: "0.4" },
        "50%": { opacity: "1" },
      },
      arrowHue: {
        "0%":   { filter: "hue-rotate(0deg)" },
        "100%": { filter: "hue-rotate(359deg)" },
      },
    },
    animation: {
      gradientShift: "gradientShift 4s ease infinite",
      arrowBlink: "arrowBlink 1s infinite",
      arrowHue: "arrowHue 6s linear infinite",
      arrowHueBlink: "arrowHue 6s ease infinite, arrowBlink 1s infinite"
    },
  },
};

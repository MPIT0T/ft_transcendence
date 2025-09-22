tailwind.config = {
    theme:{
        extend:{
            fontFamily:{
                tiny5: ["Tiny5", "sans-serif"],
            },
        },
        keyframes: {
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        gradientShift: 'gradientShift 6s ease infinite',
      },
    },
};

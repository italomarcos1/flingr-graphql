/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          black: "#10151B",
          gray: "#22272A",
          primary: "#FF4458",
          secondary: "#129E68",
          superLike: "#1786FF",
          rewind: "#CD7105",
          boost: "#BA52F5"
        },
        white: '#fbfdfd',
        main: '#FF4458',
        customBlack: "#1F1D1D",
        appleBlack: "#161617",
      },
      keyframes: {
        'toast-pop-up': {
          '0%': {
            transform: 'translateY(-1.5rem)',
            opacity: 0
          },
          '50%': {
            transform: 'translateY(0rem)',
            opacity: 1
          },
          '100%': {
            transform: 'translateY(0rem)',
            opacity: 1
          },
        },
        'progress-bar-toast': {
          '0%': {
            width: '100%',
          },
          '100%': {
            width: 0 
          },
        },
        'spinning': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          },
        },
        'radar1': {
          '0%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.5,
            transform: 'scale(10)',
          },
          '100%': {
            opacity: 0,
            transform: 'scale(15)',
          },
        },
        'radar2': {
          '0%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.5,
            transform: 'scale(1)',
          },
          '100%': {
            opacity: 0,
            transform: 'scale(15)',
          },
        },
        'slide-in': {
          '0%': {
            transform: 'translateY(2rem)',
            opacity: 0
          },
          '100%': {
            transform: 'translateY(0rem)',
            opacity: 1
          }
        },
        'stagger-slide-in': {
          '0%': {
            transform: 'translateX(-6.25rem)',
            opacity: "0"
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: "1",
          },
        },
        'stagger-slide-out': {
          '0%': {
            transform: 'translateX(0)',
            opacity: "1",
          },
          '100%': {
            transform: 'translateX(-6.25rem)',
            opacity: "0"
          },
        },
        'pop-in-up': {
          '0%': {
            transform: 'translateY(2.25rem)',
            scale: "0.875",
            opacity: "0"
          },
          '100%': {
            transform: 'translateY(0)',
            scale: "1",
            opacity: "1"
          },
        },
        'slide-fade-in-up': {
          '0%': {
            transform: 'translateY(1.25rem)',
            opacity: "0"
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: "1"
          },
        }
      },
      animation: {
        'toast-notification': 'toast-pop-up 1s ease-out',
        'toast-closing': 'progress-bar-toast 4s linear',
        'loading-spinning': 'spinning 1s linear infinite',
        'loading-splash1': 'radar1 1s linear infinite',
        'loading-splash2': 'radar2 1s linear infinite',
        'title-slide-in': 'slide-in 0.75s ease-out',
        'pop-in-up': 'pop-in-up 0.5s ease-out',
        'stagger-slide-in': 'stagger-slide-in 0.375s ease-out',
        'stagger-slide-out': 'stagger-slide-out 0.375s ease-out',
        'slide-fade-in-up': 'slide-fade-in-up 0.375s ease-out',
      }
    },
  },
  plugins: [],
}


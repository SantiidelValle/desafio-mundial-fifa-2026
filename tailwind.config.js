/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mundialRed: "#e72b2d",
        mundialGreen: "#00a86b",
        mundialBlue: "#164de5",
        mundialGold: "#f5c542",
        midnight: "#071020"
      },
      boxShadow: {
        stadium: "0 28px 80px rgba(0,0,0,0.28)",
        glow: "0 0 36px rgba(245,197,66,0.34)"
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        },
        crowd: {
          "0%,100%": { opacity: "0.42" },
          "50%": { opacity: "0.8" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 5s linear infinite",
        crowd: "crowd 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

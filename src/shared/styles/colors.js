export const colors = {
  // Primary maroon palette
  primary: {
    50: "#fef7f7",
    100: "#fdeaea",
    200: "#fbd4d4",
    300: "#f7b1b1",
    400: "#f18888",
    500: "#e85d5d", // Main maroon
    600: "#d33e3e",
    700: "#b02d2d",
    800: "#922828",
    900: "#7a2626",
  },

  // Secondary colors
  secondary: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Gold accent
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Neutral grays
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Status colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

export const gradients = {
  primary: "bg-gradient-to-r from-primary-600 to-primary-700",
  secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600",
  hero: "bg-gradient-to-br from-primary-50 via-white to-secondary-50",
  card: "bg-gradient-to-br from-white to-primary-50",
};

export const shadows = {
  luxury: "shadow-luxury",
  luxuryLg: "shadow-luxury-lg",
  soft: "shadow-lg shadow-primary-200/50",
  glow: "shadow-xl shadow-primary-300/30",
};

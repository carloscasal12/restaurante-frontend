import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f6f5b',
      contrastText: '#f7f2e9',
    },
    secondary: {
      main: '#f4a261',
    },
    background: {
      default: '#f7f2e9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2a24',
      secondary: '#4c5b52',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(31, 42, 36, 0.08)',
          boxShadow: '0 18px 45px rgba(31, 42, 36, 0.08)',
        },
      },
    },
  },
})

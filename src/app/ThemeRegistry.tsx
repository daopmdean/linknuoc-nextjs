'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Modern blue
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00bcd4', // Fresh cyan
      light: '#62efff',
      dark: '#008ba3',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f8fb', // Light blue-gray background
      paper: '#ffffff',
    },
  },
  typography: {
    // fontFamily: `'Poppins', 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

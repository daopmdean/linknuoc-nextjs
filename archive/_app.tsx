import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Linknuoc</title>
        {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" /> */}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
} 

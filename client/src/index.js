import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import "@fontsource/montserrat"
import "@fontsource/alatsi"

import { AppProvider, useAppContext } from './context/appContext';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const brand_theme = extendTheme({
  colors: {
    // brand_primary: {
    //   50: "#e1f2ff",
    //   100: "#b7daff",
    //   200: "#87baff",
    //   300: "#568cff",
    //   400: "#3274d9",
    //   500: "#1d5bc4",
    //   600: "#154da4",
    //   700: "#103d87",
    //   800: "#0b3066",
    //   900: "#05264c",
    // },
    brand_primary: {
      50: "#e5e1fa",
      100: "#c9c0f4",
      200: "#ac96ed",
      300: "#906ce6",
      400: "#7454e0",
      500: "#594de2",
      600: "#4440d4",
      700: "#3535b3",
      800: "#2b2a8e",
      900: "#1d1d61",
    },
    // brand_secondary: {
    //   50: "#ffe0ea",
    //   100: "#ffc8d3",
    //   200: "#ff9fb0",
    //   300: "#ff7790",
    //   400: "#ff4e77",
    //   500: "#ff1179",
    //   600: "#d8005f",
    //   700: "#b4004a",
    //   800: "#910035",
    //   900: "#750026",
    // },
    brand_secondary: {
      50: "#fff3e5",
      100: "#ffe2c5",
      200: "#ffc59b",
      300: "#ffa371",
      400: "#ff8252",
      500: "#ff692c",
      600: "#e65200",
      700: "#c44300",
      800: "#a33300",
      900: "#872200",
    },
    brand_background: {
      light: "#f7fafc",
      // light: "#f0f4f8",
      dark: "#19202c",
      white: "#ffffff"
    },
    brand_text: {
      light: "#486581",
      dark: "#102a43",
      white: "#f0f4f8"
    }
  },

  fonts: {
    heading: `'montserrat', sans-serif`,
    body: `'montserrat', sans-serif`,
    brandSymbol: `'alatsi', sans-serif`
  }
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={brand_theme}>
    {/* <React.StrictMode>
      
    </React.StrictMode> */}
    <AppProvider>
      <App />
    </AppProvider>
  </ChakraProvider>
);

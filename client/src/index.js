import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const brand_theme = extendTheme({
  colors: {
    brand_primary: {
      50: "#e1f2ff",
      100: "#b7daff",
      200: "#87baff",
      300: "#568cff",
      400: "#3274d9",
      500: "#1d5bc4",
      600: "#154da4",
      700: "#103d87",
      800: "#0b3066",
      900: "#05264c",
    },
    brand_background: {
      white: "#f0f4f8"
    },
    brand_text: {
      light: "#486581",
      dark: "#102a43"
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={brand_theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>
);

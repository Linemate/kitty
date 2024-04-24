'use client';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reset from 'styled-reset';
import Main from 'pages/Main';
import Details from 'pages/Details';
import Login from 'pages/Login';
import theme from 'theme/theme';

export const GlobalStyle = createGlobalStyle`
  ${reset}
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/details" element={<Details />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from './theme/theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reset from 'styled-reset';
import NotoSansBlack from 'assets/fonts/NotoSansKR-Black.ttf';
import NotoSansExtraBold from 'assets/fonts/NotoSansKR-ExtraBold.ttf';
import NotoSansBold from 'assets/fonts/NotoSansKR-Bold.ttf';
import NotoSansSemiBold from 'assets/fonts/NotoSansKR-SemiBold.ttf';
import NotoSansMedium from 'assets/fonts/NotoSansKR-Medium.ttf';
import NotoSansRegular from 'assets/fonts/NotoSansKR-Regular.ttf';
import NotoSansLight from 'assets/fonts/NotoSansKR-Light.ttf';
import NotoSansExtraLight from 'assets/fonts/NotoSansKR-ExtraLight.ttf';
import NotoSansThin from 'assets/fonts/NotoSansKR-Thin.ttf';
import Main from 'pages/Main';
import Details from 'pages/Details';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  a {text-decoration:none;}
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansThin}) format('truetype');
    font-weight: 100;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansExtraLight}) format('truetype');
    font-weight: 200;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansLight}) format('truetype');
    font-weight: 300;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansRegular}) format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansMedium}) format('truetype');
    font-weight: 500;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansSemiBold}) format('truetype');
    font-weight: 600;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansBold}) format('truetype');
    font-weight: 700;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansExtraBold}) format('truetype');
    font-weight: 800;
  }
  @font-face {
    font-family: 'NotoSans';
    src: url(${NotoSansBlack}) format('truetype');
    font-weight: 900;
  }
  body {
    box-sizing:border-box;
  }
  body, h1, h2, h3, h4, h5, h6, input, textarea, div, span, i, section, article, aside, p, header, nav, footer {
    font-family:'NotoSans';
  }
  .ml10 {
    margin-left:10px;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/details" element={<Details />} />
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

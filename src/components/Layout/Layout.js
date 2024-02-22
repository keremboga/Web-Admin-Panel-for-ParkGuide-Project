import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';
import { ThemeProvider , CssBaseline } from '@mui/material';
import { ColorModeContext , useMode } from '../Theme/theme';

const Layout = ({ children }) => {
  const [theme , colorMode] = useMode()
  return (
    <ColorModeContext.Provider value = {colorMode}>
      <ThemeProvider theme = {theme}>
        <CssBaseline />
        <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">{children}</main>
      </div>
      </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
   
  
  );
};

export default Layout;

 

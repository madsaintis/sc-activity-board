import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { ContextProvider } from './context/ContextProvider.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      
      main: '#F7567C' // Set your primary color here
    },
    secondary: {
      main: '#5d576b', // Set your secondary color here
    },
    // You can define more custom colors if needed
    // For example:
    // customColor: {
    //   main: '#ff9800',
    //   dark: '#f57c00',
    //   light: '#ffb74d',
    // },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <ContextProvider >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
      </LocalizationProvider >
    </ContextProvider>
    </ThemeProvider>
    

  </React.StrictMode>,
)

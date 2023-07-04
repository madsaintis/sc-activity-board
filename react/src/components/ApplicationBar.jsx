import { Event, Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
  Box,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

const headerStyles = {
  backgroundColor: '#5b08a7',
  '@media (maxWidth: 900px)': {
    paddingLeft: 0,
  },
};

const logoStyles = {
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 600,
  color: '#FFFEFE',
  textAlign: 'left',
};

const toolbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
};


const menuButtonStyles = {
  fontFamily: 'Open Sans, sans-serif',
  fontWeight: 700,
  fontSize: '18px',
  marginLeft: '38px',
};

const drawerContainerStyles = {
  padding: '20px 30px',
};

export default function Header() {

  const { user, token, setUser, setToken, setID, notification, getTags, getEvents, setEvents } = useStateContext();
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { mobileView, drawerOpen } = state;


  // Handle user logout
  const onLogout = (event) => {
    event.preventDefault();
  
    axiosClient.post("/logout").then(() => {
      setEvents([]);
      setUser({});
      setToken(null);
    });
  
  };

  // Check for user window resize
  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();
    window.addEventListener('resize', setResponsiveness);

    return () => {
      window.removeEventListener('resize', setResponsiveness);
    };
  }, []);

  // Display header for desktop view
  const displayDesktop = () => {
    return (
      <Toolbar style={toolbarStyles}>
        {AppLogo}
        {user && <div>{getMenuButtons()}</div>}
      </Toolbar>
    );
  };

  // Display header for mobile view
  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));
  
    const handleMenuButtonClick = () => {
      handleDrawerClose(); // Close the drawer
    };
  
    return (
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-haspopup="true"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
  
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
          {user && <div style={drawerContainerStyles}>{getDrawerChoices()}</div>}
        </Drawer>
  
        <div>{AppLogo}</div>
      </Toolbar>
    );
  };

  // Header components
  const headersData = [
    {
      label: 'Home',
      href: '/home',
    },
    {
      label: 'My Events',
      href: '/favourite',
    },
    {
      label: 'Users',
      href: '/users',
      role: 'Admin'
    },
    {
      label: 'Log Out',
      onClick: onLogout,
    },
    
  ];

  // Put header components into a drawer in mobile view
  const getDrawerChoices = () => {
    return headersData.map(({ label, href, role, onClick }) => {
      if (onClick) { // Check if onClick is defined
        return (
          <MenuItem
            key={label}
            onClick={onClick} // Assign the provided onClick function directly
          >
            {label}
          </MenuItem>
        );
      } else {
        if (role && role !== user.role) {
          
          // Skip menu button if the user's role doesn't match the required role
          return null;
        }
        return (
          <Link
            component={RouterLink}
            to={href}
            color="inherit"
            style={{ textDecoration: 'none' }}
            key={label}
          >
            <MenuItem>{label}</MenuItem>
          </Link>
        );
      }
    });
  };
  
  // App logo
  const AppLogo = (
    <div>    
      <Typography variant="h5" component="h1" style={logoStyles}>
      <Event /> FC Activity Board
      </Typography>
    </div>
  );

  // Display button for header in desktop view
  const getMenuButtons = () => {
    return headersData.map(({ label, href, role, onClick }) => {
      if (onClick) { // Check if onClick is defined
        return (
          <Button
            key={label}
            color="inherit"
            style={menuButtonStyles}
            onClick={onClick} // Assign the provided onClick function directly
          >
            {label}
          </Button>
        );
      } else {
        if (role && role !== user.role) {
          // Skip menu button if the user's role doesn't match the required role
          return null;
        }
  
        return (
          <Button
            key={label}
            color="inherit"
            to={href}
            component={RouterLink}
            style={menuButtonStyles}
          >
            {label}
          </Button>
        );
      }
    });
  };
  

  return (
    <header>
      <AppBar style={headerStyles}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </header>
  );
}

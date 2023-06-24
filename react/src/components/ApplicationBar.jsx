import { Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

const headerStyles = {
  backgroundColor: '#400CCC',

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

  const onLogout = (event) => {
    event.preventDefault();
  
    axiosClient.post("/logout").then(() => {
      setEvents([]);
      setUser({});
      setToken(null);
    });
  
  };

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

  const displayDesktop = () => {
    return (
      <Toolbar style={toolbarStyles}>
        {AppLogo}
        {user && <div>{getMenuButtons()}</div>}
      </Toolbar>
    );
  };

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
  

  const AppLogo = (
    <div>
      <Typography variant="h6" component="h1" style={logoStyles}>
        SC Activity Board
      </Typography>
    </div>
  );

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

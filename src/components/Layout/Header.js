import React, { useState, useEffect  } from 'react';
import { useContext } from 'react';
import UserDropdown from './UserDropdown';
import {Box , Icon, IconButton , useTheme} from '@mui/material'
import { ColorModeContext , tokens } from '../Theme/theme';
import  LightModeOutlinedIcon  from '@mui/icons-material/LightModeOutlined';
import  DarkModeOutlinedIcon  from '@mui/icons-material/DarkModeOutlined';
import './Header.css';
import logo from '../../assets/logoaraba.png';
import userAvatar from '../../assets/useravatarazkucuk.png';
 
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [username, setUsername] = useState(''); 
  const [name, setName] = useState(''); 
  const [surname, setSurname] = useState(''); 
  const [roles, setRoles] = useState(''); 
  const [combinedName, setCombinedName] = useState('');
  const [mostpowerful, setMostpowerful] = useState('');



  useEffect(() => {
    // Component mount olduğunda localStorage'dan kullanıcı adını çek
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    const storedSurname = localStorage.getItem('surname');
    const storedRoles = localStorage.getItem('roles');
    setCombinedName(storedName + " " + storedSurname);
    if (storedRoles.includes("Admin")) {
      setMostpowerful("Admin");
    } else {
      setMostpowerful("ParkingSystemAdmin");
    }
    if (storedUsername) {
      setUsername(storedUsername); // State'i güncelle
    }
  }, []); // Boş dependency array ile sadece component mount edildiğinde çalışır

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const colorMode = useContext(ColorModeContext)

  return (
    <Box className="header" display = "flex"  justifyContent = "space-between" p = {2}>
      <img src={logo} alt="Logo" className="logo" />
      <h1>ParkGuide Istanbul Admin Panel</h1>
      <div className="user-section" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img src={userAvatar} alt="User" className="user-image" />
        <span className="username">{combinedName || "Kullanıcı Adı"}</span>
      </div>
      {dropdownOpen && <UserDropdown />}
      <Box display = "flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ?
          <DarkModeOutlinedIcon />
        : <LightModeOutlinedIcon /> }

        </IconButton>
    
      </Box>
    </Box>
  );
};

export default Header;

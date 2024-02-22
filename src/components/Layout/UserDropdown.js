import React from 'react';
import { NavLink } from 'react-router-dom';
import './UserDropdown.css';

const UserDropdown = () => {
  return (
    <div className="user-dropdown">
      <div className="dropdown-item">User: Kullanıcı Adı</div>
      <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
    </div>
  );
};

export default UserDropdown;

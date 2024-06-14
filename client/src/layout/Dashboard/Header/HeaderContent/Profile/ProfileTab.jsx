import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import axios from 'axios'; // Import Axios

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import api from 'utils/api';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      window.location.href = '/login'; // or navigate programmatically using react-router-dom
    } catch (error) {
      // Handle error if logout fails
      console.error('Logout failed:', error);
      // You can optionally display an error message to the user
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/profiles/user/personal')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Modifier le profile" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Se Deconnecter" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };

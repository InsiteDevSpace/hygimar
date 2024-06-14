import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import CreditCardOutlined from '@ant-design/icons/CreditCardOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

function getPathIndex(pathname) {
  let selectedTab = 0;
  switch (pathname) {
    case '/profiles/user/password':
      selectedTab = 1;
      break;
    case '/profiles/user/settings':
      selectedTab = 2;
      break;
    case '/profiles/user/personal':
    default:
      selectedTab = 0;
  }
  return selectedTab;
}

// ==============================|| USER PROFILE - TAB ||============================== //

export default function ProfileTab() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedIndex, setSelectedIndex] = useState(getPathIndex(pathname));
  const handleListItemClick = (index, route) => {
    setSelectedIndex(index);
    navigate(route);
  };

  useEffect(() => {
    setSelectedIndex(getPathIndex(pathname));
  }, [pathname]);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: 'grey.500' } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0, '/profiles/user/personal')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Informations personnelles" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1, '/profiles/user/password')}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Changer le mot de passe" />
      </ListItemButton>
    </List>
  );
}

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import ProfileTab from './ProfileTab';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

// assets

import MoreOutlined from '@ant-design/icons/MoreOutlined';
import CameraOutlined from '@ant-design/icons/CameraOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import defaultImages from 'assets/images/users/default.png';
import api from 'utils/api';

// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

export default function ProfileTabs({ focusInput }) {
  const theme = useTheme();
  const [avatar, setAvatar] = useState(defaultImages);
  const [user, setUser] = useState({ name: '', role: '' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/api/auth/details');
        setUser({
          name: `${response.data.fname} ${response.data.lname}`,
          role: response.data.id_role.role_name
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack spacing={2.5} alignItems="center">
            <FormLabel>
              <Avatar alt="profile user" src={avatar1} sx={{ width: 124, height: 124, border: '1px dashed' }} />
            </FormLabel>
            <TextField type="file" id="change-avtar" placeholder="Outlined" variant="outlined" sx={{ display: 'none' }} />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{user.name}</Typography>
              <Typography color="secondary">{user.role}</Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <ProfileTab />
        </Grid>
      </Grid>
    </MainCard>
  );
}

ProfileTabs.propTypes = { focusInput: PropTypes.func };

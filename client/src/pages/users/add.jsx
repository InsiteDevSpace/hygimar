import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';
import { LockOutlined } from '@ant-design/icons';

const AddUser = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    id_role: '' // Updated to use id_role for role foreign key
  });
  const [roles, setRoles] = useState([]); // Initialize roles as an empty array
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch roles from the backend
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/role/getall`); // Update this to your actual endpoint
        const data = await response.json();
        if (Array.isArray(data)) {
          setRoles(data); // Assuming data is an array of roles
        } else {
          console.error('Unexpected response format:', data);
          toast.error('Error fetching roles', { position: 'top-right' });
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Error fetching roles', { position: 'top-right' });
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? '' : 'This field is required'
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: value ? '' : 'This field is required'
    }));
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      id_role: e.target.value // Updated to set the id_role
    }));
    setErrors((prev) => ({
      ...prev,
      id_role: e.target.value ? '' : 'This field is required'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validate form
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields', { position: 'top-right' });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}` // Include Bearer prefix
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('User added successfully', { position: 'top-right' });
        navigate('/users');
      } else {
        console.error('Error adding user:', response.statusText);
        toast.error('Error adding user', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user', { position: 'top-right' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <MainCard title="Ajouter un utlisateur">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Nom</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez Nom"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.fname}
                    helperText={errors.fname}
                  />
                </Stack>
                <FormHelperText>Please enter the Nom</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Prenom</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez prenom"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.lname}
                    helperText={errors.lname}
                  />
                </Stack>
                <FormHelperText>Please enter the prenom</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Stack>
                <FormHelperText>Please enter the email</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Mot de passe</InputLabel>
                  <TextField
                    type="password"
                    fullWidth
                    placeholder="Entrez mot de passe"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <LockOutlined />
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
                <FormHelperText>Please enter the password</FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    labelId="role-label"
                    name="id_role"
                    value={formData.id_role}
                    onChange={handleRoleChange}
                    onBlur={handleBlur}
                    error={!!errors.id_role} // Style the RadioGroup if there's an error
                    sx={{ borderColor: errors.id_role ? 'red' : 'inherit' }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.role_name}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                {errors.id_role && <FormHelperText error>{errors.id_role}</FormHelperText>}
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Ajouter
                  </Button>
                  <Button variant="outlined" color="secondary" component={RouterLink} to="/users">
                    Annuler
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddUser;

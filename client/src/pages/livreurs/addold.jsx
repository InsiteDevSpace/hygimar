import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Grid, TextField, Button, Stack, InputLabel, FormHelperText, FormControl, Select, MenuItem } from '@mui/material';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';
import api from 'utils/api'; // Ensure this path is correct

const AddLivreur = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    phone: '',
    city: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const moroccanCities = [
    'Casablanca',
    'Fez',
    'Tangier',
    'Marrakesh',
    'Salé',
    'Meknes',
    'Rabat',
    'Oujda',
    'Kenitra',
    'Agadir',
    'Tetouan',
    'Temara',
    'Safi',
    'Mohammedia',
    'Khouribga',
    'El Jadida',
    'Beni Mellal',
    'Ait Melloul',
    'Nador',
    'Dar Bouazza',
    'Taza',
    'Settat',
    'Berrechid',
    'Khemisset',
    'Inezgane',
    'Ksar El Kebir',
    'Larache',
    'Guelmim',
    'Khenifra',
    'Berkane',
    'Taourirt',
    'Sidi Slimane',
    'Sidi Kacem',
    'Al Hoceima',
    'Dcheira El Jihadia',
    'Errachidia',
    'Sefrou',
    'Youssoufia',
    'Martil',
    'Tiznit',
    'Tan-Tan',
    'Tiflet',
    'Bouskoura',
    'Essaouira',
    'Taroudant',
    'Oulad Teima',
    'Ben Guerir',
    'Fquih Ben Salah',
    'Ouarzazate',
    'Ouazzane',
    'Midelt',
    'Souk El Arbaa',
    'Skhirat',
    'Souk Larbaa El Gharb',
    'Laayoune',
    'Sidi Ifni',
    'Azrou',
    "M'Diq",
    'Tinghir',
    'Chefchaouen',
    'El Aioun Sidi Mellouk',
    'Zagora'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    setErrors((prev) => ({
      ...prev,
      [name]: !value ? 'This field is required' : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields', { position: 'top-right' });
      return;
    }

    try {
      const response = await api.post('/api/livreur/create', formData);

      if (response.status === 200) {
        toast.success('Livreur added successfully', { position: 'top-right' });
        navigate('/livreurs');
      } else {
        console.error('Error adding livreur:', response.statusText);
        toast.error('Error adding livreur', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error adding livreur:', error);
      toast.error('Error adding livreur', { position: 'top-right' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <MainCard title="Add Delivery Men">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>First Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter first name"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.fname}
                    helperText={errors.fname}
                  />
                </Stack>
                <FormHelperText>Please enter the first name</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Last Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter last name"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.lname}
                    helperText={errors.lname}
                  />
                </Stack>
                <FormHelperText>Please enter the last name</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Stack>
                <FormHelperText>Please enter the email</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Password</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Stack>
                <FormHelperText>Please enter the password</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Phone</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Stack>
                <FormHelperText>Please enter the phone number</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>City</InputLabel>
                  <FormControl fullWidth error={!!errors.city}>
                    <Select name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} displayEmpty required>
                      <MenuItem value="" disabled>
                        Select a city
                      </MenuItem>
                      {moroccanCities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Please select the city</FormHelperText>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Add Livreur
                  </Button>
                  <Button variant="outlined" color="secondary" component={RouterLink} to="/livreurs">
                    Cancel
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

export default AddLivreur;

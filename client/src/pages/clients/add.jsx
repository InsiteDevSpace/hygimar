import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  InputLabel,
  FormHelperText,
  FormControl,
  FormLabel,
  Select,
  MenuItem
} from '@mui/material';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';
import api from 'utils/api';

const AddClient = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    business: ''
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
      if (key !== 'city' && !formData[key]) {
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
      const response = await api.post('/api/client/create', formData);

      if (response.status === 200) {
        toast.success('Client added successfully', { position: 'top-right' });
        navigate('/clients');
      } else {
        console.error('Error adding client:', response.statusText);
        toast.error('Error adding client', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Error adding client', { position: 'top-right' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <MainCard title="Ajouter un client">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Nom Complet</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez le nom complet"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.fullname}
                    helperText={errors.fullname}
                  />
                </Stack>
                <FormHelperText>Veuillez saisir le nom complet</FormHelperText>
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
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Stack>
                <FormHelperText>Veuillez saisir email</FormHelperText>
              </Grid>

              <Grid item xs={8}>
                <Stack spacing={1}>
                  <InputLabel>Entreprise / Orginasation</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez l'entreprise "
                    name="business"
                    value={formData.business}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.business}
                    helperText={errors.business}
                  />
                </Stack>
                <FormHelperText>Veuillez saisir entreprise/organisation</FormHelperText>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Telephone</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez le telephone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Stack>
                <FormHelperText>Veuillez saisir le telephone</FormHelperText>
              </Grid>
              {/*<Grid item xs={12}>
                <FormControl component="fieldset" required error={!!errors.gender}>
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup row name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur}>
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  </RadioGroup>
                  {errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
                </FormControl>
                    </Grid>*/}

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Ajouter
                  </Button>
                  <Button variant="outlined" color="secondary" component={RouterLink} to="/clients">
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

export default AddClient;

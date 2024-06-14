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
  Checkbox
} from '@mui/material';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';
import api from 'utils/api';

const AddCategory = () => {
  const [formData, setFormData] = useState({
    catg_name: '',
    isMark: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      if (!formData[key] && key !== 'catg_name' && key !== 'isMark') {
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
      const response = await api.post('/api/category/create', formData);

      if (response.status === 200) {
        toast.success('Category added successfully', { position: 'top-right' });
        navigate('/categories');
      } else {
        console.error('Error adding Category:', response.statusText);
        toast.error('Error adding Category', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error adding Category:', error);
      toast.error('Error adding Category', { position: 'top-right' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <MainCard title="Ajouter Categorie">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Catégorie</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez nom categorie"
                    name="catg_name"
                    value={formData.catg_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.catg_name}
                    helperText={errors.catg_name}
                  />
                </Stack>
                <FormHelperText>Veuillez saisir le nom de la catégorie</FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="isMark" color="primary" checked={formData.isMark} onChange={handleChange} />}
                  label="Cette une marque"
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Ajouter
                  </Button>
                  <Button variant="outlined" color="secondary" component={RouterLink} to="/categories">
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

export default AddCategory;

import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, FormControl, FormHelperText, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';
import api from 'utils/api';

const AddSubcategory = () => {
  const [formData, setFormData] = useState({
    id_catg: '',
    subcatg_name: ''
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/category/getall');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
      const response = await api.post('/api/subcategory/create', formData);

      if (response.status === 200) {
        toast.success('Subcategory added successfully', { position: 'top-right' });
        navigate('/categories');
      } else {
        console.error('Error adding subcategory:', response.statusText);
        toast.error('Error adding subcategory', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Error adding subcategory', { position: 'top-right' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <MainCard title="Ajouter Sous-Catégorie">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Catégorie</InputLabel>
                  <FormControl fullWidth error={!!errors.id_catg}>
                    <Select name="id_catg" value={formData.id_catg} onChange={handleChange} onBlur={handleBlur} displayEmpty required>
                      <MenuItem value="" disabled>
                        Choisir une catégorie
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.catg_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.id_catg && <FormHelperText>{errors.id_catg}</FormHelperText>}
                  </FormControl>
                </Stack>
                <FormHelperText>Veuillez sélectionner une catégorie</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Nom de sous-catégorie</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Entrez le nom de la sous-catégorie"
                    name="subcatg_name"
                    value={formData.subcatg_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.subcatg_name}
                    helperText={errors.subcatg_name}
                  />
                </Stack>
                <FormHelperText>Veuillez saisir le nom de la sous-catégorie</FormHelperText>
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

export default AddSubcategory;

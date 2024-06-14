import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  Stack,
  InputLabel,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import MainCard from 'components/MainCard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useProduct } from 'contexts/product/ProductContext';

const ProductForm = () => {
  const { addProduct, categories, subcategories } = useProduct();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [],
    primaryImage: '',
    tec_sheet: null,
    id_catg: '',
    id_subcatg: '',
    quantity: '',
    inStock: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'images') {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : files ? files[0] : value
      }));
    }
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
      if (!formData[key] && key !== 'images' && key !== 'tec_sheet' && key !== 'inStock') {
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

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData.images.forEach((file) => {
          formDataToSubmit.append(key, file);
        });
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    await addProduct(formDataToSubmit);
    navigate('/products');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Stack spacing={1}>
            <InputLabel>Designation</InputLabel>
            <TextField
              fullWidth
              placeholder="Entrez le nom du produit"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Stack>
          <FormHelperText>Veuillez saisir le nom du produit</FormHelperText>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
            <InputLabel>Categorie</InputLabel>
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
          <FormHelperText>Veuillez sélectionner une categorie</FormHelperText>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1}>
            <InputLabel>Sous-catégorie</InputLabel>
            <FormControl fullWidth error={!!errors.id_subcatg}>
              <Select name="id_subcatg" value={formData.id_subcatg} onChange={handleChange} onBlur={handleBlur} displayEmpty required>
                <MenuItem value="" disabled>
                  Choisir une sous-catégorie
                </MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.subcatg_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.id_subcatg && <FormHelperText>{errors.id_subcatg}</FormHelperText>}
            </FormControl>
          </Stack>
          <FormHelperText>Veuillez sélectionner une sous-catégorie</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel>Description</InputLabel>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              onBlur={() => handleBlur({ target: { name: 'description', value: formData.description } })}
            />
          </Stack>
          <FormHelperText>Veuillez saisir la description du produit</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel>Images</InputLabel>
            <input type="file" name="images" onChange={handleChange} multiple />
            {errors.images && <FormHelperText error>{errors.images}</FormHelperText>}
          </Stack>
          <FormHelperText>Veuillez sélectionner des images</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel>Image Principale</InputLabel>
            <FormControl fullWidth error={!!errors.primaryImage}>
              <Select name="primaryImage" value={formData.primaryImage} onChange={handleChange} displayEmpty required>
                <MenuItem value="" disabled>
                  Sélectionnez l'image principale
                </MenuItem>
                {formData.images.map((image, index) => (
                  <MenuItem key={index} value={image.name}>
                    {image.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.primaryImage && <FormHelperText>{errors.primaryImage}</FormHelperText>}
            </FormControl>
          </Stack>
          <FormHelperText>Veuillez sélectionner l'image principale</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel>Quantité</InputLabel>
            <TextField
              fullWidth
              placeholder="Entrez la quantité"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Stack>
          <FormHelperText>Veuillez saisir la quantité</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel>Fiche Technique</InputLabel>
            <input type="file" name="tec_sheet" onChange={handleChange} />
            {errors.tec_sheet && <FormHelperText error>{errors.tec_sheet}</FormHelperText>}
          </Stack>
          <FormHelperText>Veuillez sélectionner une fiche technique</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={formData.inStock} onChange={handleChange} name="inStock" color="primary" />}
            label="En Stock"
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/products')}>
              Annuler
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Ajouter
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;

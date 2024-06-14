import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, Stack, InputLabel, FormHelperText, FormControl, Select, MenuItem } from '@mui/material';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';
import { useStock } from 'contexts/stock/StockContext';

const StockForm = () => {
  const { addStock, suppliers } = useStock();
  const [formData, setFormData] = useState({
    id_supplier: '',
    name: '',
    warehouse: '',
    info: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

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

    await addStock(formData);
    navigate('/stocks');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <MainCard title="Add Stock">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter stock name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Stack>
                <FormHelperText>Please enter the stock name</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel>Warehouse</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter warehouse"
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.warehouse}
                    helperText={errors.warehouse}
                  />
                </Stack>
                <FormHelperText>Please enter the warehouse</FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Supplier</InputLabel>
                  <FormControl fullWidth error={!!errors.id_supplier}>
                    <Select
                      name="id_supplier"
                      value={formData.id_supplier}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      displayEmpty
                      required
                    >
                      <MenuItem value="" disabled>
                        Select a supplier
                      </MenuItem>
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier._id} value={supplier._id}>
                          {supplier.fullname}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.id_supplier && <FormHelperText>{errors.id_supplier}</FormHelperText>}
                  </FormControl>
                  <FormHelperText>Please select a supplier</FormHelperText>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Info</InputLabel>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter additional info"
                    name="info"
                    value={formData.info}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.info}
                    helperText={errors.info}
                  />
                </Stack>
                <FormHelperText>Please enter additional info (optional)</FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                  <Button variant="outlined" color="secondary" onClick={() => navigate('/stocks')}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Add Stock
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

export default StockForm;

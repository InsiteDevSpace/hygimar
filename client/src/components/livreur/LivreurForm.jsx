import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, TextField, Button, Stack, InputLabel, FormHelperText, FormControl, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const moroccanCities = [
  'Casablanca', 'Fez', 'Tangier', 'Marrakesh', 'Salé', 'Meknes', 'Rabat', 'Oujda', 'Kenitra', 'Agadir', 'Tetouan', 'Temara', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Beni Mellal', 'Ait Melloul', 'Nador', 'Dar Bouazza', 'Taza', 'Settat', 'Berrechid', 'Khemisset', 'Inezgane', 'Ksar El Kebir', 'Larache', 'Guelmim', 'Khenifra', 'Berkane', 'Taourirt', 'Sidi Slimane', 'Sidi Kacem', 'Al Hoceima', 'Dcheira El Jihadia', 'Errachidia', 'Sefrou', 'Youssoufia', 'Martil', 'Tiznit', 'Tan-Tan', 'Tiflet', 'Bouskoura', 'Essaouira', 'Taroudant', 'Oulad Teima', 'Ben Guerir', 'Fquih Ben Salah', 'Ouarzazate', 'Ouazzane', 'Midelt', 'Souk El Arbaa', 'Skhirat', 'Souk Larbaa El Gharb', 'Laayoune', 'Sidi Ifni', 'Azrou', "M'Diq", 'Tinghir', 'Chefchaouen', 'El Aioun Sidi Mellouk', 'Zagora'
];

const LivreurForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    let errorMessage = '';
    if (!value) {
      errorMessage = 'This field is required';
    } else if (name === 'email' && !validateEmail(value)) {
      errorMessage = 'Invalid email format';
    } else if (name === 'password' && value.length < 8) {
      errorMessage = 'Password must be at least 8 characters long';
    } else if (name === 'confirmPassword' && value !== formData.password) {
      errorMessage = 'Passwords do not match';
    }
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      } else if (key === 'email' && !validateEmail(formData[key])) {
        newErrors[key] = 'Invalid email format';
      } else if (key === 'password' && formData[key].length < 8) {
        newErrors[key] = 'Password must be at least 8 characters long';
      } else if (key === 'confirmPassword' && formData[key] !== formData.password) {
        newErrors[key] = 'Passwords do not match';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Assuming toast is defined somewhere in your code
      toast.error('Please fill in all required fields', { position: 'top-right' });
      return;
    }
    onSubmit(formData);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                    )
                  }}
              />
            </Stack>
            <FormHelperText>Please enter the password</FormHelperText>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              <InputLabel>Confirm Password</InputLabel>
              <TextField
                  fullWidth
                  placeholder="Confirm password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                    )
                  }}
              />
            </Stack>
            <FormHelperText>Please confirm the password</FormHelperText>
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
                    <Select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        displayEmpty
                        required
                    >
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
      </form>
  );
};

export default LivreurForm;

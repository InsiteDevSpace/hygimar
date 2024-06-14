import React, { useEffect, useState } from 'react';
import { useUser } from 'contexts/user/UserContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, Stack, TextField, InputLabel, FormHelperText } from '@mui/material';
import MainCard from 'components/MainCard';

const TabPersonal = () => {
  const { userDetails, updateUserDetails } = useUser();
  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    email: ''
  });

  useEffect(() => {
    if (userDetails) {
      setInitialValues({
        fname: userDetails.fname || '',
        lname: userDetails.lname || '',
        email: userDetails.email || ''
      });
    }
  }, [userDetails]);

  return (
    <MainCard title="Informations personnelles">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          fname: Yup.string().max(255).required('First Name is required'),
          lname: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string().email('Invalid email address').max(255).required('Email is required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await updateUserDetails(values);
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-fname">Nom</InputLabel>
                  <TextField
                    fullWidth
                    id="personal-fname"
                    value={values.fname}
                    name="fname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Jhon"
                  />
                  {touched.fname && errors.fname && (
                    <FormHelperText error id="personal-fname-helper">
                      {errors.fname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-lname">Prenom</InputLabel>
                  <TextField
                    fullWidth
                    id="personal-lname"
                    value={values.lname}
                    name="lname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Patrik"
                  />
                  {touched.lname && errors.lname && (
                    <FormHelperText error id="personal-lname-helper">
                      {errors.lname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-email">Email</InputLabel>
                  <TextField
                    type="email"
                    fullWidth
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="personal-email"
                    placeholder="Email"
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="personal-email-helper">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    Annuler
                  </Button>
                  <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                    Enregistrer
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPersonal;

import React from 'react';
import { Formik, FieldArray } from 'formik';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import {
  Grid,
  TextField,
  Button,
  Stack,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormHelperText,
  Box,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

import { useProduct } from 'contexts/product/ProductContext';
import { useClient } from 'contexts/client/ClientContext';
import { useOrder } from 'contexts/order/OrderContext';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';

const FormOrder = () => {
  const { products } = useProduct();
  const { clients } = useClient();
  const { addOrder } = useOrder();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        client_id: '',
        products: [{ product_id: '', quantity: 1, name: '' }],
        sendNotif: false,
        notes: ''
      }}
      validationSchema={Yup.object().shape({
        client_id: Yup.string().required('Client is required'),
        products: Yup.array()
          .of(
            Yup.object().shape({
              product_id: Yup.string().required('Product is required'),
              quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required')
            })
          )
          .min(1, 'At least one product is required')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await addOrder(values);
          navigate('/orders');
        } catch (error) {
          console.error('Error adding order:', error);
        }
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Client</InputLabel>
                <FormControl fullWidth error={touched.client_id && !!errors.client_id}>
                  <Select name="client_id" value={values.client_id} onChange={handleChange} onBlur={handleBlur} displayEmpty>
                    <MenuItem value="" disabled>
                      Sélectionnez un client{' '}
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.client_id && errors.client_id && <FormHelperText>{errors.client_id}</FormHelperText>}
                </FormControl>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Produits</Typography>
            </Grid>
            <Grid item xs={12}>
              <FieldArray
                name="products"
                render={({ remove, push }) => (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Quantité</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.products.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <FormControl
                                  fullWidth
                                  error={
                                    touched.products &&
                                    touched.products[index] &&
                                    touched.products[index].product_id &&
                                    !!errors.products &&
                                    !!errors.products[index] &&
                                    !!errors.products[index].product_id
                                  }
                                >
                                  <Select
                                    name={`products[${index}].product_id`}
                                    value={product.product_id}
                                    onChange={(e) => {
                                      const selectedProduct = products.find((p) => p._id === e.target.value);
                                      setFieldValue(`products[${index}].product_id`, e.target.value);
                                      setFieldValue(`products[${index}].name`, selectedProduct.name);
                                    }}
                                    onBlur={handleBlur}
                                    displayEmpty
                                  >
                                    <MenuItem value="" disabled>
                                      Choisissez un produit
                                    </MenuItem>
                                    {products.map((productItem) => (
                                      <MenuItem key={productItem._id} value={productItem._id}>
                                        {productItem.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {touched.products &&
                                    touched.products[index] &&
                                    touched.products[index].product_id &&
                                    !!errors.products &&
                                    !!errors.products[index] &&
                                    !!errors.products[index].product_id && (
                                      <FormHelperText>{errors.products[index].product_id}</FormHelperText>
                                    )}
                                </FormControl>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  name={`products[${index}].quantity`}
                                  value={product.quantity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  inputProps={{ min: 1 }}
                                  error={
                                    touched.products &&
                                    touched.products[index] &&
                                    touched.products[index].quantity &&
                                    !!errors.products &&
                                    !!errors.products[index] &&
                                    !!errors.products[index].quantity
                                  }
                                  helperText={
                                    touched.products &&
                                    touched.products[index] &&
                                    touched.products[index].quantity &&
                                    !!errors.products &&
                                    !!errors.products[index] &&
                                    !!errors.products[index].quantity
                                      ? errors.products[index].quantity
                                      : ''
                                  }
                                />
                              </TableCell>

                              <TableCell align="center">
                                <IconButton color="error" onClick={() => remove(index)}>
                                  <DeleteOutlined />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                      <Button
                        color="primary"
                        startIcon={<PlusOutlined />}
                        onClick={() => push({ product_id: '', quantity: 1, name: '' })}
                        variant="dashed"
                        sx={{ bgcolor: 'transparent !important' }}
                      >
                        Ajouter
                      </Button>
                    </Box>
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Demande</InputLabel>
                <TextField
                  placeholder="Entrez la demande"
                  rows={3}
                  multiline
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="notes"
                  sx={{ width: '100%', '& .MuiFormHelperText-root': { mr: 0, display: 'flex', justifyContent: 'flex-end' } }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox name="sendNotif" color="primary" checked={values.sendNotif} onChange={handleChange} onBlur={handleBlur} />
                }
                label="Envoyer une notification au client"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" color="secondary" sx={{ mr: 2 }}>
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Enregistrer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default FormOrder;

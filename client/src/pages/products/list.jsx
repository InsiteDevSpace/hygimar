import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Avatar,
  Typography,
  TablePagination,
  Slide,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormHelperText,
  CardActions,
  FormControlLabel,
  Checkbox,
  Chip
} from '@mui/material';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { useProduct } from 'contexts/product/ProductContext';
import { Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const PopupTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductList() {
  const { products, deleteProduct, updateProduct, categories, subcategories } = useProduct();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (_id) => {
    setProductToDelete(_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await deleteProduct(productToDelete);
    handleCloseDeleteDialog();
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedProduct(null);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditedProduct({
      ...product,
      id_catg: product.id_catg?._id || '',
      id_subcatg: product.id_subcatg?._id || ''
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
    setEditedProduct({});
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    Object.keys(editedProduct).forEach((key) => {
      if (Array.isArray(editedProduct[key])) {
        editedProduct[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, editedProduct[key]);
      }
    });

    await updateProduct(editedProduct._id, formData);
    handleCloseEditDialog();
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files : value
    }));
  };

  const handlePrimaryImageChange = (image) => {
    setEditedProduct((prev) => ({
      ...prev,
      primaryImage: image
    }));
  };

  const handleDeleteImage = (image) => {
    setEditedProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image)
    }));
  };

  return (
    <MainCard
      title="Liste des produits"
      content={false}
      secondary={
        <Button component={RouterLink} to="/add-product" variant="contained" startIcon={<PlusOutlined />}>
          Ajouter un produit
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>#</TableCell>
              <TableCell>Produit</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Sous-catégorie</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover key={row._id}>
                <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                <TableCell sx={{ pl: 3 }}>
                  <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                    <Grid item>
                      {row.primaryImage && (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${row.primaryImage}`}
                          alt={row.name}
                          style={{ width: '50px', height: '50px' }}
                        />
                      )}
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="subtitle1">{row.name}</Typography>
                      <Typography variant="caption" color="secondary">
                        {row.id_catg?.catg_name || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>{row.id_catg?.catg_name || '-'}</TableCell>
                <TableCell>{row.id_subcatg?.subcatg_name || '-'}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {row.inStock ? (
                    <Chip color="success" label="En stock" size="small" variant="light" />
                  ) : (
                    <Chip color="error" label="Rupture de stock" size="small" variant="light" />
                  )}
                </TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <IconButton color="secondary" size="large" onClick={() => handleViewDetails(row)}>
                      <VisibilityOutlinedIcon />
                    </IconButton>
                    <IconButton color="primary" size="large" onClick={() => handleEditClick(row)}>
                      <EditOutlined />
                    </IconButton>
                    <IconButton color="error" size="large" onClick={() => handleDeleteClick(row._id)}>
                      <DeleteOutlined />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="xs"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
              <DeleteOutlinedIcon />
            </Avatar>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                Etes-vous sûr que vous voulez supprimer?
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={handleCloseDeleteDialog} color="secondary" variant="outlined">
                Cancel
              </Button>
              <Button fullWidth color="error" variant="contained" onClick={handleDeleteConfirm} autoFocus>
                Delete
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        keepMounted
        TransitionComponent={PopupTransition}
        fullWidth
        maxWidth="md"
        aria-labelledby="view-product-title"
        aria-describedby="view-product-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Afficher les détails du produit">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Stack spacing={1}>
                      <InputLabel>Designation</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez le nom du produit"
                        name="name"
                        value={selectedProduct ? selectedProduct.name : ''}
                        readOnly
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Catégorie</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_catg" value={selectedProduct ? selectedProduct.id_catg?._id : ''} readOnly>
                          {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.catg_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Sous-catégorie</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_subcatg" value={selectedProduct ? selectedProduct.id_subcatg?._id : ''} readOnly>
                          {subcategories.map((subcategory) => (
                            <MenuItem key={subcategory._id} value={subcategory._id}>
                              {subcategory.subcatg_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Description</InputLabel>
                      <ReactQuill value={selectedProduct ? selectedProduct.description : ''} readOnly />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Images</InputLabel>
                      {selectedProduct && selectedProduct.images && selectedProduct.images.length > 0 ? (
                        <Grid container spacing={2}>
                          {selectedProduct.images.map((image, idx) => (
                            <Grid item key={idx}>
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}/${image}`}
                                alt={`product-img-${idx}`}
                                style={{ width: '100px', height: '100px' }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2">Aucune image disponible</Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel>Fiche Technique</InputLabel>
                    {selectedProduct && selectedProduct.tec_sheet && (
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL}/${selectedProduct.tec_sheet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir la fiche technique
                      </a>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Quantité</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez la quantité"
                        name="quantity"
                        value={selectedProduct ? selectedProduct.quantity : ''}
                        readOnly
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={selectedProduct ? selectedProduct.inStock : false} name="inStock" color="primary" readOnly />
                      }
                      label="En Stock"
                    />
                  </Grid>
                  <CardActions>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                      <Button variant="outlined" color="secondary" onClick={handleCloseViewDialog}>
                        Annuler
                      </Button>
                    </Stack>
                  </CardActions>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        keepMounted
        TransitionComponent={PopupTransition}
        fullWidth
        maxWidth="md"
        aria-labelledby="edit-product-title"
        aria-describedby="edit-product-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Modifier les détails du produit">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Stack spacing={1}>
                      <InputLabel>Designation</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez le nom du produit"
                        name="name"
                        value={editedProduct.name || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez saisir le nom du produit</FormHelperText>
                  </Grid>

                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Catégorie</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_catg" value={editedProduct.id_catg || ''} onChange={handleFieldChange}>
                          {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.catg_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <FormHelperText>Veuillez saisir la catégorie</FormHelperText>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Sous-catégorie</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_subcatg" value={editedProduct.id_subcatg || ''} onChange={handleFieldChange}>
                          {subcategories.map((subcategory) => (
                            <MenuItem key={subcategory._id} value={subcategory._id}>
                              {subcategory.subcatg_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <FormHelperText>Veuillez saisir la sous-catégorie</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Description</InputLabel>
                      <ReactQuill
                        value={editedProduct.description || ''}
                        onChange={(value) => setEditedProduct((prev) => ({ ...prev, description: value }))}
                      />
                    </Stack>
                    <FormHelperText>Veuillez saisir la description du produit</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Images</InputLabel>
                      <input type="file" name="images" multiple onChange={handleFieldChange} />
                      {editedProduct.images && Array.isArray(editedProduct.images) && editedProduct.images.length > 0 && (
                        <Grid container spacing={2}>
                          {editedProduct.images.map((image, idx) => (
                            <Grid item key={idx}>
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}/${image}`}
                                alt={`product-img-${idx}`}
                                style={{ width: '100px', height: '100px' }}
                              />
                              <IconButton color="error" size="small" onClick={() => handleDeleteImage(image)}>
                                <DeleteOutlined />
                              </IconButton>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Stack>
                    <FormHelperText>Veuillez télécharger des images</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Image Principale</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          name="primaryImage"
                          value={editedProduct.primaryImage || ''}
                          onChange={(e) => handlePrimaryImageChange(e.target.value)}
                        >
                          {editedProduct.images &&
                            Array.isArray(editedProduct.images) &&
                            editedProduct.images.map((image, idx) => (
                              <MenuItem key={idx} value={image}>
                                {image}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <FormHelperText>Veuillez choisir l'image principale</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Quantity</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez la quantité"
                        name="quantity"
                        type="number"
                        value={editedProduct.quantity || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez saisir la quantité</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Image</InputLabel>
                      <input type="file" name="image" onChange={handleFieldChange} />
                      {editedProduct.image && (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${editedProduct.image}`}
                          alt="Product"
                          style={{ width: '100px', height: '100px' }}
                        />
                      )}
                    </Stack>
                    <FormHelperText>Veuillez télécharger une image</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Fiche Technique</InputLabel>
                      <input type="file" name="tec_sheet" onChange={handleFieldChange} />
                      {editedProduct.tec_sheet && (
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}/${editedProduct.tec_sheet}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Voir la fiche technique
                        </a>
                      )}
                    </Stack>
                    <FormHelperText>Veuillez télécharger une fiche technique</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={editedProduct.inStock || false} onChange={handleFieldChange} name="inStock" color="primary" />
                      }
                      label="En Stock"
                    />
                  </Grid>
                  <CardActions>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                      <Button variant="outlined" color="secondary" onClick={handleCloseEditDialog}>
                        Annuler
                      </Button>
                      <Button type="submit" variant="contained" onClick={handleEditSave} startIcon={<SaveIcon />}>
                        Modifier
                      </Button>
                    </Stack>
                  </CardActions>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </MainCard>
  );
}

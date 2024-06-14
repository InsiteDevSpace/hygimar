import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  TextField,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Slide,
  Grid,
  FormHelperText,
  CardActions,
  FormControl
} from '@mui/material';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import api from 'utils/api';

// Simple PopupTransition component
const PopupTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// table data
function createData(index, _id, subcatg_name, id_catg, catg_name) {
  return { index, _id, subcatg_name, id_catg, catg_name };
}

export default function SubcategoryList() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedSubcategory, setEditedSubcategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcategoriesResponse, categoriesResponse] = await Promise.all([
          api.get('/api/subcategory/getall'),
          api.get('/api/category/getall')
        ]);
        const subcategoriesData = subcategoriesResponse.data;
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesData);
        setData(
          subcategoriesData.map((item, index) =>
            createData(index + 1, item._id, item.subcatg_name, item.id_catg._id, item.id_catg.catg_name)
          )
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (_id) => {
    setSubcategoryToDelete(_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSubcategoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`/api/subcategory/delete/${subcategoryToDelete}`);

      if (response.status === 200) {
        const updatedData = data.filter((subcategory) => subcategory._id !== subcategoryToDelete);
        setData(updatedData);
        toast.success('Subcategory deleted successfully', { position: 'top-right' });
      } else {
        console.error('Error deleting subcategory:', response.statusText);
        toast.error('Error deleting subcategory', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory', { position: 'top-right' });
    }
    handleCloseDeleteDialog();
  };

  const handleEditClick = (subcategory) => {
    setEditedSubcategory({ ...subcategory });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedSubcategory({});
  };

  const handleEditSave = async () => {
    try {
      const response = await api.put(`/api/subcategory/update/${editedSubcategory._id}`, editedSubcategory);
      if (response.status === 200) {
        const updatedData = data.map((subcategory) =>
          subcategory._id === editedSubcategory._id
            ? { ...editedSubcategory, catg_name: categories.find((cat) => cat._id === editedSubcategory.id_catg).catg_name }
            : subcategory
        );
        setData(updatedData);
        setOpenEditDialog(false);
        toast.success('Subcategory updated successfully', { position: 'top-right' });
      } else {
        console.error('Error updating subcategory:', response.statusText);
        toast.error('Error updating subcategory', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Error updating subcategory', { position: 'top-right' });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedSubcategory((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <MainCard
      title="Liste des sous-catégories"
      content={false}
      secondary={
        <Button component={RouterLink} to="/add-subcategory" variant="contained" startIcon={<PlusOutlined />}>
          Ajouter sous-catégorie
        </Button>
      }
    >
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>#</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Sous-Catégorie</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row._id}>
                <TableCell sx={{ pl: 3 }}>{row.index}</TableCell>
                <TableCell>{row.catg_name}</TableCell>
                <TableCell>{row.subcatg_name}</TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>
                  <Stack direction="row" justifyContent="center" alignItems="center">
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
        count={data.length}
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
        aria-labelledby="delete-subcategory-title"
        aria-describedby="delete-subcategory-description"
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

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        keepMounted
        TransitionComponent={PopupTransition}
        fullWidth
        maxWidth="md"
        aria-labelledby="edit-subcategory-details-title"
        aria-describedby="edit-subcategory-details-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Edit Subcategory Details">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Sous-Catégorie</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter subcategory name"
                        name="subcatg_name"
                        value={editedSubcategory.subcatg_name || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez entrer le nom de la sous-catégorie</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Catégorie</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_catg" value={editedSubcategory.id_catg || ''} onChange={handleFieldChange} displayEmpty>
                          <MenuItem value="" disabled>
                            Choisir une catégorie
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.catg_name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>Veuillez sélectionner une catégorie</FormHelperText>
                      </FormControl>
                    </Stack>
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

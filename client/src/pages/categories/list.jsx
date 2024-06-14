import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  CardMedia,
  Chip,
  Link,
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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
function createData(index, _id, catg_name, isMark) {
  return { index, _id, catg_name, isMark };
}

export default function LatestOrder() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setcategoryToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedcategory, setSelectedcategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedcategory, setEditedcategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/category/getall');
        const responseData = response.data;
        setData(responseData.map((item, index) => createData(index + 1, item._id, item.catg_name, item.isMark)));
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
    setcategoryToDelete(_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setcategoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`/api/category/delete/${categoryToDelete}`);

      if (response.status === 200) {
        const updatedData = data.filter((category) => category._id !== categoryToDelete);
        setData(updatedData);
        toast.success('category deleted successfully', { position: 'top-right' });
      } else {
        console.error('Error deleting category:', response.statusText);
        toast.error('Error deleting category', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category', { position: 'top-right' });
    }
    handleCloseDeleteDialog();
  };

  const handleViewDetails = (category) => {
    setSelectedcategory(category);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedcategory(null);
  };

  const handleEditClick = (category) => {
    setSelectedcategory(category);
    setEditedcategory({ ...category });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedcategory(null);
    setEditedcategory({});
  };

  const handleEditSave = async () => {
    try {
      const response = await api.put(`/api/category/update/${editedcategory._id}`, editedcategory);
      if (response.status === 200) {
        const updatedData = data.map((category) => (category._id === editedcategory._id ? { ...editedcategory } : category));
        setData(updatedData);
        setOpenEditDialog(false);
        toast.success('Category updated successfully', { position: 'top-right' });
      } else {
        console.error('Error updating category:', response.statusText);
        toast.error('Error updating category', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category', { position: 'top-right' });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedcategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  return (
    <MainCard
      title="Liste des categories"
      content={false}
      secondary={
        <Button component={RouterLink} to="/add-category" variant="contained" startIcon={<PlusOutlined />}>
          Ajouter categorie
        </Button>
      }
    >
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>#</TableCell>
              <TableCell>Categorie</TableCell>
              <TableCell>Une Marque?</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row._id}>
                <TableCell sx={{ pl: 3 }}>{row.index}</TableCell>
                <TableCell>{row.catg_name}</TableCell>
                <TableCell>
                  {(() => {
                    if (row.isMark) {
                      return <Chip color="success" label="Oui" size="small" variant="light" />;
                    } else {
                      return <Chip color="error" label="Non" size="small" variant="light" />;
                    }
                  })()}
                </TableCell>

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
        aria-labelledby="delete-category-title"
        aria-describedby="delete-category-description"
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
        maxWidth="md" // Adjusted width
        aria-labelledby="edit-category-details-title"
        aria-describedby="edit-category-details-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Edit Category Details">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Categorie</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter category name"
                        name="catg_name"
                        value={editedcategory.catg_name || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez entrer le nom de la catégorie</FormHelperText>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={editedcategory.isMark || false} onChange={handleFieldChange} name="isMark" color="primary" />
                      }
                      label="Cette une marque"
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

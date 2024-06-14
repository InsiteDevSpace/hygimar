import React, { useState } from 'react';
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
  Select,
  MenuItem,
  InputLabel,
  TablePagination,
  Slide,
  Grid,
  FormHelperText,
  CardActions,
  FormControl
} from '@mui/material';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { EditOutlined } from '@ant-design/icons';
import { useLivreur } from 'contexts/livreur/LivreurContext';

// Simple PopupTransition component
const PopupTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Moroccan cities array
const moroccanCities = [
  'Casablanca', 'Fez', 'Tangier', 'Marrakesh', 'Salé', 'Meknes', 'Rabat', 'Oujda', 'Kenitra', 'Agadir',
  'Tetouan', 'Temara', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Beni Mellal', 'Ait Melloul', 'Nador',
  'Dar Bouazza', 'Taza', 'Settat', 'Berrechid', 'Khemisset', 'Inezgane', 'Ksar El Kebir', 'Larache', 'Guelmim',
  'Khenifra', 'Berkane', 'Taourirt', 'Sidi Slimane', 'Sidi Kacem', 'Al Hoceima', 'Dcheira El Jihadia', 'Errachidia',
  'Sefrou', 'Youssoufia', 'Martil', 'Tiznit', 'Tan-Tan', 'Tiflet', 'Bouskoura', 'Essaouira', 'Taroudant', 'Oulad Teima',
  'Ben Guerir', 'Fquih Ben Salah', 'Ouarzazate', 'Ouazzane', 'Midelt', 'Souk El Arbaa', 'Skhirat', 'Souk Larbaa El Gharb',
  'Laayoune', 'Sidi Ifni', 'Azrou', "M'Diq", 'Tinghir', 'Chefchaouen', 'El Aioun Sidi Mellouk', 'Zagora'
];

export default function LatestOrder() {
  const { livreurs, deleteLivreur, updateLivreur } = useLivreur();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [livreurToDelete, setLivreurToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedLivreur, setEditedLivreur] = useState({});
  const [emailError, setEmailError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (_id) => {
    setLivreurToDelete(_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setLivreurToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await deleteLivreur(livreurToDelete);
    handleCloseDeleteDialog();
  };

  const handleViewDetails = (livreur) => {
    setSelectedLivreur(livreur);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedLivreur(null);
  };

  const handleEditClick = (livreur) => {
    setSelectedLivreur(livreur);
    setEditedLivreur({ ...livreur });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedLivreur(null);
    setEditedLivreur({});
  };

  const handleEditSave = async () => {
    // Vérification de l'e-mail
    if (!validateEmail(editedLivreur.email)) {
      setEmailError('Invalid email format');
      return; // Empêcher la sauvegarde si le format de l'e-mail est invalide
    }

    // Mise à jour du livreur si la validation réussit
    await updateLivreur(editedLivreur._id, editedLivreur);
    handleCloseEditDialog();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedLivreur((prev) => ({ ...prev, [name]: value }));

    if (value === '') {
      setFieldErrors((prev) => ({ ...prev, [name]: 'Please fill out this field.' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
        } else {
          setFieldErrors((prev) => ({ ...prev, email: '' }));
        }
      }
    }
  };

  const handleEmailBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email' && value.trim() !== '') {
      if (!validateEmail(value)) {
        error = 'Invalid email format';
      }
    }
    setEmailError(error);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
      <MainCard
          title="List of livreurs"
          content={false}
          secondary={
            <Button component={RouterLink} to="/add-livreur" variant="contained" startIcon={<PlusOutlined />}>
              Add delivery men
            </Button>
          }
      >
        <TableContainer>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {livreurs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover key={row._id}>
                    <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                    <TableCell>{row.fname} {row.lname}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.city || '-'}</TableCell>
                    <TableCell align="center" sx={{ pr: 3 }}>
                      <Stack direction="row" justifyContent="center" alignItems="center">
                        <IconButton color="inherit" size="large" onClick={() => handleEditClick(row)}>
                          <EditOutlined />
                        </IconButton>
                        <IconButton color="info" size="large" onClick={() => handleViewDetails(row)}>
                          <VisibilityOutlinedIcon />
                        </IconButton>
                        <IconButton color="error" size="large" onClick={() => handleDeleteClick(row._id)}>
                          <DeleteOutlinedIcon />
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
            count={livreurs.length}
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
            TransitionComponent={PopupTransition        }
            maxWidth="xs"
            aria-labelledby="delete-livreur-title"
            aria-describedby="delete-livreur-description"
        >
          <DialogContent sx={{ mt: 2, my: 1 }}>
            <Stack alignItems="center" spacing={3.5}>
              <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                <DeleteOutlinedIcon />
              </Avatar>
              <Stack spacing={2}>
                <Typography variant="h4" align="center">
                  Are you sure you want to delete?
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
            aria-labelledby="view-livreur-title"
            aria-describedby="view-livreur-description"
        >
          <DialogContent sx={{ mt: 2, my: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <MainCard title="View livreur Details">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel>Full Name</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter full name"
                            name="fullname"
                            value={selectedLivreur ? `${selectedLivreur.fname} ${selectedLivreur.lname}` : ''}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel>Phone</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter phone number"
                            name="phone"
                            value={selectedLivreur ? selectedLivreur.phone : ''}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel>City</InputLabel>
                        <TextField fullWidth name="city" value={selectedLivreur ? selectedLivreur.city : ''} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel>Email</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter email"
                            name="email"
                            value={selectedLivreur ? selectedLivreur.email : ''}
                        />
                      </Stack>
                    </Grid>

                    <CardActions>
                      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                        <Button variant="outlined" color="secondary" onClick={handleCloseViewDialog}>
                          Close
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
            aria-labelledby="edit-user-details-title"
            aria-describedby="edit-user-details-description"
        >
          <DialogContent sx={{ mt: 2, my: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <MainCard title="Edit livreur Details">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel>First Name</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter first name"
                            name="fname"
                            required
                            value={editedLivreur.fname || ''}
                            onChange={handleFieldChange}
                        />
                      </Stack>
                      <FormHelperText>{fieldErrors.fname}</FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel>Last Name</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter last name"
                            name="lname"
                            required
                            value={editedLivreur.lname || ''}
                            onChange={handleFieldChange}
                        />
                      </Stack>
                      <FormHelperText>{fieldErrors.lname}</FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel>Phone</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter phone number"
                            name="phone"
                            required
                            value={editedLivreur.phone || ''}
                            onChange={handleFieldChange}
                        />
                      </Stack>
                      <FormHelperText>{fieldErrors.phone}</FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel>Email</InputLabel>
                        <TextField
                            fullWidth
                            placeholder="Enter email"
                            name="email"
                            value={editedLivreur.email || ''}
                            required
                            //onBlur={handleEmailBlur}
                            onChange={handleFieldChange}
                            //error={emailError !== ''}
                            //helperText={emailError}
                        />
                      </Stack>
                      <FormHelperText>{fieldErrors.email}</FormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel>City</InputLabel>
                        <FormControl fullWidth>
                          <Select name="city" value={editedLivreur.city || ''} onChange={handleFieldChange}>
                            {moroccanCities.map((city) => (
                                <MenuItem key={city} value={city}>
                                  {city}
                                </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormHelperText>{fieldErrors.city}</FormHelperText>
                      </Stack>
                    </Grid>

                    <CardActions>
                      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                        <Button variant="outlined" color="secondary" onClick={handleCloseEditDialog}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="contained" onClick={handleEditSave} startIcon={<SaveIcon />}>
                          Update
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


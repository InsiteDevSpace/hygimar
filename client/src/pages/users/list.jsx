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
  Select,
  MenuItem,
  InputLabel,
  TablePagination,
  Slide,
  Chip,
  Grid,
  FormHelperText,
  CardActions
} from '@mui/material';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

// Simple PopupTransition component
const PopupTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// table data
function createData(index, _id, fname, lname, email, role, id_role) {
  return { index, _id, fname, lname, email, role, id_role };
}

export default function LatestOrder() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [emptyField, setEmptyField] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getall`, {
          headers: {
            Authorization: `${token}`
          }
        });
        const responseData = await response.json();
        // Add unique IDs to each row and fetch role names
        const newData = await Promise.all(
          responseData.map(async (row, index) => {
            const roleResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/role/${row.id_role}`, {
              headers: {
                Authorization: `${token}`
              }
            });
            const roleData = await roleResponse.json();
            return createData(index + 1, row._id, row.fname, row.lname, row.email, roleData.role_name, row.id_role);
          })
        );
        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/role/getall`, {
          headers: {
            Authorization: `${token}`
          }
        });
        const responseData = await response.json();
        setRoles(responseData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchData();
    fetchRoles();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (_id) => {
    setUserToDelete(_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedData = data.filter((user) => user._id !== userToDelete);
        setData(updatedData);
        toast.success('User deleted successfully', { position: 'top-right' });
      } else {
        console.error('Error deleting user:', response.statusText);
        toast.error('Error deleting user', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user', { position: 'top-right' });
    }
    handleCloseDeleteDialog();
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedUser(null);
  };

  const handleEditClick = (user) => {
    console.log('Editing user:', user); // Debugging log
    setSelectedUser(user);
    setEditedUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
    setEditedUser({});
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/update/${editedUser._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        const roleResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/role/${editedUser.id_role}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        });
        const roleData = await roleResponse.json();
        const updatedData = data.map((user) => (user._id === editedUser._id ? { ...editedUser, role: roleData.role_name } : user));
        setData(updatedData);
        setOpenEditDialog(false);
        toast.success('User updated successfully', { position: 'top-right' });
      } else {
        console.error('Error updating user:', response.statusText);
        toast.error('Error updating user', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user', { position: 'top-right' });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setEditedUser((prev) => ({ ...prev, id_role: e.target.value }));
  };

  return (
    <MainCard
      title="Liste des utilisateurs"
      content={false}
      secondary={
        <Button component={RouterLink} to="/add-user" variant="contained" startIcon={<PlusOutlined />}>
          Ajouter utilisateur
        </Button>
      }
    >
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prenom</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Email</TableCell>

              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row._id}>
                <TableCell sx={{ pl: 3 }}>{row.index}</TableCell>
                <TableCell>{row.fname}</TableCell>
                <TableCell>{row.lname}</TableCell>
                <TableCell>
                  {(() => {
                    if (row.role === 'Manager') {
                      return <Chip color="success" label={row.role || 'N/A'} size="small" />;
                    } else {
                      return <Chip color="primary" label={row.role || 'N/A'} size="small" />;
                    }
                  })()}
                </TableCell>
                <TableCell>{row.email}</TableCell>

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
        aria-labelledby="delete-user-title"
        aria-describedby="delete-user-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
              <DeleteOutlinedIcon />
            </Avatar>
            <Stack spacing={2}>
              <Typography variant="h5" align="center">
                Etes-vous sûr que vous voulez supprimer?{' '}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={handleCloseDeleteDialog} color="secondary" variant="outlined">
                Annuler
              </Button>
              <Button fullWidth color="error" variant="contained" onClick={handleDeleteConfirm} autoFocus>
                Supprimer
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
        maxWidth="md"
        aria-labelledby="view-user-title"
        aria-describedby="view-user-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Afficher les détails de l'utilisateur">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Nom Complet</InputLabel>
                      <TextField fullWidth value={selectedUser ? `${selectedUser.fname} ${selectedUser.lname}` : ''} aria-readonly />
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Email</InputLabel>
                      <TextField fullWidth value={selectedUser ? `${selectedUser.email}` : ''} aria-readonly />
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Rôle</InputLabel>
                      <TextField fullWidth value={selectedUser ? selectedUser.role : 'N/A'} />
                    </Stack>
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
        maxWidth="md" // Adjusted width
        aria-labelledby="edit-user-details-title"
        aria-describedby="edit-user-details-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Modifier les détails de l'utilisateur">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Nom</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez votre nom"
                        name="fname"
                        value={editedUser.fname || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez saisir le nom</FormHelperText>{' '}
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Prenom</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez votre prénom"
                        name="lname"
                        value={editedUser.lname || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez saisir le prenom</FormHelperText>{' '}
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Email</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Entrez email"
                        name="email"
                        value={editedUser.email || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Veuillez saisir l'e-mail</FormHelperText>{' '}
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Role</InputLabel>
                      <Select labelId="role-label" name="id_role" value={editedUser.id_role || ''} onChange={handleRoleChange} fullWidth>
                        {roles.map((role) => (
                          <MenuItem key={role._id} value={role._id}>
                            {role.role_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                    <FormHelperText>Veuillez saisir le rôle</FormHelperText>{' '}
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

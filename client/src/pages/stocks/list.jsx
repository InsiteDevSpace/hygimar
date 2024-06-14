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
  FormControl,
  Menu
} from '@mui/material';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { EditOutlined } from '@ant-design/icons';
import { useStock } from 'contexts/stock/StockContext';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import { Link } from 'react-router-dom';

// Simple PopupTransition component
const PopupTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StockList() {
  const { stocks, suppliers, deleteStock, updateStock } = useStock();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedStock, setEditedStock] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (_id) => {
    setStockToDelete(_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setStockToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await deleteStock(stockToDelete);
    handleCloseDeleteDialog();
  };

  const handleViewDetails = (stock) => {
    setSelectedStock(stock);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedStock(null);
  };

  const handleEditClick = (stock) => {
    setSelectedStock(stock);
    setEditedStock({ ...stock, id_supplier: stock.id_supplier?._id || '' });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedStock(null);
    setEditedStock({});
  };

  const handleEditSave = async () => {
    await updateStock(editedStock._id, editedStock);
    handleCloseEditDialog();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedStock((prev) => ({ ...prev, [name]: value }));
  };

  const createData = (index, stock) => {
    return { ...stock, index: index + 1 };
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard
      title="List of Stocks"
      content={false}
      secondary={
        <Button component={RouterLink} to="/add-stock" variant="contained" startIcon={<PlusOutlined />}>
          Add Stock
        </Button>
      }
    >
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const rowData = createData(index, row);
              return (
                <TableRow hover key={row._id}>
                  <TableCell sx={{ pl: 3 }}>{rowData.index}</TableCell>
                  <TableCell>{rowData.name}</TableCell>
                  <TableCell>{rowData.warehouse}</TableCell>
                  <TableCell>{rowData.id_supplier?.fullname}</TableCell>
                  <TableCell align="center" sx={{ pr: 3 }}>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                      <IconButton color="inherit" size="large" onClick={() => handleEditClick(rowData)}>
                        <EditOutlined />
                      </IconButton>
                      <IconButton color="info" size="large" onClick={() => handleViewDetails(rowData)}>
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton color="error" size="large" onClick={() => handleDeleteClick(rowData._id)}>
                        <DeleteOutlinedIcon />
                      </IconButton>
                      <IconButton
                        variant="light"
                        color="inherit"
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <MoreOutlined />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button'
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <MenuItem
                          component={Link}
                          to="/apps/profiles/user/personal"
                          onClick={() => {
                            handleClose();
                            setTimeout(() => {
                              focusInput();
                            });
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem onClick={handleClose} disabled>
                          Delete
                        </MenuItem>
                      </Menu>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={stocks.length}
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
        aria-labelledby="delete-stock-title"
        aria-describedby="delete-stock-description"
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
        maxWidth="md" // Adjusted width
        aria-labelledby="view-stock-title"
        aria-describedby="view-stock-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="View Stock Details">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Name</InputLabel>
                      <TextField fullWidth placeholder="Enter name" name="name" value={selectedStock ? selectedStock.name : ''} />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Warehouse</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter warehouse"
                        name="warehouse"
                        value={selectedStock ? selectedStock.warehouse : ''}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Supplier</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_supplier" value={selectedStock ? selectedStock.id_supplier?._id : ''}>
                          {suppliers.map((supplier) => (
                            <MenuItem key={supplier._id} value={supplier._id}>
                              {supplier.fullname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Info</InputLabel>
                      <TextField fullWidth placeholder="Enter info" name="info" value={selectedStock ? selectedStock.info : ''} />
                    </Stack>
                  </Grid>

                  <CardActions>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                      <Button variant="outlined" color="secondary" onClick={handleCloseViewDialog}>
                        Cancel
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
        aria-labelledby="edit-stock-details-title"
        aria-describedby="edit-stock-details-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MainCard title="Edit Stock Details">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Name</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter name"
                        name="name"
                        value={editedStock.name || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Please enter the name</FormHelperText>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Warehouse</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter warehouse"
                        name="warehouse"
                        value={editedStock.warehouse || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Please enter the warehouse</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Supplier</InputLabel>
                      <FormControl fullWidth>
                        <Select name="id_supplier" value={editedStock.id_supplier || ''} onChange={handleFieldChange}>
                          {suppliers.map((supplier) => (
                            <MenuItem key={supplier._id} value={supplier._id}>
                              {supplier.fullname}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>Please select the supplier</FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>Info</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="Enter info"
                        name="info"
                        value={editedStock.info || ''}
                        onChange={handleFieldChange}
                      />
                    </Stack>
                    <FormHelperText>Please enter the info</FormHelperText>
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

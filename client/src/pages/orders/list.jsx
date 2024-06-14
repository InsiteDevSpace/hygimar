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
  CardActions,
  Box,
  Chip
} from '@mui/material';
import MainCard from 'components/MainCard';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { useOrder } from 'contexts/order/OrderContext';
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

const PopupTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListOrders() {
  const { orders, deleteOrder } = useOrder();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id) => {
    setOrderToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setOrderToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await deleteOrder(orderToDelete);
    handleCloseDeleteDialog();
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedOrder(null);
  };

  return (
    <MainCard
      title="Liste des commandes"
      content={false}
      secondary={
        <Button component={RouterLink} to="/add-order" variant="contained" startIcon={<PlusOutlined />}>
          Ajouter une commande
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Produits</TableCell>
              <TableCell>Quantité Totale</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
              <TableRow hover key={order._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.client_id.fullname}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.products.map((product) => (
                    <div key={product.product_id}>
                      {product.name} (x{product.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>{order.totalQuantity}</TableCell>

                <TableCell align="center" sx={{ pr: 2 }}>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <IconButton color="secondary" size="large" onClick={() => handleViewDetails(order)}>
                      <VisibilityOutlinedIcon />
                    </IconButton>
                    <IconButton color="error" size="large" onClick={() => handleDeleteClick(order._id)}>
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
        count={orders.length}
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
        aria-labelledby="delete-order-title"
        aria-describedby="delete-order-description"
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
        fullWidth
        maxWidth="md"
        aria-labelledby="view-order-title"
        aria-describedby="view-order-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <MainCard title="Détails de la commande">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Client</Typography>
                <Typography variant="body2">{selectedOrder?.client_id?.fullname}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Date de commande</Typography>
                <Typography variant="body2">{new Date(selectedOrder?.date).toLocaleDateString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6">Quantité Totale</Typography>
                <Typography variant="body2">{selectedOrder?.totalQuantity}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Produits</Typography>
                {selectedOrder?.products.map((product, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{product.name}</Typography>
                    <Typography variant="body2">Quantité: {product.quantity}</Typography>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Demande</Typography>
                <Typography variant="body2">{selectedOrder?.notes}</Typography>
              </Grid>
              <Grid item xs={12}>
                <CardActions>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Button variant="outlined" color="secondary" onClick={handleCloseViewDialog}>
                      Anuller
                    </Button>
                  </Stack>
                </CardActions>
              </Grid>
            </Grid>
          </MainCard>
        </DialogContent>
      </Dialog>
    </MainCard>
  );
}

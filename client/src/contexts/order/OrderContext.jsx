import React, { createContext, useContext, useEffect, useState } from 'react';
import api from 'utils/api';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/order/getall');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/client/getall');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/product/getall');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addOrder = async (orderData) => {
    try {
      const response = await api.post('/api/order/create', orderData);
      setOrders((prevOrders) => [...prevOrders, response.data]);
      toast.success('Order added successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Error adding order', { position: 'top-right' });
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      const response = await api.put(`/api/order/update/${id}`, orderData);
      const updatedOrders = orders.map((order) => (order._id === id ? response.data : order));
      setOrders(updatedOrders);
      toast.success('Order updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error updating order', { position: 'top-right' });
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.delete(`/api/order/delete/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
      toast.success('Order deleted successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error deleting order', { position: 'top-right' });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        clients,
        products,
        addOrder,
        updateOrder,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

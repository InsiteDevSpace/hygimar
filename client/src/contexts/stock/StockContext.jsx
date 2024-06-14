import React, { createContext, useContext, useState, useEffect } from 'react';
import api from 'utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StockContext = createContext();

export const useStock = () => {
  return useContext(StockContext);
};

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockResponse = await api.get('/api/stock/getall');
        setStocks(stockResponse.data);

        const supplierResponse = await api.get('/api/supplier/getall');
        setSuppliers(supplierResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addStock = async (newStock) => {
    try {
      const response = await api.post('/api/stock/create', newStock);
      const stockResponse = await api.get('/api/stock/getall');
      setStocks(stockResponse.data);
      toast.success('Stock added successfully', { position: 'top-right' });
      navigate('/stocks');
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Error adding stock', { position: 'top-right' });
    }
  };

  const deleteStock = async (id) => {
    try {
      await api.delete(`/api/stock/delete/${id}`);
      setStocks(stocks.filter((stock) => stock._id !== id));
      toast.success('Stock deleted successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Error deleting stock', { position: 'top-right' });
    }
  };

  const updateStock = async (id, updatedStock) => {
    try {
      const response = await api.put(`/api/stock/update/${id}`, updatedStock);
      const stockResponse = await api.get('/api/stock/getall');
      setStocks(stockResponse.data);
      toast.success('Stock updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error updating stock', { position: 'top-right' });
    }
  };

  return <StockContext.Provider value={{ stocks, suppliers, addStock, deleteStock, updateStock }}>{children}</StockContext.Provider>;
};

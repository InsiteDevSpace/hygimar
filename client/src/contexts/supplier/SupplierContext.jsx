import React, { createContext, useContext, useState, useEffect } from 'react';
import api from 'utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SupplierContext = createContext();

export const useSupplier = () => {
  return useContext(SupplierContext);
};

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const supplierResponse = await api.get('/api/supplier/getall');
      setSuppliers(supplierResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addSupplier = async (newSupplier) => {
    try {
      await api.post('/api/supplier/create', newSupplier);
      fetchSuppliers();
      toast.success('Supplier added successfully', { position: 'top-right' });
      navigate('/suppliers');
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Error adding supplier', { position: 'top-right' });
    }
  };

  const updateSupplier = async (updatedSupplier) => {
    try {
      await api.put(`/api/supplier/update/${updatedSupplier._id}`, updatedSupplier);
      fetchSuppliers();
      toast.success('Supplier updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Error updating supplier', { position: 'top-right' });
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await api.delete(`/api/supplier/delete/${supplierId}`);
      fetchSuppliers();
      toast.success('Supplier deleted successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Error deleting supplier', { position: 'top-right' });
    }
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};

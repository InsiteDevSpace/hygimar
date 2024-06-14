import React, { createContext, useContext, useEffect, useState } from 'react';
import api from 'utils/api';
import toast from 'react-hot-toast';

const ClientContext = createContext();

export const useClient = () => {
  return useContext(ClientContext);
};

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/client/getall');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error fetching clients', { position: 'top-right' });
    }
  };

  const addClient = async (clientData) => {
    try {
      const response = await api.post('/api/client/create', clientData);
      setClients((prevClients) => [...prevClients, response.data]);
      toast.success('Client added successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Error adding client', { position: 'top-right' });
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const response = await api.put(`/api/client/update/${id}`, clientData);
      setClients((prevClients) => prevClients.map((client) => (client._id === id ? response.data : client)));
      toast.success('Client updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error updating client', { position: 'top-right' });
    }
  };

  const deleteClient = async (id) => {
    try {
      await api.delete(`/api/client/delete/${id}`);
      setClients((prevClients) => prevClients.filter((client) => client._id !== id));
      toast.success('Client deleted successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error deleting client', { position: 'top-right' });
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        fetchClients,
        addClient,
        updateClient,
        deleteClient
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

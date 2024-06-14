import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'utils/api';
import toast from 'react-hot-toast';

const LivreurContext = createContext();

export const useLivreur = () => {
  return useContext(LivreurContext);
};

export const LivreurProvider = ({ children }) => {
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        const response = await api.get('/api/livreur/getall');
        setLivreurs(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivreurs();
  }, []);

  const addLivreur = async (newLivreur) => {
    try {
      const response = await api.post('/api/livreur/create', newLivreur);
      const createdLivreur = response.data;

      setLivreurs((prevLivreurs) => [...prevLivreurs, createdLivreur]);

      toast.success('Livreur added successfully', { position: 'top-right' });
      navigate('/livreurs');
    } catch (error) {
      console.error('Error adding livreur:', error);
      toast.error('Error adding livreur', { position: 'top-right' });
    }
  };

  const updateLivreur = async (id, updatedLivreur) => {
    try {
      const response = await api.put(`/api/livreur/update/${id}`, updatedLivreur);
      setLivreurs((prevLivreurs) => prevLivreurs.map((livreur) => (livreur._id === id ? response.data : livreur)));
      toast.success('Livreur updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating livreur:', error);
      toast.error('Error updating livreur', { position: 'top-right' });
    }
  };

  const deleteLivreur = async (id) => {
    try {
      await api.delete(`/api/livreur/delete/${id}`);
      setLivreurs((prevLivreurs) => prevLivreurs.filter((livreur) => livreur._id !== id));
      toast.success('Livreur deleted successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting livreur:', error);
      toast.error('Error deleting livreur', { position: 'top-right' });
    }
  };

  return (
    <LivreurContext.Provider value={{ livreurs, addLivreur, updateLivreur, deleteLivreur, loading }}>{children}</LivreurContext.Provider>
  );
};

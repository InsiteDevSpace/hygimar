import React, { createContext, useContext, useState, useEffect } from 'react';
import api from 'utils/api';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get('/api/auth/details');
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const updateUserDetails = async (userData) => {
    try {
      const response = await api.put('/api/auth/update', userData);
      setUserDetails(response.data);
      toast.success('User details updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error('Error updating user details', { position: 'top-right' });
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await api.put('/api/auth/change-password', { oldPassword, newPassword });
      toast.success('Password changed successfully', { position: 'top-right' });
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.msg, { position: 'top-right' });
      } else {
        toast.error('An error occurred', { position: 'top-right' });
      }
    }
  };

  return <UserContext.Provider value={{ userDetails, updateUserDetails, changePassword }}>{children}</UserContext.Provider>;
};

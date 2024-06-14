import React, { createContext, useContext, useEffect, useState } from 'react';
import api from 'utils/api';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/product/getall');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/category/getall');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await api.get('/api/subcategory/getall');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await api.post('/api/product/create', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProducts((prevProducts) => [...prevProducts, response.data]);
      toast.success('Product added successfully', { position: 'top-right' });
      fetchProducts(); // Fetch updated list of products
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product', { position: 'top-right' });
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await api.put(`/api/product/update/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchProducts();
      toast.success('Product updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product', { position: 'top-right' });
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/product/delete/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      toast.success('Product deleted successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product', { position: 'top-right' });
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        subcategories,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

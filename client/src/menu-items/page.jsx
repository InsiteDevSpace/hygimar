// assets
import {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  DollarOutlined,
  FileDoneOutlined,
  SkinOutlined,
  TruckOutlined,
  ApartmentOutlined
} from '@ant-design/icons';

import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  DollarOutlined,
  FileDoneOutlined,
  SkinOutlined,
  TruckOutlined,
  ApartmentOutlined,
  CategoryOutlinedIcon,
  Inventory2OutlinedIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'features',
  title: 'Fonctionalités',
  type: 'group',
  children: [
    /*{
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
   
    } */
    {
      id: 'users',
      title: 'Utilisateurs',
      type: 'item',
      url: '/users',
      icon: icons.ApartmentOutlined
    },
    {
      id: 'clients',
      title: 'Clients',
      type: 'item',
      url: '/clients',
      icon: icons.UserOutlined
    },
    {
      id: 'categories',
      title: 'Gammes de Produits',
      type: 'item',
      url: '/categories',
      icon: icons.CategoryOutlinedIcon
    },
    {
      id: 'subcategories',
      title: 'Subcategories',
      type: 'item',
      url: '/subcategories',
      icon: icons.CategoryOutlinedIcon
    },
    {
      id: 'orders',
      title: 'Commandes',
      type: 'item',
      url: '/orders',
      icon: icons.DollarOutlined
    },

    {
      id: 'products',
      title: 'Produits',
      type: 'item',
      url: '/products',
      icon: icons.SkinOutlined
    }
  ]
};

export default pages;

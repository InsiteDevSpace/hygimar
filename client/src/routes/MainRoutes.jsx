import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import AuthGuard from 'utils/withAuth'; // Import the AuthGuard component
import { LivreurProvider } from 'contexts/livreur/LivreurContext';
import { StockProvider } from 'contexts/stock/StockContext';
import { ProductProvider } from 'contexts/product/ProductContext';
import { SupplierProvider } from 'contexts/supplier/SupplierContext';
import { UserProvider } from 'contexts/user/UserContext';
import { OrderProvider } from 'contexts/order/OrderContext';
import { ClientProvider } from 'contexts/client/ClientContext';

const Users = Loadable(lazy(() => import('pages/users/list')));
const AddUser = Loadable(lazy(() => import('pages/users/add')));
const Clients = Loadable(lazy(() => import('pages/clients/list')));
const Categories = Loadable(lazy(() => import('pages/categories/list')));
const AddSubCategory = Loadable(lazy(() => import('pages/subcategories/add')));
const SubCategories = Loadable(lazy(() => import('pages/subcategories/list')));
const AddCategory = Loadable(lazy(() => import('pages/categories/add')));
const AddClient = Loadable(lazy(() => import('pages/clients/add')));
const Suppliers = Loadable(lazy(() => import('pages/suppliers/list')));
const AddSupplier = Loadable(lazy(() => import('pages/suppliers/add')));
const Products = Loadable(lazy(() => import('pages/products/list')));
const AddProduct = Loadable(lazy(() => import('pages/products/add')));
const Stocks = Loadable(lazy(() => import('pages/stocks/list')));
const AddStock = Loadable(lazy(() => import('pages/stocks/add')));
const Livreurs = Loadable(lazy(() => import('pages/livreurs/list')));
const AddLivreur = Loadable(lazy(() => import('pages/livreurs/add')));
const AddOrder = Loadable(lazy(() => import('pages/orders/add')));
const Orders = Loadable(lazy(() => import('pages/orders/list')));

const UserProfile = Loadable(lazy(() => import('pages/profile/user')));
const UserTabPersonal = Loadable(lazy(() => import('sections/profile/TabPersonal')));
const UserTabPassword = Loadable(lazy(() => import('sections/profile/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('sections/profile/TabSettings')));

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <AuthGuard>{<Dashboard />}</AuthGuard>,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'profiles',
      children: [
        {
          path: 'user',
          element: <UserProfile />,
          children: [
            {
              path: 'personal',
              element: (
                <UserProvider>
                  <UserTabPersonal />
                </UserProvider>
              )
            },
            {
              path: 'password',
              element: (
                <UserProvider>
                  <UserTabPassword />
                </UserProvider>
              )
            },
            {
              path: 'settings',
              element: <UserTabSettings />
            }
          ]
        }
      ]
    },
    {
      path: 'users',
      element: <Users />
    },
    {
      path: 'add-user',
      element: <AddUser />
    },
    {
      path: 'clients',
      element: <Clients />
    },
    {
      path: 'add-client',
      element: <AddClient />
    },
    {
      path: 'categories',
      element: <Categories />
    },
    {
      path: 'add-category',
      element: <AddCategory />
    },
    {
      path: 'subcategories',
      element: <SubCategories />
    },
    {
      path: 'add-subcategory',
      element: <AddSubCategory />
    },
    {
      path: 'products',
      element: (
        <ProductProvider>
          <Products />
        </ProductProvider>
      )
    },
    {
      path: 'add-product',
      element: (
        <ProductProvider>
          <AddProduct />
        </ProductProvider>
      )
    },
    {
      path: 'orders',
      element: (
        <ClientProvider>
          <OrderProvider>
            <Orders />
          </OrderProvider>
        </ClientProvider>
      )
    },
    {
      path: 'add-order',
      element: (
        <ProductProvider>
          <ClientProvider>
            <OrderProvider>
              <AddOrder />
            </OrderProvider>
          </ClientProvider>
        </ProductProvider>
      )
    }
  ]
};

export default MainRoutes;
